const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// @route GET /api/users/me
router.get('/me', protect, userController.getMe);
// @route PUT /api/users/income
router.put('/income', protect, userController.updateIncome);

module.exports = router;
