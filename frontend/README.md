# PlanPocket - Financial Management Application

A comprehensive financial management application built with React, Tailwind CSS, and modern web technologies. PlanPocket helps users track their budget, manage loans, and monitor their financial health.

## Features

### 🏠 Dashboard
- **Budget Overview**: Visual representation of monthly income, expenses, and remaining budget
- **Income Management**: Set and track annual income with automatic monthly calculations
- **Transaction Tracking**: Add and manage income/expense transactions
- **Recent Transactions**: View latest transaction history
- **Progress Tracking**: Visual progress bar showing budget utilization

### 💰 Loan Management
- **Loan Calculator**: Calculate monthly installments with interest rates
- **Loan Details**: Comprehensive view of loan information including principal, remaining balance, tenure
- **Multiple Loans**: Support for managing multiple loans simultaneously
- **Loan Status**: Track active loans with status indicators

### 📊 Financial Summary
- **Income & Spending Analysis**: Detailed breakdown of monthly finances
- **Loan Summary**: Overview of all outstanding debts
- **Financial Insights**: Debt-to-income ratio and savings rate calculations
- **Cash Flow Analysis**: Net monthly cash flow tracking

### 👤 User Authentication
- **User Registration**: Complete signup process with form validation
- **User Login**: Secure authentication system
- **Profile Management**: User profile and settings management

## Technology Stack

- **Frontend**: React 19.1.1
- **Styling**: Tailwind CSS 4.1.11
- **Routing**: React Router DOM 7.7.1
- **Icons**: React Icons 5.5.0
- **Build Tool**: Vite 7.0.4
- **State Management**: React Context API

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PlanPocket/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── navbar.jsx      # Navigation component
│   │   └── footer.jsx      # Footer component
│   ├── context/            # React Context for state management
│   │   └── AppContext.jsx  # Main application context
│   ├── pages/              # Page components
│   │   ├── dashboard.jsx   # Main dashboard
│   │   ├── loans.jsx       # Loan management
│   │   ├── summary.jsx     # Financial summary
│   │   ├── login.jsx       # Login page
│   │   └── Signup.jsx      # Registration page
│   ├── api/                # API service layer
│   │   └── apiService.js   # API integration
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Key Features Implementation

### State Management
The application uses React Context API for global state management, handling:
- User authentication state
- Financial data (income, transactions, loans)
- Real-time calculations and updates

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Responsive navigation with mobile menu
- Adaptive layouts for all screen sizes

### Form Validation
- Client-side validation for all forms
- Real-time error feedback
- Input sanitization and formatting

### Currency Formatting
- Indian Rupee (INR) formatting
- Proper number formatting with lakhs and crores
- Consistent currency display across the application

## Backend Integration

The application is designed to integrate with a backend API. The `apiService.js` file contains all the necessary API endpoints for:

- User authentication and registration
- Income and transaction management
- Loan management and calculations
- Dashboard data and financial summaries

### API Endpoints Structure

```
/api
├── /auth
│   ├── /login
│   ├── /register
│   └── /logout
├── /user
│   └── /profile
├── /income
├── /transactions
├── /loans
└── /dashboard
    └── /summary
```

## Demo Features

For demonstration purposes, the application includes:
- **Demo Authentication**: Use any valid email and password (min 6 characters)
- **Sample Data**: Add transactions and loans to see the application in action
- **Real-time Calculations**: All financial calculations update in real-time

## Future Enhancements

- [ ] Backend API integration
- [ ] Data persistence with database
- [ ] Advanced analytics and reporting
- [ ] Export functionality (PDF, Excel)
- [ ] Push notifications
- [ ] Multi-currency support
- [ ] Investment tracking
- [ ] Goal setting and tracking

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.
