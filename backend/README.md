# PlanPocket Backend API

A comprehensive Node.js/Express backend for the PlanPocket financial management application with MongoDB database integration.

## 🚀 Features

- **JWT Authentication** - Secure user registration and login
- **Transaction Management** - Complete CRUD operations for income/expense tracking
- **Loan Management** - EMI calculations, payment tracking, and loan lifecycle management
- **Financial Analytics** - Comprehensive reporting and summary endpoints
- **Data Validation** - Input validation with express-validator
- **Security** - Helmet, CORS, rate limiting, and password hashing
- **Error Handling** - Centralized error handling with detailed responses

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🛠️ Installation

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Update `config.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/planpocket
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
CORS_ORIGIN=http://localhost:5173
```

4. **Start MongoDB**
Make sure MongoDB is running on your system or update the connection string for cloud MongoDB.

5. **Run the application**
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+1234567890",
  "annualIncome": 60000,
  "address": "123 Main St"
}
```

### Transaction Endpoints

#### Get All Transactions
```http
GET /api/transactions?page=1&limit=10&type=expense&category=food
Authorization: Bearer <token>
```

#### Create Transaction
```http
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "expense",
  "description": "Grocery shopping",
  "amount": 150.50,
  "category": "groceries",
  "date": "2024-01-15T10:30:00Z"
}
```

#### Update Transaction
```http
PUT /api/transactions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Updated grocery shopping",
  "amount": 175.00
}
```

#### Delete Transaction
```http
DELETE /api/transactions/:id
Authorization: Bearer <token>
```

### Loan Endpoints

#### Get All Loans
```http
GET /api/loans?status=active&loanType=personal
Authorization: Bearer <token>
```

#### Create Loan
```http
POST /api/loans
Authorization: Bearer <token>
Content-Type: application/json

{
  "loanType": "personal",
  "loanAmount": 10000,
  "interestRate": 12.5,
  "loanTerm": 24,
  "lenderName": "ABC Bank",
  "startDate": "2024-01-01T00:00:00Z"
}
```

#### Calculate EMI
```http
POST /api/loans/calculate-emi
Authorization: Bearer <token>
Content-Type: application/json

{
  "principal": 10000,
  "rate": 12.5,
  "term": 24
}
```

#### Add Payment
```http
POST /api/loans/:id/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "amountPaid": 500,
  "paymentDate": "2024-02-01T00:00:00Z",
  "paymentMethod": "online"
}
```

### Summary Endpoints

#### Financial Summary
```http
GET /api/summary
Authorization: Bearer <token>
```

#### Monthly Analysis
```http
GET /api/summary/monthly/2024/1
Authorization: Bearer <token>
```

#### Yearly Analysis
```http
GET /api/summary/yearly/2024
Authorization: Bearer <token>
```

#### Category Breakdown
```http
GET /api/summary/category-breakdown?startDate=2024-01-01&endDate=2024-12-31&type=expense
Authorization: Bearer <token>
```

#### Spending Trends
```http
GET /api/summary/spending-trends?period=monthly&limit=12
Authorization: Bearer <token>
```

#### Cash Flow Analysis
```http
GET /api/summary/cash-flow/monthly
Authorization: Bearer <token>
```

## 🗄️ Database Models

### User Model
- Personal information and authentication
- Annual/monthly income tracking
- Profile management

### Transaction Model
- Income and expense tracking
- Category-based organization
- Date-based filtering
- Recurring transaction support

### Loan Model
- Complete loan lifecycle management
- Automatic EMI calculations
- Payment history tracking
- Multiple loan types support

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **Rate Limiting** - Protection against brute force attacks
- **Input Validation** - Comprehensive validation on all endpoints
- **CORS Protection** - Configured cross-origin resource sharing
- **Helmet Security** - Security headers for protection

## 📊 Transaction Categories

### Income Categories
- salary, business, investment, freelance, bonus, other-income

### Expense Categories
- food, transportation, utilities, entertainment, healthcare, shopping, education, travel, insurance, rent, groceries, fuel, maintenance, subscriptions, charity, other-expense

## 💳 Loan Types
- personal, home, car, education, business

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-strong-production-secret
CORS_ORIGIN=your-frontend-domain
```

### PM2 Deployment
```bash
npm install -g pm2
pm2 start server.js --name "planpocket-api"
```

## 📝 Error Handling

The API uses consistent error response format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the API documentation
- Review error messages in development mode
- Ensure MongoDB is running
- Verify environment variables

---

**PlanPocket Backend** - Powering your financial management 🚀
