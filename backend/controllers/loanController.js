const Loan = require('../models/Loan');
const { validationResult } = require('express-validator');

// Create a new loan
exports.createLoan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { principal, name, notes, interestRate, termMonths, remainingBalance } = req.body;

    if (typeof principal !== 'number' || isNaN(principal) || principal <= 0) {
      return res.status(400).json({ message: 'Loan principal must be a positive number.' });
    }

    const loan = new Loan({
      principal,
      name: (name || notes || 'Loan').toString(),
      remainingBalance: remainingBalance ?? principal,
      interestRate,
      termMonths,
      notes: notes || name || '',
      user: req.user.id
    });

    await loan.save();

    res.status(201).json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get all loans for the authenticated user
exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user.id }).sort({ startDate: -1 });
    res.json(loans);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get a single loan for the authenticated user
exports.getLoan = async (req, res) => {
  try {
    const loan = await Loan.findOne({ _id: req.params.id, user: req.user.id });
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Update a loan for the authenticated user
exports.updateLoan = async (req, res) => {
  try {
    const { principal, name, notes, interestRate, termMonths, remainingBalance } = req.body;
    const update = {};
    if (principal !== undefined) update.principal = principal;
    if (name !== undefined) update.name = name;
    if (notes !== undefined) update.notes = notes;
    if (interestRate !== undefined) update.interestRate = interestRate;
    if (termMonths !== undefined) update.termMonths = termMonths;
    if (remainingBalance !== undefined) update.remainingBalance = remainingBalance;

    const loan = await Loan.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: update },
      { new: true, runValidators: true }
    );
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Delete a loan for the authenticated user
exports.deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.json({ message: 'Loan deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Calculate EMI
exports.calculateEMI = (req, res) => {
  const { principal, interestRate, termMonths } = req.body;
  const p = Number(principal);
  const annualRate = Number(interestRate);
  const n = Number(termMonths);

  if (!p || !n || p <= 0 || n <= 0) {
    return res.status(400).json({ message: 'principal and termMonths must be positive numbers' });
  }

  const monthlyRate = annualRate > 0 ? annualRate / 100 / 12 : 0;
  let monthlyInstallment;
  if (monthlyRate === 0) {
    monthlyInstallment = p / n;
  } else {
    const pow = Math.pow(1 + monthlyRate, n);
    monthlyInstallment = p * (monthlyRate * pow) / (pow - 1);
  }

  res.json({
    monthlyInstallment: Math.round(monthlyInstallment * 100) / 100,
    principal: p,
    interestRate: annualRate,
    termMonths: n
  });
};

// Stats summary for the authenticated user's loans
exports.getStatsSummary = async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user.id });
    const totalOutstandingDebt = loans.reduce((sum, loan) => sum + (loan.remainingBalance || 0), 0);

    const totalLoanInstallments = loans.reduce((sum, loan) => {
      const p = loan.principal || 0;
      const n = loan.termMonths || 0;
      const annualRate = loan.interestRate || 0;
      if (!p || !n) return sum;
      const monthlyRate = annualRate > 0 ? annualRate / 100 / 12 : 0;
      if (monthlyRate === 0) return sum + (p / n);
      const pow = Math.pow(1 + monthlyRate, n);
      return sum + (p * (monthlyRate * pow) / (pow - 1));
    }, 0);

    res.json({
      totalLoans: loans.length,
      totalOutstandingDebt,
      totalLoanInstallments
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};