require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/user');
const transactionRoutes = require('./routes/transactions');
const loanRoutes = require('./routes/loans');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

// Middleware
app.use(helmet());
app.use(compression());

// Restrict CORS to FRONTEND_URL from .env
const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/loans', loanRoutes);

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// API info (root)
app.get('/', (req, res) => {
  res.json({
    name: 'PlanPocket API',
    version: '1.0.0',
    status: 'online',
    baseUrl: `${req.protocol}://${req.get('host')}`,
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        changePassword: 'PUT /api/auth/change-password',
      },
      users: {
        me: 'GET /api/users/me',
        income: 'PUT /api/users/income',
      },
      transactions: ['GET /api/transactions', 'POST /api/transactions', 'GET /api/transactions/:id', 'PUT /api/transactions/:id', 'DELETE /api/transactions/:id', 'GET /api/transactions/stats/summary'],
      loans: ['GET /api/loans', 'POST /api/loans', 'GET /api/loans/:id', 'PUT /api/loans/:id', 'DELETE /api/loans/:id', 'POST /api/loans/calculate-emi', 'GET /api/loans/stats/summary'],
    }
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Server Error'
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
