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

  // Helper to extract friendly message from error objects
  const getErrorMessage = (err) => {
    // axios style
    if (!err) return 'Unknown error';
    if (err.response?.data?.message) return err.response.data.message;
    if (err.message) return err.message;
    return String(err);
  };

  // --- Auth check on load ---
  useEffect(() => {
    const checkAuth = async () => {
      if (apiService.isAuthenticated && apiService.isAuthenticated()) {
        try {
          setLoading(true);
          const resp = await apiService.getCurrentUser();
          const fetchedUser = resp?.data?.user ?? null;
          if (fetchedUser) {
            setUser(fetchedUser);
            setIsLoggedIn(true);
            setAnnualIncome(fetchedUser.annualIncome || 0);
            setMonthlyIncome(fetchedUser.monthlyIncome || 0);
          } else {
            // If token exists but profile couldn't be fetched, clear token
            apiService.removeToken && apiService.removeToken();
            setUser(null);
            setIsLoggedIn(false);
          }
        } catch (err) {
          console.error('Auth check failed:', err);
          apiService.removeToken && apiService.removeToken();
          setUser(null);
          setIsLoggedIn(false);
          setError(null); // keep initial state clean
        } finally {
          setLoading(false);
        }
      } else {
        // No token found; ensure clean state
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
    // run once on mount
  }, []);

  // --- Load dashboard --- (memoized)
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Transactions
      const transactionsResponse = await apiService.getTransactions?.({ limit: 10 }) ?? { data: { transactions: [] } };
      setTransactions(transactionsResponse.data?.transactions ?? []);

      // Loans
      const loansResponse = await apiService.getLoans?.() ?? { data: { loans: [] } };
      setLoans(loansResponse.data?.loans ?? []);

      // Stats
      const statsResponse = await apiService.getTransactionStats?.() ?? { data: {} };
      const stats = statsResponse.data ?? {};
      setTotalExpenses(stats.monthlyExpenses ?? 0);
      setBudgetUsed(stats.budgetUsed ?? 0);
      setRemaining(stats.remainingBudget ?? 0);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // When user logs in, load dashboard
  useEffect(() => {
    if (isLoggedIn) loadDashboardData();
  }, [isLoggedIn, loadDashboardData]);

  // --- Auth actions ---
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await apiService.login(credentials);
      const data = resp?.data ?? {};

      // If backend sent user in the response, use it
      if (data.user) {
        setUser(data.user);
      } else if (data.token) {
        // If only token was returned, fetch profile
        const profileResp = await apiService.getCurrentUser();
        setUser(profileResp?.data?.user ?? null);
      }

      setIsLoggedIn(true);

      const finalUser = data.user ?? (await apiService.getCurrentUser()).data?.user ?? null;
      setAnnualIncome(finalUser?.annualIncome ?? 0);
      setMonthlyIncome(finalUser?.monthlyIncome ?? 0);

      // Load dashboard data
      await loadDashboardData();

      return resp;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      setIsLoggedIn(false);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      // Map fullName -> name (backend compatibility)
      const backendUserData = { ...userData };
      if (backendUserData.fullName && !backendUserData.name) {
        backendUserData.name = backendUserData.fullName;
        delete backendUserData.fullName;
      }

      const resp = await apiService.register(backendUserData);
      const data = resp?.data ?? {};

      if (data.user) {
        setUser(data.user);
      } else if (data.token) {
        const profileResp = await apiService.getCurrentUser();
        setUser(profileResp?.data?.user ?? null);
      }

      setIsLoggedIn(true);

      const finalUser = data.user ?? (await apiService.getCurrentUser()).data?.user ?? null;
      setAnnualIncome(finalUser?.annualIncome ?? 0);
      setMonthlyIncome(finalUser?.monthlyIncome ?? 0);

      return resp;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiService.logout?.();
    apiService.removeToken?.();
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
  };

  // --- Profile / income update ---
  const updateIncome = async (income) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.updateIncome?.({ annualIncome: income });
      // If API returns updated user, use it; else compute monthly
      const updatedUser = response?.data?.user ?? null;
      if (updatedUser) {
        setUser(updatedUser);
        setAnnualIncome(updatedUser.annualIncome ?? income);
        setMonthlyIncome(updatedUser.monthlyIncome ?? Math.round((updatedUser.annualIncome ?? income) / 12));
      } else {
        setAnnualIncome(income);
        setMonthlyIncome(Math.round(income / 12));
      }
      return response;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- Transaction actions ---
  const addTransaction = async (transactionData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.createTransaction(transactionData);
      const newTransaction = response?.data?.transaction ?? response?.data ?? null;
      if (newTransaction) setTransactions(prev => [newTransaction, ...prev]);
      await loadDashboardData();
      return response;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id, transactionData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.updateTransaction(id, transactionData);
      const updated = response?.data?.transaction ?? response?.data ?? null;
      if (updated) {
        setTransactions(prev => prev.map(t => (t._id === id ? updated : t)));
      }
      await loadDashboardData();
      return response;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t._id !== id));
      await loadDashboardData();
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- Loan actions ---
  const addLoan = async (loanData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.createLoan(loanData);
      const newLoan = response?.data?.loan ?? response?.data ?? null;
      if (newLoan) setLoans(prev => [newLoan, ...prev]);
      return response;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLoan = async (id, loanData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.updateLoan(id, loanData);
      const updatedLoan = response?.data?.loan ?? response?.data ?? null;
      if (updatedLoan) setLoans(prev => prev.map(l => (l._id === id ? updatedLoan : l)));
      return response;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLoan = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.deleteLoan(id);
      setLoans(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- Other utilities ---
  const calculateEMI = async (emiData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.calculateEMI(emiData);
      return response;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getFinancialSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getFinancialSummary();
      return response;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  // --- value exposed to consumers ---
  const value = {
    user,
    isLoggedIn,
    annualIncome,
    monthlyIncome,
    transactions,
    loans,
    budgetUsed,
    totalExpenses,
    remaining,
    loading,
    error,

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
    clearError
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
