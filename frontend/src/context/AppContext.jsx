import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../api/apiService';

const AppContext = createContext();

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
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

    // Check authentication status on app load
    useEffect(() => {
        const checkAuth = async () => {
            if (apiService.isAuthenticated()) {
                try {
                    const response = await apiService.getCurrentUser();
                    setUser(response.data.user);
                    setIsLoggedIn(true);
                    setAnnualIncome(response.data.user.annualIncome || 0);
                    setMonthlyIncome(response.data.user.monthlyIncome || 0);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    // Clear invalid token and reset auth state
                    apiService.removeToken();
                    setIsLoggedIn(false);
                    setUser(null);
                    setAnnualIncome(0);
                    setMonthlyIncome(0);
                    setError(null); // Clear any previous errors
                }
            } else {
                // No token found, ensure auth state is reset
                setIsLoggedIn(false);
                setUser(null);
                setAnnualIncome(0);
                setMonthlyIncome(0);
            }
        };

        checkAuth();
    }, []);

    // Load initial data when user logs in
    useEffect(() => {
        if (isLoggedIn) {
            loadDashboardData();
        }
    }, [isLoggedIn]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Load transactions
            const transactionsResponse = await apiService.getTransactions({ limit: 10 });
            setTransactions(transactionsResponse.data.transactions || []);

            // Load loans
            const loansResponse = await apiService.getLoans();
            setLoans(loansResponse.data.loans || []);

            // Load transaction stats
            const statsResponse = await apiService.getTransactionStats();
            const stats = statsResponse.data;
            setTotalExpenses(stats.monthlyExpenses || 0);
            setBudgetUsed(stats.budgetUsed || 0);
            setRemaining(stats.remainingBudget || 0);

        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.login(credentials);
            setUser(response.data.user);
            setIsLoggedIn(true);
            setAnnualIncome(response.data.user.annualIncome || 0);
            setMonthlyIncome(response.data.user.monthlyIncome || 0);
            
            // Load user data
            await loadDashboardData();
            
            return response;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            // Map fullName to name for backend compatibility
            const backendUserData = {
                ...userData,
                name: userData.fullName || userData.name
            };
            // Remove fullName to avoid confusion
            delete backendUserData.fullName;
            
            const response = await apiService.register(backendUserData);
            setUser(response.data.user);
            setIsLoggedIn(true);
            setAnnualIncome(response.data.user.annualIncome || 0);
            setMonthlyIncome(response.data.user.monthlyIncome || 0);
            
            return response;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        apiService.logout();
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

    const updateIncome = async (income) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.updateIncome({ annualIncome: income });
            setAnnualIncome(income);
            setMonthlyIncome(response.data.user.monthlyIncome);
            return response;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const addTransaction = async (transactionData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.createTransaction(transactionData);
            const newTransaction = response.data.transaction;
            setTransactions(prev => [newTransaction, ...prev]);
            
            // Update stats
            await loadDashboardData();
            
            return response;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateTransaction = async (id, transactionData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.updateTransaction(id, transactionData);
            setTransactions(prev => 
                prev.map(t => t._id === id ? response.data.transaction : t)
            );
            
            // Update stats
            await loadDashboardData();
            
            return response;
        } catch (error) {
            setError(error.message);
            throw error;
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
            
            // Update stats
            await loadDashboardData();
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const addLoan = async (loanData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.createLoan(loanData);
            const newLoan = response.data.loan;
            setLoans(prev => [newLoan, ...prev]);
            return response;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateLoan = async (id, loanData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.updateLoan(id, loanData);
            setLoans(prev => 
                prev.map(l => l._id === id ? response.data.loan : l)
            );
            return response;
        } catch (error) {
            setError(error.message);
            throw error;
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
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const calculateEMI = async (emiData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.calculateEMI(emiData);
            return response;
        } catch (error) {
            setError(error.message);
            throw error;
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
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    const value = {
        // State
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

        // Actions
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

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
