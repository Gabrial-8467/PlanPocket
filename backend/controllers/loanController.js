const Loan = require('../models/Loan');
const { validationResult } = require('express-validator');

// Create a new loan
exports.createLoan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const body = { ...req.body };

    // If name is not provided, use notes as name
    if (!body.name && body.notes) {
      body.name = body.notes;
    }

    // Validate required amount field
    if (!body.amount) {
      return res.status(400).json({ error: 'Loan amount is required.' });
    }

    // Set remaining balance to the initial loan amount
    body.remainingBalance = body.amount;

    // Create new loan associated with the user
    const loan = new Loan({
      ...body,
      user: req.user.id
    });

    await loan.save();

    res.json(loan);
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
