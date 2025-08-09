import express from 'express';
import { body } from 'express-validator';
import {
  getLoans,
  getLoan,
  createLoan,
  updateLoan,
  deleteLoan,
  calculateEMI,
  addPayment,
  getLoansByStatus
} from '../controllers/loanController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation middleware
const loanValidation = [
  body('loanType')
    .isIn(['personal', 'home', 'car', 'education', 'business'])
    .withMessage('Please select a valid loan type'),
  body('loanAmount')
    .isFloat({ min: 1 })
    .withMessage('Loan amount must be greater than 0'),
  body('interestRate')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Interest rate must be between 0 and 100'),
  body('loanTerm')
    .isInt({ min: 1 })
    .withMessage('Loan term must be at least 1 month'),
  body('lenderName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Lender name must be between 1 and 100 characters'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid start date')
];

const updateLoanValidation = [
  body('loanType')
    .optional()
    .isIn(['personal', 'home', 'car', 'education', 'business'])
    .withMessage('Please select a valid loan type'),
  body('loanAmount')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Loan amount must be greater than 0'),
  body('interestRate')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Interest rate must be between 0 and 100'),
  body('loanTerm')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Loan term must be at least 1 month'),
  body('lenderName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Lender name must be between 1 and 100 characters'),
  body('status')
    .optional()
    .isIn(['active', 'completed', 'defaulted', 'pending'])
    .withMessage('Please select a valid status')
];

const emiCalculationValidation = [
  body('principal')
    .isFloat({ min: 1 })
    .withMessage('Principal amount must be greater than 0'),
  body('rate')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Interest rate must be between 0 and 100'),
  body('term')
    .isInt({ min: 1 })
    .withMessage('Term must be at least 1 month')
];

const paymentValidation = [
  body('amountPaid')
    .isFloat({ min: 0.01 })
    .withMessage('Payment amount must be greater than 0'),
  body('paymentDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid payment date'),
  body('paymentMethod')
    .optional()
    .isIn(['bank_transfer', 'cash', 'cheque', 'online', 'auto_debit'])
    .withMessage('Please select a valid payment method')
];

// Routes
router.route('/')
  .get(getLoans)
  .post(loanValidation, createLoan);

router.route('/:id')
  .get(getLoan)
  .put(updateLoanValidation, updateLoan)
  .delete(deleteLoan);

// Additional routes
router.post('/calculate-emi', emiCalculationValidation, calculateEMI);
router.post('/:id/payments', paymentValidation, addPayment);
router.get('/status/:status', getLoansByStatus);

export default router;
