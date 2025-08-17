const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  principal: { type: Number, required: true },
  interestRate: { type: Number, required: true }, // annual percent
  termMonths: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Loan', LoanSchema);
