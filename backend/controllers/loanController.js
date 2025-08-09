import { validationResult } from 'express-validator';
import Loan from '../models/Loan.js';

// @desc    Get all loans for user
// @route   GET /api/loans
// @access  Private
export const getLoans = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Build query
    const query = { user: req.user.id };

    // Add filters if provided
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.loanType) {
      query.loanType = req.query.loanType;
    }

    const loans = await Loan.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex)
      .populate('user', 'name email');

    const total = await Loan.countDocuments(query);

    // Calculate summary statistics
    const summary = await Loan.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalLoanAmount: { $sum: '$loanAmount' },
          totalRemainingBalance: { $sum: '$remainingBalance' },
          totalMonthlyEMI: { $sum: '$monthlyEMI' },
          activeLoans: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          completedLoans: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      }
    ]);

    const loanSummary = summary[0] || {
      totalLoanAmount: 0,
      totalRemainingBalance: 0,
      totalMonthlyEMI: 0,
      activeLoans: 0,
      completedLoans: 0
    };

    res.status(200).json({
      success: true,
      count: loans.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      summary: loanSummary,
      data: {
        loans
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single loan
// @route   GET /api/loans/:id
// @access  Private
export const getLoan = async (req, res, next) => {
  try {
    const loan = await Loan.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('user', 'name email');

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        loan
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new loan
// @route   POST /api/loans
// @access  Private
export const createLoan = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Add user to req.body
    req.body.user = req.user.id;

    const loan = await Loan.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Loan created successfully',
      data: {
        loan
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update loan
// @route   PUT /api/loans/:id
// @access  Private
export const updateLoan = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    let loan = await Loan.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    loan = await Loan.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Loan updated successfully',
      data: {
        loan
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete loan
// @route   DELETE /api/loans/:id
// @access  Private
export const deleteLoan = async (req, res, next) => {
  try {
    const loan = await Loan.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    await Loan.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Loan deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate EMI
// @route   POST /api/loans/calculate-emi
// @access  Private
export const calculateEMI = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { principal, rate, term } = req.body;

    const calculation = Loan.calculateEMI(principal, rate, term);

    res.status(200).json({
      success: true,
      data: {
        principal,
        interestRate: rate,
        loanTerm: term,
        monthlyEMI: calculation.emi,
        totalAmount: calculation.totalAmount,
        totalInterest: calculation.totalInterest
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add payment to loan
// @route   POST /api/loans/:id/payments
// @access  Private
export const addPayment = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const loan = await Loan.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    const { amountPaid, paymentDate = new Date(), paymentMethod = 'online', notes } = req.body;

    // Calculate principal and interest portions
    const remainingBalance = loan.remainingBalance;
    const monthlyRate = loan.interestRate / (12 * 100);
    const interestPaid = remainingBalance * monthlyRate;
    const principalPaid = Math.min(amountPaid - interestPaid, remainingBalance);
    const newRemainingBalance = Math.max(remainingBalance - principalPaid, 0);

    // Add payment to history
    const payment = {
      paymentDate,
      amountPaid,
      principalPaid,
      interestPaid,
      remainingBalance: newRemainingBalance,
      paymentMethod,
      notes
    };

    loan.paymentHistory.push(payment);
    loan.remainingBalance = newRemainingBalance;

    // Update loan status if fully paid
    if (newRemainingBalance === 0) {
      loan.status = 'completed';
    }

    // Update next payment date
    if (loan.status === 'active' && newRemainingBalance > 0) {
      const nextDate = new Date(paymentDate);
      nextDate.setMonth(nextDate.getMonth() + 1);
      loan.nextPaymentDate = nextDate;
    }

    await loan.save();

    res.status(200).json({
      success: true,
      message: 'Payment added successfully',
      data: {
        loan,
        payment
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get loans by status
// @route   GET /api/loans/status/:status
// @access  Private
export const getLoansByStatus = async (req, res, next) => {
  try {
    const loans = await Loan.find({
      user: req.user.id,
      status: req.params.status
    }).sort({ createdAt: -1 });

    const summary = loans.reduce((acc, loan) => {
      acc.totalAmount += loan.loanAmount;
      acc.totalRemaining += loan.remainingBalance;
      acc.totalEMI += loan.monthlyEMI;
      return acc;
    }, { totalAmount: 0, totalRemaining: 0, totalEMI: 0 });

    res.status(200).json({
      success: true,
      count: loans.length,
      status: req.params.status,
      summary,
      data: {
        loans
      }
    });
  } catch (error) {
    next(error);
  }
};
