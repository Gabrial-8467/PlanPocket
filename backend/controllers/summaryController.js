import Transaction from '../models/Transaction.js';
import Loan from '../models/Loan.js';
import User from '../models/User.js';

// @desc    Get overall financial summary
// @route   GET /api/summary
// @access  Private
export const getFinancialSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get user data
    const user = await User.findById(userId);

    // Get current month transactions
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const monthlyTransactions = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get all-time totals
    const allTimeTransactions = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get loan summary
    const loanSummary = await Loan.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalLoanAmount: { $sum: '$loanAmount' },
          totalRemainingBalance: { $sum: '$remainingBalance' },
          totalMonthlyEMI: { $sum: '$monthlyEMI' },
          activeLoans: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get recent transactions
    const recentTransactions = await Transaction.find({ user: userId })
      .sort({ date: -1 })
      .limit(5)
      .select('type description amount category date');

    // Calculate monthly data
    const monthlyIncome = monthlyTransactions.find(t => t._id === 'income')?.total || 0;
    const monthlyExpenses = monthlyTransactions.find(t => t._id === 'expense')?.total || 0;
    const monthlyNet = monthlyIncome - monthlyExpenses;

    // Calculate all-time data
    const totalIncome = allTimeTransactions.find(t => t._id === 'income')?.total || 0;
    const totalExpenses = allTimeTransactions.find(t => t._id === 'expense')?.total || 0;
    const allTimeNet = totalIncome - totalExpenses;

    // Calculate budget utilization
    const budgetUtilization = user.monthlyIncome > 0 
      ? Math.round((monthlyExpenses / user.monthlyIncome) * 100) 
      : 0;

    const summary = {
      user: {
        name: user.name,
        email: user.email,
        annualIncome: user.annualIncome,
        monthlyIncome: user.monthlyIncome
      },
      currentMonth: {
        income: monthlyIncome,
        expenses: monthlyExpenses,
        netAmount: monthlyNet,
        budgetUtilization,
        remaining: user.monthlyIncome - monthlyExpenses,
        transactionCount: {
          income: monthlyTransactions.find(t => t._id === 'income')?.count || 0,
          expense: monthlyTransactions.find(t => t._id === 'expense')?.count || 0
        }
      },
      allTime: {
        income: totalIncome,
        expenses: totalExpenses,
        netAmount: allTimeNet,
        transactionCount: {
          income: allTimeTransactions.find(t => t._id === 'income')?.count || 0,
          expense: allTimeTransactions.find(t => t._id === 'expense')?.count || 0
        }
      },
      loans: loanSummary[0] || {
        totalLoanAmount: 0,
        totalRemainingBalance: 0,
        totalMonthlyEMI: 0,
        activeLoans: 0
      },
      recentTransactions
    };

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly analysis
// @route   GET /api/summary/monthly/:year/:month
// @access  Private
export const getMonthlyAnalysis = async (req, res, next) => {
  try {
    const { year, month } = req.params;
    const userId = req.user._id;
    
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    // Get transactions for the month
    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    // Category breakdown
    const categoryBreakdown = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { type: '$type', category: '$category' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.type',
          categories: {
            $push: {
              category: '$_id.category',
              amount: '$total',
              count: '$count'
            }
          },
          total: { $sum: '$total' }
        }
      }
    ]);

    // Daily breakdown
    const dailyBreakdown = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $group: {
          _id: '$_id.day',
          income: {
            $sum: { $cond: [{ $eq: ['$_id.type', 'income'] }, '$total', 0] }
          },
          expense: {
            $sum: { $cond: [{ $eq: ['$_id.type', 'expense'] }, '$total', 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        period: { year: parseInt(year), month: parseInt(month) },
        transactions,
        categoryBreakdown,
        dailyBreakdown,
        summary: {
          totalIncome: categoryBreakdown.find(c => c._id === 'income')?.total || 0,
          totalExpenses: categoryBreakdown.find(c => c._id === 'expense')?.total || 0,
          transactionCount: transactions.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get yearly analysis
// @route   GET /api/summary/yearly/:year
// @access  Private
export const getYearlyAnalysis = async (req, res, next) => {
  try {
    const { year } = req.params;
    const userId = req.user._id;
    
    const startDate = new Date(parseInt(year), 0, 1);
    const endDate = new Date(parseInt(year), 11, 31);

    // Monthly breakdown
    const monthlyBreakdown = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $group: {
          _id: '$_id.month',
          income: {
            $sum: { $cond: [{ $eq: ['$_id.type', 'income'] }, '$total', 0] }
          },
          expense: {
            $sum: { $cond: [{ $eq: ['$_id.type', 'expense'] }, '$total', 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Category totals for the year
    const yearlyCategories = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { type: '$type', category: '$category' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalIncome = monthlyBreakdown.reduce((sum, month) => sum + month.income, 0);
    const totalExpenses = monthlyBreakdown.reduce((sum, month) => sum + month.expense, 0);

    res.status(200).json({
      success: true,
      data: {
        year: parseInt(year),
        monthlyBreakdown,
        yearlyCategories,
        summary: {
          totalIncome,
          totalExpenses,
          netAmount: totalIncome - totalExpenses,
          averageMonthlyIncome: totalIncome / 12,
          averageMonthlyExpense: totalExpenses / 12
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category breakdown
// @route   GET /api/summary/category-breakdown
// @access  Private
export const getCategoryBreakdown = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, type } = req.query;

    let matchQuery = { user: userId };
    
    if (startDate && endDate) {
      matchQuery.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (type) {
      matchQuery.type = type;
    }

    const categoryData = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        categories: categoryData,
        filters: { startDate, endDate, type }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get spending trends
// @route   GET /api/summary/spending-trends
// @access  Private
export const getSpendingTrends = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { period = 'monthly', limit = 12 } = req.query;

    let groupBy, sortField;
    
    if (period === 'daily') {
      groupBy = {
        year: { $year: '$date' },
        month: { $month: '$date' },
        day: { $dayOfMonth: '$date' }
      };
      sortField = { '_id.year': -1, '_id.month': -1, '_id.day': -1 };
    } else if (period === 'weekly') {
      groupBy = {
        year: { $year: '$date' },
        week: { $week: '$date' }
      };
      sortField = { '_id.year': -1, '_id.week': -1 };
    } else {
      groupBy = {
        year: { $year: '$date' },
        month: { $month: '$date' }
      };
      sortField = { '_id.year': -1, '_id.month': -1 };
    }

    const trends = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: groupBy,
          income: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
          },
          expense: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
          },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: sortField },
      { $limit: parseInt(limit) }
    ]);

    res.status(200).json({
      success: true,
      data: {
        period,
        trends: trends.reverse(), // Show oldest to newest
        summary: {
          periods: trends.length,
          totalIncome: trends.reduce((sum, t) => sum + t.income, 0),
          totalExpenses: trends.reduce((sum, t) => sum + t.expense, 0)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cash flow analysis
// @route   GET /api/summary/cash-flow/:period
// @access  Private
export const getCashFlowAnalysis = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { period } = req.params; // 'monthly', 'quarterly', 'yearly'
    
    let startDate, endDate, groupBy;
    const currentDate = new Date();
    
    switch (period) {
      case 'monthly':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 11, 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        groupBy = {
          year: { $year: '$date' },
          month: { $month: '$date' }
        };
        break;
      case 'quarterly':
        startDate = new Date(currentDate.getFullYear() - 2, 0, 1);
        endDate = new Date(currentDate.getFullYear(), 11, 31);
        groupBy = {
          year: { $year: '$date' },
          quarter: { $ceil: { $divide: [{ $month: '$date' }, 3] } }
        };
        break;
      case 'yearly':
        startDate = new Date(currentDate.getFullYear() - 4, 0, 1);
        endDate = new Date(currentDate.getFullYear(), 11, 31);
        groupBy = {
          year: { $year: '$date' }
        };
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid period. Use monthly, quarterly, or yearly'
        });
    }

    const cashFlow = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: groupBy,
          income: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
          },
          expense: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
          }
        }
      },
      {
        $addFields: {
          netCashFlow: { $subtract: ['$income', '$expense'] }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.quarter': 1 } }
    ]);

    // Calculate running balance
    let runningBalance = 0;
    const cashFlowWithBalance = cashFlow.map(item => {
      runningBalance += item.netCashFlow;
      return {
        ...item,
        runningBalance
      };
    });

    res.status(200).json({
      success: true,
      data: {
        period,
        cashFlow: cashFlowWithBalance,
        summary: {
          totalIncome: cashFlow.reduce((sum, cf) => sum + cf.income, 0),
          totalExpenses: cashFlow.reduce((sum, cf) => sum + cf.expense, 0),
          totalNetCashFlow: cashFlow.reduce((sum, cf) => sum + cf.netCashFlow, 0),
          finalBalance: runningBalance
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
