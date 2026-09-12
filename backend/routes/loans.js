const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const loanController = require('../controllers/loanController');

// @route GET /api/loans
router.get('/', protect, loanController.getLoans);

// @route POST /api/loans
router.post('/', [protect, [
  check('principal', 'Principal is required and must be numeric').isNumeric(),
  check('interestRate', 'Interest rate is required and must be numeric').isNumeric(),
  check('termMonths', 'Term in months is required and must be numeric').isNumeric()
]], loanController.createLoan);

// @route POST /api/loans/calculate-emi
router.post('/calculate-emi', protect, loanController.calculateEMI);

// @route GET /api/loans/stats/summary
router.get('/stats/summary', protect, loanController.getStatsSummary);

// @route GET /api/loans/:id
router.get('/:id', protect, loanController.getLoan);

// @route PUT /api/loans/:id
router.put('/:id', protect, loanController.updateLoan);

// @route DELETE /api/loans/:id
router.delete('/:id', protect, loanController.deleteLoan);

module.exports = router;