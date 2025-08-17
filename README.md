# PlanPocket - Personal Finance Management App

A comprehensive personal finance management application built with React frontend and Node.js backend, featuring dynamic financial calculations, loan management, and real-time budget tracking.

## ✨ Features

### 🔗 **Connected & Dynamic Pages**
- **Dashboard**: Real-time financial overview with dynamic calculations
- **Loans**: Comprehensive loan management with EMI calculations
- **Summary**: Detailed financial analysis and insights
- **Profile**: Personal settings with financial health overview
- **Navigation**: Seamless navigation between all pages with breadcrumbs

### 💰 **Dynamic Financial Calculations**
- **Monthly Income**: Automatically calculated from income transactions (last 30 days)
- **Budget Overview**: Real-time budget calculations based on actual transaction data
- **Loan Analytics**: Dynamic EMI calculations and debt-to-income ratios
- **Financial Health**: Live metrics including savings rate and debt ratios

### 📊 **Real-Time Data Sync**
- All pages automatically update when data changes
- Centralized state management with React Context
- Automatic data reloading after transactions/loans are added
- Consistent financial metrics across all pages

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PlanPocket
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   Create `.env` file in backend directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

5. **Start the backend**
   ```bash
   cd backend
   npm start
   ```

6. **Start the frontend**
   ```bash
   cd frontend
   npm run dev
   ```

## 🏗️ Architecture

### Frontend (React)
- **AppContext**: Centralized state management for all financial data
- **Dynamic Calculations**: Real-time financial metrics calculation
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Page Connectivity**: Seamless navigation and data sharing

### Backend (Node.js + Express)
- **RESTful API**: Clean API endpoints for all operations
- **MongoDB Integration**: Mongoose models for data persistence
- **JWT Authentication**: Secure user authentication
- **Data Validation**: Input validation and sanitization

## 📱 Page Features

### Dashboard (`/`)
- Real-time budget overview
- Dynamic income/expense calculations
- Quick navigation to other pages
- Transaction management
- Live financial statistics

### Loans (`/loan`)
- Add/edit loan information
- EMI calculations
- Loan overview cards
- Debt-to-income analysis
- Quick actions to other pages

### Summary (`/summary`)
- Comprehensive financial analysis
- Financial health indicators
- Transaction breakdown
- Loan summary
- Financial tips and insights

### Profile (`/profile`)
- Personal information management
- Dynamic financial overview
- Financial health metrics
- Quick navigation cards
- Password management (UI only)

## 🔄 Data Flow

1. **User Authentication**: JWT-based login/registration
2. **Data Loading**: Automatic dashboard data loading on login
3. **Real-Time Updates**: All pages reflect changes immediately
4. **State Synchronization**: Centralized context ensures data consistency
5. **Automatic Calculations**: Financial metrics update automatically

## 🎯 Key Benefits

- **Fully Dynamic**: No manual refresh needed, everything updates automatically
- **Connected Experience**: Seamless navigation between all features
- **Real-Time Insights**: Live financial health indicators
- **User-Friendly**: Intuitive interface with clear navigation
- **Responsive Design**: Works perfectly on all devices

## 🛠️ Technologies Used

- **Frontend**: React, React Router, Tailwind CSS, React Icons
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **State Management**: React Context API
- **Styling**: Tailwind CSS with custom gradients

## 📈 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced analytics and charts
- [ ] Export functionality (PDF/Excel)
- [ ] Multi-currency support
- [ ] Investment tracking
- [ ] Goal setting and tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**PlanPocket** - Your personal finance companion for smarter money management! 💰✨
