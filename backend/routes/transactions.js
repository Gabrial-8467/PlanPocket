const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const txController = require('../controllers/transactionController');

// @route POST /api/transactions
router.post('/', [auth, [
  check('type', 'Type is required').notEmpty(),
  check('category', 'Category is required').notEmpty(),
  check('amount', 'Amount is required and must be numeric').isNumeric()
]], txController.createTransaction);

// @route GET /api/transactions
router.get('/', auth, txController.getTransactions);

// @route GET /api/transactions/stats/summary
router.get('/stats/summary', auth, txController.getStatsSummary);

// @route DELETE /api/transactions/:id
router.delete('/:id', auth, txController.deleteTransaction);

module.exports = router;
