const Transaction = require('../models/Transaction');
const { validationResult } = require('express-validator');

exports.createTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { amount, ...rest } = req.body;
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number.' });
    }
    const tx = new Transaction({ ...rest, amount: amt, user: req.user.id });
    await tx.save();
    res.json(tx);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const txs = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(txs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    res.json(tx);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const allowed = ['type', 'category', 'amount', 'description', 'date', 'notes'];
    const update = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }
    if (update.amount !== undefined) {
      const amt = Number(update.amount);
      if (isNaN(amt) || amt <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number.' });
      }
      update.amount = amt;
    }
    const tx = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: update },
      { new: true, runValidators: true }
    );
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    res.json(tx);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!tx) return res.status(404).json({ msg: 'Transaction not found' });
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getStatsSummary = async (req, res) => {
  try {
    const txs = await Transaction.find({ user: req.user.id });
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthly = txs.filter(tx => new Date(tx.date) >= monthStart);
    const monthlyExpenses = monthly
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const monthlyIncome = monthly
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const budgetUsed = monthlyIncome > 0 ? Math.round((monthlyExpenses / monthlyIncome) * 100) : 0;
    res.json({
      monthlyExpenses,
      monthlyIncome,
      budgetUsed,
      remainingBudget: monthlyIncome - monthlyExpenses
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
