# PlanPocket Flutter App (`PLAN POCKET APP`)

A cross-platform Flutter application for **PlanPocket**, connected to the same Node.js/Express backend and providing the same financial management functionality as the React web frontend, excluding the loans functionality as requested.

## ✨ Features Included

1. **Authentication & Session Management**
   - User Sign-in and Sign-up matching backend endpoints (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`).
   - Secure token storage with persistence (`shared_preferences`).
   - Password strength indicator (Weak, Fair, Good, Strong).
   - Form validation for full name, contact number, email, password match, address, and occupation type.

2. **Dashboard**
   - Real-time Budget Overview:
     - Monthly In-Hand Income (dynamically computed from income transactions over the past 30 days).
     - Total Monthly Expenses (computed from expense transactions over the past 30 days).
     - Remaining Budget (`Income - Expenses`).
     - Dynamic progress bar showing budget utilization percentage with color warnings.
   - Transaction Statistics: Total count, Income transactions, Expense transactions, and Net Cash Flow.
   - Quick Navigation cards (Financial Summary, My Profile, Add Transaction).
   - Recent Transactions feed with color-coded badges, formatted dates, and amounts in INR (`₹`).
   - Pull-to-refresh to sync latest data with the backend.

3. **Transaction Management**
   - Modal dialog to add transactions (Expense / Income toggle, Description, Amount, Category dropdown, Date picker).
   - Delete transactions with confirmation dialog.

4. **Financial Summary**
   - Income & Spending Breakdown: Monthly In-Hand Income, Total Monthly Expenses, Net Monthly Cash Flow.
   - Lifetime Overview: All-time Total Income and All-time Total Expenses.
   - Financial Insights: Monthly Savings Rate (`Net Cash Flow / Income * 100`) and Total Transactions.
   - *(Note: All loan summary / debt-to-income items are excluded as requested).*

5. **User Profile & Settings**
   - Profile overview with status indicator.
   - Monthly Income, Monthly Expense, and Net Cash Flow quick cards.
   - Annual Income update (persisted via `/api/users/income`).
   - Change Password UI form.
   - Backend API URL configurator (easily switch between `10.0.2.2:5000` for Android emulator, `127.0.0.1:5000` for Web/Linux, or your local LAN IP for physical mobile devices).
   - Logout functionality.

6. **Design & Theme**
   - Modern dark UI matching the PlanPocket React application design (`#111827` background, `#1F2937` cards, `#2563EB` primary blue, `#10B981` success green, `#EF4444` danger red, `#F59E0B` yellow accents).

---

## 🚀 Getting Started

### 1. Ensure Backend is Running
From the root repository:
```bash
cd backend
npm install
npm run dev # or node index.js
```
The backend server runs on `http://127.0.0.1:5000`.

### 2. Run the Flutter App
```bash
cd "PLAN POCKET APP"
flutter pub get
flutter run
```

### 📱 Backend URL Configuration
- **Android Emulator**: Uses `http://10.0.2.2:5000/api` by default.
- **Linux Desktop / macOS / Web**: Uses `http://127.0.0.1:5000/api` by default.
- **Physical Phone**: Tap the Settings gear icon on the Login screen or in the Profile tab and input `http://<your-computer-ip>:5000/api`.
