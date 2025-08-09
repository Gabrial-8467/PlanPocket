import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  loanType: {
    type: String,
    required: [true, 'Please specify loan type'],
    enum: ['personal', 'home', 'car', 'education', 'business'],
    lowercase: true
  },
  loanAmount: {
    type: Number,
    required: [true, 'Please add loan amount'],
    min: [1, 'Loan amount must be greater than 0']
  },
  interestRate: {
    type: Number,
    required: [true, 'Please add interest rate'],
    min: [0, 'Interest rate cannot be negative'],
    max: [100, 'Interest rate cannot exceed 100%']
  },
  loanTerm: {
    type: Number,
    required: [true, 'Please add loan term in months'],
    min: [1, 'Loan term must be at least 1 month']
  },
  monthlyEMI: {
    type: Number,
    required: true
  },
  totalInterest: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  lenderName: {
    type: String,
    required: [true, 'Please add lender name'],
    trim: true,
    maxlength: [100, 'Lender name cannot be more than 100 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Please add loan start date'],
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'defaulted', 'pending'],
    default: 'active'
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  collateral: {
    type: String,
    trim: true
  },
  guarantor: {
    name: String,
    phone: String,
    email: String
  },
  documents: [{
    name: String,
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  paymentHistory: [{
    paymentDate: {
      type: Date,
      required: true
    },
    amountPaid: {
      type: Number,
      required: true,
      min: [0, 'Payment amount cannot be negative']
    },
    principalPaid: {
      type: Number,
      required: true
    },
    interestPaid: {
      type: Number,
      required: true
    },
    remainingBalance: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['bank_transfer', 'cash', 'cheque', 'online', 'auto_debit'],
      default: 'online'
    },
    notes: String
  }],
  remainingBalance: {
    type: Number,
    default: function() {
      return this.loanAmount;
    }
  },
  nextPaymentDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate EMI and other loan details before saving
loanSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('loanAmount') || this.isModified('interestRate') || this.isModified('loanTerm')) {
    // EMI Calculation: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const principal = this.loanAmount;
    const monthlyRate = this.interestRate / (12 * 100);
    const numberOfPayments = this.loanTerm;

    if (monthlyRate === 0) {
      // If no interest, EMI is simply principal divided by term
      this.monthlyEMI = principal / numberOfPayments;
    } else {
      const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                  (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      this.monthlyEMI = Math.round(emi * 100) / 100; // Round to 2 decimal places
    }

    this.totalAmount = this.monthlyEMI * numberOfPayments;
    this.totalInterest = this.totalAmount - principal;

    // Calculate end date
    if (this.startDate) {
      this.endDate = new Date(this.startDate);
      this.endDate.setMonth(this.endDate.getMonth() + this.loanTerm);
    }

    // Set next payment date (1 month from start date)
    if (this.startDate && this.status === 'active') {
      this.nextPaymentDate = new Date(this.startDate);
      this.nextPaymentDate.setMonth(this.nextPaymentDate.getMonth() + 1);
    }
  }

  this.updatedAt = Date.now();
  next();
});

// Static method to calculate EMI
loanSchema.statics.calculateEMI = function(principal, rate, term) {
  const monthlyRate = rate / (12 * 100);
  
  if (monthlyRate === 0) {
    return {
      emi: principal / term,
      totalAmount: principal,
      totalInterest: 0
    };
  }

  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
              (Math.pow(1 + monthlyRate, term) - 1);
  
  const totalAmount = emi * term;
  const totalInterest = totalAmount - principal;

  return {
    emi: Math.round(emi * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100
  };
};

// Index for better query performance
loanSchema.index({ user: 1, status: 1 });
loanSchema.index({ user: 1, loanType: 1 });
loanSchema.index({ user: 1, nextPaymentDate: 1 });

export default mongoose.model('Loan', loanSchema);
