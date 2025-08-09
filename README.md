# PlanPocket - Financial Management Application

A comprehensive financial management application built with React frontend and Node.js backend, designed to help users track their budget, manage loans, and monitor their financial health.

## 🚀 Features

### Frontend (React + Tailwind CSS)
- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **Dashboard**: Real-time budget overview and financial insights
- **Transaction Management**: Add, edit, and track income/expenses
- **Loan Management**: Complete loan lifecycle with EMI calculations
- **Financial Analytics**: Detailed summaries and spending trends
- **User Authentication**: Secure login/signup with JWT

### Backend (Node.js + Express + MongoDB)
- **RESTful API**: Complete CRUD operations for all entities
- **Authentication**: JWT-based secure authentication
- **Data Validation**: Comprehensive input validation
- **Financial Calculations**: EMI, interest, and budget calculations
- **Analytics**: Advanced financial analytics and reporting
- **Security**: Helmet, CORS, and input sanitization

## 📁 Project Structure

```
PlanPocket/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context for state management
│   │   ├── api/            # API service layer
│   │   └── assets/         # Static assets
│   ├── package.json
│   └── README.md
├── backend/                  # Node.js backend API
    ├── config/
│   ├── models/             # MongoDB models
│   ├── controller/        
│   ├── routes/             # API route handlers
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Main server file
│   ├── package.json
│   └── README.md
└── README.md               # This file
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Icons** - Icon library
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd PlanPocket
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create environment file:
```bash
cp config.env.example config.env
```

Update `config.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/planpocket
JWT_SECRET=your-super-secret-jwt-key
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Start the frontend:
```bash
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📊 Key Features

### Dashboard
- **Budget Overview**: Visual representation of monthly income, expenses, and remaining budget
- **Income Management**: Set and track annual income with automatic monthly calculations
- **Transaction Tracking**: Add and manage income/expense transactions
- **Recent Transactions**: View latest transaction history
- **Progress Tracking**: Visual progress bar showing budget utilization

### Loan Management
- **Loan Calculator**: Calculate monthly installments with interest rates
- **Loan Details**: Comprehensive view of loan information
- **EMI Calculator**: Built-in EMI calculation with different parameters
- **Loan Status**: Track active, completed, and defaulted loans
- **Multiple Loan Types**: Support for personal, home, car, education, and business loans

### Financial Analytics
- **Monthly Summary**: Detailed monthly financial overview
- **Yearly Analysis**: Long-term financial trends
- **Category Breakdown**: Expense analysis by categories
- **Spending Trends**: Visual representation of spending patterns
- **Cash Flow Analysis**: Income vs expense tracking

### User Management
- **Secure Authentication**: JWT-based login/signup
- **Profile Management**: Update personal information
- **Password Security**: bcrypt hashing for passwords
- **Session Management**: Persistent login sessions

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Loans
- `GET /api/loans` - Get all loans
- `POST /api/loans` - Create loan
- `PUT /api/loans/:id` - Update loan
- `DELETE /api/loans/:id` - Delete loan
- `POST /api/loans/calculate-emi` - Calculate EMI

### Analytics
- `GET /api/summary` - Financial summary
- `GET /api/summary/yearly` - Yearly analysis
- `GET /api/summary/trends` - Spending trends

## 🎨 UI Components

### Dashboard Components
- Budget Overview Cards
- Transaction Form
- Recent Transactions List
- Progress Indicators
- Income Management Form

### Loan Components
- Loan Calculator
- Loan List
- Add Loan Form
- Loan Details Modal
- EMI Calculator

### Navigation
- Responsive Navbar
- User Profile Dropdown
- Mobile Menu
- Breadcrumb Navigation

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Comprehensive validation on all inputs
- **CORS Protection**: Configured for cross-origin requests
- **Helmet Security**: Security headers for protection
- **Error Handling**: Proper error responses without sensitive data

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Different screen sizes and orientations

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
```

### Backend Deployment
```bash
cd backend
npm start
```

### Environment Variables
Make sure to set proper environment variables for production:
- Strong JWT secret
- Production MongoDB URI
- Proper CORS origins
- NODE_ENV=production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the documentation in each folder
2. Review the API endpoints
3. Check the console for error messages
4. Ensure MongoDB is running
5. Verify environment variables are set correctly

## 🎯 Future Enhancements

- [ ] Real-time notifications
- [ ] Export financial reports (PDF/Excel)
- [ ] Multi-currency support
- [ ] Investment tracking
- [ ] Bill reminders
- [ ] Financial goals setting
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and charts
- [ ] Integration with banking APIs
- [ ] Automated transaction categorization

---

**PlanPocket** - Your Personal Financial Assistant 📊💰
