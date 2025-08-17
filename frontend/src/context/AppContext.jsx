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

  // --- Helpers ---
  const getErrorMessage = (err) => {
    if (!err) return 'Unknown error';
    if (err.response?.data?.message) return err.response.data.message;
    if (err.message) return err.message;
    return String(err);
  };

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
            setMonthlyIncome(fetchedUser.monthlyIncome || 0);
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
        apiService.getTransactions?.({ limit: 10 }),
        apiService.getLoans?.(),
        apiService.getTransactionStats?.(),
      ]);

      setTransactions(transactionsResp?.data?.transactions ?? []);
      setLoans(loansResp?.data?.loans ?? []);

      const stats = statsResp?.data ?? {};
      setTotalExpenses(stats.monthlyExpenses ?? 0);
      setBudgetUsed(stats.budgetUsed ?? 0);
      setRemaining(stats.remainingBudget ?? 0);
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
        setMonthlyIncome(finalUser.monthlyIncome ?? 0);
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
        setMonthlyIncome(finalUser.monthlyIncome ?? 0);
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
        setMonthlyIncome(updatedUser.monthlyIncome ?? Math.round((updatedUser.annualIncome ?? income) / 12));
      } else {
        setAnnualIncome(income);
        setMonthlyIncome(Math.round(income / 12));
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
      const response = await apiService.createTransaction(data);
  
      // Log to check actual backend shape
      console.log("Add Transaction Response:", response);
  
      // Adjust parsing depending on backend shape
      const newTx =
        response?.transaction || 
        response?.data?.transaction || 
        response?.data || 
        response;
  
      if (newTx) {
        setTransactions((prev) => [newTx, ...prev]);
      }
  
      // ⚠️ Optional: only reload dashboard if API already returns updated data
      // await loadDashboardData();
  
      return response;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };
  

  const updateTransaction = async (id, data) => {
    try {
      const response = await apiService.updateTransaction(id, data);
      const updated = response?.data?.transaction ?? response?.data ?? null;
      if (updated) setTransactions(prev => prev.map(t => (t._id === id ? updated : t)));
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
      setTransactions(prev => prev.filter(t => t._id !== id));
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
      const response = await apiService.createLoan(data);
      const newLoan = response?.data?.loan ?? response?.data ?? null;
      if (newLoan) setLoans(prev => [newLoan, ...prev]);
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
      const updatedLoan = response?.data?.loan ?? response?.data ?? null;
      if (updatedLoan) setLoans(prev => prev.map(l => (l._id === id ? updatedLoan : l)));
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
      setLoans(prev => prev.filter(l => l._id !== id));
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
