const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const loanController = require('../controllers/loanController');

// @route POST /api/loans
router.post('/', [auth, [
  check('principal', 'Principal is required').isNumeric(),
  check('interestRate', 'Interest rate is required').isNumeric(),
  check('termMonths', 'Term in months is required').isNumeric()
]], loanController.createLoan);

// @route GET /api/loans
router.get('/', auth, loanController.getLoans);

module.exports = router;
