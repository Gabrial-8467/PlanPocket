const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// @route GET /api/users/me
router.get('/me', auth, userController.getMe);

module.exports = router;
