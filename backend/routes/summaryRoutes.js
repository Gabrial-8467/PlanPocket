import express from 'express';
import {
  getFinancialSummary,
  getMonthlyAnalysis,
  getYearlyAnalysis,
  getCategoryBreakdown,
  getSpendingTrends,
  getCashFlowAnalysis
} from '../controllers/summaryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.get('/', getFinancialSummary);
router.get('/monthly/:year/:month', getMonthlyAnalysis);
router.get('/yearly/:year', getYearlyAnalysis);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/spending-trends', getSpendingTrends);
router.get('/cash-flow/:period', getCashFlowAnalysis);

export default router;
