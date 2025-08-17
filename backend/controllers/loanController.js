const Loan = require('../models/Loan');
const { validationResult } = require('express-validator');

exports.createLoan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const loan = new Loan({ ...req.body, user: req.user.id });
    await loan.save();
    res.json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user.id }).sort({ startDate: -1 });
    res.json(loans);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
