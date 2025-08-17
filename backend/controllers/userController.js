const User = require('../models/User');

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.updateIncome = async (req, res) => {
  try {
    const { annualIncome } = req.body;
    if (typeof annualIncome !== 'number' || annualIncome <= 0) {
      return res.status(400).json({ msg: 'Invalid annual income' });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { annualIncome, monthlyIncome: Math.round(annualIncome / 12) },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
