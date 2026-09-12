const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const txController = require('../controllers/transactionController');

// @route GET /api/transactions/stats/summary
router.get('/stats/summary', protect, txController.getStatsSummary);

// @route GET /api/transactions
router.get('/', protect, txController.getTransactions);

// @route POST /api/transactions
router.post('/', [protect, [
  check('type', 'Type is required').notEmpty(),
  check('category', 'Category is required').notEmpty(),
  check('amount', 'Amount is required and must be numeric').isNumeric()
]], txController.createTransaction);

// @route GET /api/transactions/:id
router.get('/:id', protect, txController.getTransaction);

// @route PUT /api/transactions/:id
router.put('/:id', protect, txController.updateTransaction);

// @route DELETE /api/transactions/:id
router.delete('/:id', protect, txController.deleteTransaction);

module.exports = router;