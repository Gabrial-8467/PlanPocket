// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiService from '../api/apiService';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  // --- state ---
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [annualIncome, setAnnualIncome] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [budgetUsed, setBudgetUsed] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Dynamic financial calculations ---
  const [financialMetrics, setFinancialMetrics] = useState({
    monthlyIncomeFromTransactions: 0,
    totalExpensesFromTransactions: 0,
    totalLoanInstallments: 0,
    totalOutstandingDebt: 0,
    netCashFlow: 0,
    debtToIncomeRatio: 0,
    monthlySavingsRate: 0
  });

  // --- Helpers ---
  const getErrorMessage = (err) => {
    if (!err) return 'Unknown error';
    if (err.response?.data?.message) return err.response.data.message;
    if (err.message) return err.message;
    return String(err);
  };

  // --- Calculate financial metrics from transactions and loans ---
  const calculateFinancialMetrics = useCallback(() => {
    // Calculate monthly income from income transactions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const monthlyIncomeFromTransactions = transactions
      .filter(tx => tx.type === 'income' && new Date(tx.date) >= thirtyDaysAgo)
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
    
    // Calculate total expenses from expense transactions (last 30 days)
    const totalExpensesFromTransactions = transactions
      .filter(tx => tx.type === 'expense' && new Date(tx.date) >= thirtyDaysAgo)
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
    
    // Calculate total loan installments
    const totalLoanInstallments = loans.reduce((sum, loan) => sum + (loan.monthlyInstallment || 0), 0);
    
    // Calculate total outstanding debt
    const totalOutstandingDebt = loans.reduce((sum, loan) => sum + (loan.remainingBalance || 0), 0);
    
    // Calculate net cash flow
    const netCashFlow = monthlyIncomeFromTransactions - totalExpensesFromTransactions - totalLoanInstallments;
    
    // Calculate debt-to-income ratio
    const debtToIncomeRatio = monthlyIncomeFromTransactions > 0 
      ? ((totalLoanInstallments / monthlyIncomeFromTransactions) * 100) 
      : 0;
    
    // Calculate monthly savings rate
    const monthlySavingsRate = monthlyIncomeFromTransactions > 0 
      ? ((netCashFlow / monthlyIncomeFromTransactions) * 100) 
      : 0;

    setFinancialMetrics({
      monthlyIncomeFromTransactions,
      totalExpensesFromTransactions,
      totalLoanInstallments,
      totalOutstandingDebt,
      netCashFlow,
      debtToIncomeRatio,
      monthlySavingsRate
    });

    // Update global state
    setMonthlyIncome(monthlyIncomeFromTransactions);
    setTotalExpenses(totalExpensesFromTransactions);
    setRemaining(Math.max(0, monthlyIncomeFromTransactions - totalExpensesFromTransactions));
    
    // Calculate budget used percentage
    const budgetUsed = monthlyIncomeFromTransactions > 0 
      ? Math.round((totalExpensesFromTransactions / monthlyIncomeFromTransactions) * 100) 
      : 0;
    setBudgetUsed(budgetUsed);
  }, [transactions, loans]);

  // --- Recalculate metrics when data changes ---
  useEffect(() => {
    calculateFinancialMetrics();
  }, [calculateFinancialMetrics]);

  // --- Auth check on load ---
  useEffect(() => {
    const checkAuth = async () => {
      if (apiService.isAuthenticated?.()) {
        try {
          setLoading(true);
          const resp = await apiService.getCurrentUser();
          const fetchedUser = resp?.user ?? resp?.data?.user ?? null;
          if (fetchedUser) {
            setUser(fetchedUser);
            setIsLoggedIn(true);
            setAnnualIncome(fetchedUser.annualIncome || 0);
            // Note: monthlyIncome will be calculated from transactions
          } else {
            apiService.removeToken?.();
            setUser(null);
            setIsLoggedIn(false);
          }
        } catch (err) {
          console.error('Auth check failed:', err);
          apiService.removeToken?.();
          setUser(null);
          setIsLoggedIn(false);
        } finally {
          setLoading(false);
        }
      }
    };
    checkAuth();
  }, []);

  // --- Load dashboard ---
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [transactionsResp, loansResp, statsResp] = await Promise.all([
        apiService.getTransactions?.(),
        apiService.getLoans?.(),
        apiService.getTransactionStats?.(),
      ]);

      console.log("loadDashboardData - loansResp:", loansResp);

      setTransactions(
        Array.isArray(transactionsResp)
          ? transactionsResp
          : transactionsResp?.transactions ||
            transactionsResp?.data?.transactions ||
            []
      );
      setLoans(
        Array.isArray(loansResp)
          ? loansResp
          : loansResp?.loans ||
            loansResp?.data?.loans ||
            []
      );

      console.log("loadDashboardData - loans state set to:", 
        Array.isArray(loansResp)
          ? loansResp
          : loansResp?.loans ||
            loansResp?.data?.loans ||
            []
      );

      const stats = statsResp?.data ?? {};
      // Note: These will be calculated dynamically from transactions and loans
      // setTotalExpenses(stats.monthlyExpenses ?? 0);
      // setBudgetUsed(stats.budgetUsed ?? 0);
      // setRemaining(stats.remainingBudget ?? 0);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) loadDashboardData();
  }, [isLoggedIn, loadDashboardData]);

  // --- Auth actions ---
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const resp = await apiService.login(credentials);
      const data = resp?.data ?? {};
      let finalUser = data.user;

      if (!finalUser) {
        const profileResp = await apiService.getCurrentUser();
        finalUser = profileResp?.user ?? profileResp?.data?.user ?? null;
      }

      if (finalUser) {
        setUser(finalUser);
        setIsLoggedIn(true);
        setAnnualIncome(finalUser.annualIncome ?? 0);
        // Note: monthlyIncome will be calculated from transactions
      }

      await loadDashboardData();
      return resp;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const backendUserData = { ...userData };
      if (backendUserData.fullName && !backendUserData.name) {
        backendUserData.name = backendUserData.fullName;
        delete backendUserData.fullName;
      }

      const resp = await apiService.register(backendUserData);
      const data = resp?.data ?? {};
      let finalUser = data.user;

      if (!finalUser) {
        const profileResp = await apiService.getCurrentUser();
        finalUser = profileResp?.user ?? profileResp?.data?.user ?? null;
      }

      if (finalUser) {
        setUser(finalUser);
        setIsLoggedIn(true);
        setAnnualIncome(finalUser.annualIncome ?? 0);
        // Note: monthlyIncome will be calculated from transactions
      }

      return resp;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      apiService.logout?.();
      apiService.removeToken?.();
    } catch (err) {
      console.warn('Logout cleanup failed:', err);
    }
    setUser(null);
    setIsLoggedIn(false);
    setAnnualIncome(0);
    setMonthlyIncome(0);
    setTransactions([]);
    setLoans([]);
    setBudgetUsed(0);
    setTotalExpenses(0);
    setRemaining(0);
    setError(null);
    setFinancialMetrics({
      monthlyIncomeFromTransactions: 0,
      totalExpensesFromTransactions: 0,
      totalLoanInstallments: 0,
      totalOutstandingDebt: 0,
      netCashFlow: 0,
      debtToIncomeRatio: 0,
      monthlySavingsRate: 0
    });
  };

  // --- Profile / income ---
  const updateIncome = async (income) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.updateIncome?.({ annualIncome: income });
      const updatedUser = response?.data?.user ?? null;

      if (updatedUser) {
        setUser(updatedUser);
        setAnnualIncome(updatedUser.annualIncome ?? income);
        // Note: monthlyIncome will be calculated from transactions
      } else {
        setAnnualIncome(income);
        // Note: monthlyIncome will be calculated from transactions
      }

      return response;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- Transactions ---
  const addTransaction = async (data) => {
    try {
      console.log("Attempting to add transaction:", data);
      const response = await apiService.createTransaction(data);
      console.log("Add Transaction Response:", response);
      await loadDashboardData();
      return response;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      alert("Error adding transaction: " + msg);
      throw new Error(msg);
    }
  };

  const updateTransaction = async (id, data) => {
    try {
      const response = await apiService.updateTransaction(id, data);
      await loadDashboardData();
      return response;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await apiService.deleteTransaction(id);
      await loadDashboardData();
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  // --- Loans ---
  const addLoan = async (data) => {
    try {
      console.log("Attempting to add loan:", data);
      const response = await apiService.createLoan(data);
      console.log("Add Loan Response:", response);
      
      // Always reload dashboard data to get the latest loans
      await loadDashboardData();
      
      return response;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const updateLoan = async (id, data) => {
    try {
      const response = await apiService.updateLoan(id, data);
      await loadDashboardData();
      return response;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const deleteLoan = async (id) => {
    try {
      await apiService.deleteLoan(id);
      await loadDashboardData();
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  // --- Misc ---
  const calculateEMI = async (data) => {
    try {
      return await apiService.calculateEMI(data);
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  };

  const getFinancialSummary = async () => {
    try {
      return await apiService.getFinancialSummary();
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  };

  const clearError = () => setError(null);

  // --- Exposed value ---
  const value = {
    user,
    isLoggedIn,
    annualIncome,
    setAnnualIncome,
    monthlyIncome,
    transactions,
    loans,
    budgetUsed,
    totalExpenses,
    remaining,
    loading,
    error,
    financialMetrics,

    login,
    register,
    logout,
    updateIncome,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addLoan,
    updateLoan,
    deleteLoan,
    calculateEMI,
    getFinancialSummary,
    loadDashboardData,
    clearError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
