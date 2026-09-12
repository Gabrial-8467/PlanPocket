const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { register, login, getProfile, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes (validated)
router.post('/register', [
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
], register);

router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], login);

// Protected routes
router.get('/me', protect, getProfile);

router.put('/profile', [
  check('name', 'Name is required').optional().notEmpty(),
  check('email', 'Please include a valid email').optional().isEmail()
], protect, updateProfile);

router.put('/change-password', [
  check('currentPassword', 'Current password is required').exists(),
  check('newPassword', 'New password must be 6 or more characters').isLength({ min: 6 })
], protect, changePassword);

module.exports = router;