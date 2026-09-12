const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  contactNumber: { type: String },
  address: { type: String },
  occupationType: { type: String },
  annualIncome: { type: Number, default: 0 },
  monthlyIncome: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);