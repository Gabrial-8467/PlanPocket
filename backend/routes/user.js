const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// @route GET /api/users/me
router.get('/me', auth, userController.getMe);
// @route PUT /api/users/income
router.put('/income', auth, userController.updateIncome);

module.exports = router;
