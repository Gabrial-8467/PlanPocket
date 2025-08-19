import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FaPiggyBank, FaWallet, FaChartLine, FaChartBar, FaPlus, FaReceipt, FaChartPie, FaArrowRight, FaCreditCard, FaUserCircle } from 'react-icons/fa';
import Footer from '../components/footer';

function Dashboard() {
    const { 
        transactions, 
        addTransaction, 
        error,
        loading,
        loadDashboardData
    } = useAppContext();

    const [showTransactionForm, setShowTransactionForm] = useState(false);
    const [transactionForm, setTransactionForm] = useState({
        type: 'expense',
        description: '',
        amount: '',
        category: ''
    });

    // Dynamic budget calculations based on actual transaction data
    const [dynamicBudget, setDynamicBudget] = useState({
        monthlyIncome: 0,
        totalExpenses: 0,
        remaining: 0,
        budgetUsed: 0
    });

    // Calculate budget values whenever transactions change
    useEffect(() => {
        const calculateBudget = () => {
            // Calculate monthly income from income transactions (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const monthlyIncomeCalc = transactions
                .filter(tx => tx.type === 'income' && new Date(tx.date) >= thirtyDaysAgo)
                .reduce((sum, tx) => sum + (tx.amount || 0), 0);
            
            // Calculate total expenses from expense transactions (last 30 days)
            const totalExpensesCalc = transactions
                .filter(tx => tx.type === 'expense' && new Date(tx.date) >= thirtyDaysAgo)
                .reduce((sum, tx) => sum + (tx.amount || 0), 0);
            
            // Calculate remaining budget
            const remainingCalc = Math.max(0, monthlyIncomeCalc - totalExpensesCalc);
            
            // Calculate budget used percentage
            const budgetUsedCalc = monthlyIncomeCalc > 0 
                ? Math.round((totalExpensesCalc / monthlyIncomeCalc) * 100) 
                : 0;

            setDynamicBudget({
                monthlyIncome: monthlyIncomeCalc,
                totalExpenses: totalExpensesCalc,
                remaining: remainingCalc,
                budgetUsed: budgetUsedCalc
            });
        };

        calculateBudget();
    }, [transactions]);

    // Debug: log when modal state changes
    React.useEffect(() => {
        console.log('showTransactionForm:', showTransactionForm);
    }, [showTransactionForm]);

    const handleTransactionSubmit = async (e) => {
        e.preventDefault();
        if (transactionForm.description && transactionForm.amount && transactionForm.category) {
            try {
                await addTransaction({
                    ...transactionForm,
                    amount: parseFloat(transactionForm.amount),
                    date: new Date().toISOString()
                });
                setTransactionForm({
                    type: 'expense',
                    description: '',
                    amount: '',
                    category: ''
                });
                setShowTransactionForm(false);
            } catch (error) {
                console.error('Failed to add transaction:', error);
            }
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Calculate transaction statistics
    const transactionStats = useCallback(() => {
        const incomeTransactions = transactions.filter(tx => tx.type === 'income');
        const expenseTransactions = transactions.filter(tx => tx.type === 'expense');
        
        const totalIncome = incomeTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
        const totalExpenses = expenseTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
        
        return {
            totalIncome,
            totalExpenses,
            transactionCount: transactions.length,
            incomeCount: incomeTransactions.length,
            expenseCount: expenseTransactions.length
        };
    }, [transactions]);

    const stats = transactionStats();

    // Show loading state for entire dashboard
    if (loading) {
        return (
            <div className="container mx-auto px-6 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-white text-xl mt-4">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-800 text-red-200 rounded-lg text-center">
                    {error}
                </div>
            )}

            {/* Main Dashboard Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">PlanPocket Dashboard</h1>
                <p className="text-gray-300 text-lg">Track your budget and manage your loans with ease.</p>
            </div>

            {/* Quick Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Link to="/loan" className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-lg hover:from-green-700 hover:to-green-800 transition text-center">
                    <FaCreditCard className="text-2xl mx-auto mb-2" />
                    <div className="font-semibold">Manage Loans</div>
                    <div className="text-sm text-green-200">View and edit loans</div>
                </Link>
                
                <Link to="/summary" className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition text-center">
                    <FaChartPie className="text-2xl mx-auto mb-2" />
                    <div className="font-semibold">Financial Summary</div>
                    <div className="text-sm text-purple-200">Detailed analysis</div>
                </Link>
                
                <Link to="/profile" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition text-center">
                    <FaUserCircle className="text-2xl mx-auto mb-2" />
                    <div className="font-semibold">My Profile</div>
                    <div className="text-sm text-blue-200">Personal settings</div>
                </Link>
                
                <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white p-4 rounded-lg text-center">
                    <FaReceipt className="text-2xl mx-auto mb-2" />
                    <div className="font-semibold">Add Transaction</div>
                    <div className="text-sm text-yellow-200">Track income/expenses</div>
                    <button
                        onClick={() => setShowTransactionForm(true)}
                        className="mt-2 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-sm font-semibold transition"
                    >
                        Add Now
                    </button>
                </div>
            </div>

            {/* Budget Overview */}
            <div className="mb-8">
                <div className="flex items-center justify-center mb-6">
                    <FaPiggyBank className="text-blue-400 text-2xl mr-3" />
                    <h2 className="text-2xl font-bold text-white">Budget Overview</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Monthly Income - Calculated from income transactions */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                                <FaWallet className="text-white text-xl" />
                            </div>
                            <h3 className="text-white font-semibold">Monthly In-Hand Income</h3>
                        </div>
                        <p className="text-3xl font-bold text-white">{formatCurrency(dynamicBudget.monthlyIncome)}</p>
                        <p className="text-gray-400 text-sm mt-2">From income transactions (last 30 days)</p>
                    </div>

                    {/* Total Expenses */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                                <FaChartBar className="text-white text-xl" />
                            </div>
                            <h3 className="text-white font-semibold">Total Expenses</h3>
                        </div>
                        <p className="text-3xl font-bold text-white">{formatCurrency(dynamicBudget.totalExpenses)}</p>
                        <p className="text-gray-400 text-sm mt-2">From expense transactions (last 30 days)</p>
                    </div>

                    {/* Remaining */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                                <FaChartLine className="text-white text-xl" />
                            </div>
                            <h3 className="text-white font-semibold">Remaining</h3>
                        </div>
                        <p className="text-3xl font-bold text-white">{formatCurrency(dynamicBudget.remaining)}</p>
                        <p className="text-gray-400 text-sm mt-2">Income - Expenses</p>
                    </div>
                </div>

                {/* Budget Progress */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-white">Budget Used: {isNaN(dynamicBudget.budgetUsed) ? '0%' : `${dynamicBudget.budgetUsed.toFixed(1)}%`}</span>
                        <span className="text-white">Remaining: {formatCurrency(dynamicBudget.remaining)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                            className="bg-green-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(dynamicBudget.budgetUsed, 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Transaction Statistics */}
            <div className="mb-8">
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <FaChartPie className="text-blue-400 text-2xl mr-3" />
                            <h2 className="text-2xl font-bold text-white">Transaction Statistics</h2>
                        </div>
                        <Link to="/summary" className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                            View Detailed Summary <FaArrowRight className="ml-1" />
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <h3 className="text-gray-300 text-sm mb-2">Total Transactions</h3>
                            <p className="text-3xl font-bold text-white">{stats.transactionCount}</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-gray-300 text-sm mb-2">Income Transactions</h3>
                            <p className="text-3xl font-bold text-green-500">{stats.incomeCount}</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-gray-300 text-sm mb-2">Expense Transactions</h3>
                            <p className="text-3xl font-bold text-red-500">{stats.expenseCount}</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-gray-300 text-sm mb-2">Net Flow</h3>
                            <p className={`text-3xl font-bold ${stats.totalIncome - stats.totalExpenses >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {formatCurrency(stats.totalIncome - stats.totalExpenses)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Transaction Button */}
            <div className="text-center mb-8">
                <button
                    onClick={() => setShowTransactionForm(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center mx-auto"
                >
                    <FaPlus className="mr-2" />
                    Add New Transaction
                </button>
            </div>

            {/* Transaction Form Modal */}
            {showTransactionForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 border-4 border-yellow-400">
                        <div className="flex items-center mb-6">
                            <FaPlus className="text-white text-xl mr-3" />
                            <h3 className="text-2xl font-bold text-white">Add New Transaction</h3>
                        </div>

                        <form onSubmit={handleTransactionSubmit}>
                            {/* Transaction Type */}
                            <div className="flex gap-2 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setTransactionForm({...transactionForm, type: 'expense'})}
                                    className={`flex-1 py-2 px-4 rounded-lg transition ${
                                        transactionForm.type === 'expense' 
                                            ? 'bg-red-500 text-white' 
                                            : 'bg-gray-700 text-white'
                                    }`}
                                >
                                    Expense
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTransactionForm({...transactionForm, type: 'income'})}
                                    className={`flex-1 py-2 px-4 rounded-lg transition ${
                                        transactionForm.type === 'income' 
                                            ? 'bg-green-500 text-white' 
                                            : 'bg-gray-700 text-white'
                                    }`}
                                >
                                    Income
                                </button>
                            </div>

                            {/* Input Fields */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={transactionForm.description}
                                    onChange={(e) => setTransactionForm({...transactionForm, description: e.target.value})}
                                    className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Amount (Rs.)"
                                    value={transactionForm.amount}
                                    onChange={(e) => setTransactionForm({...transactionForm, amount: e.target.value})}
                                    className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Category"
                                value={transactionForm.category}
                                onChange={(e) => setTransactionForm({...transactionForm, category: e.target.value})}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                            />

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Add Transaction
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowTransactionForm(false)}
                                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Recent Transactions */}
            <div className="bg-gray-800 rounded-lg p-6 my-3">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <FaReceipt className="text-blue-400 text-xl mr-3" />
                        <h3 className="text-2xl font-bold text-white">Recent Transactions</h3>
                    </div>
                    <span className="text-gray-400 text-sm">Total: {transactions.length}</span>
                </div>
                
                {transactions.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No transactions yet. Add your first transaction above!</p>
                ) : (
                    <div className="space-y-4">
                        {transactions.slice().reverse().map((transaction) => (
                            <div key={transaction.id || transaction._id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                <div className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full mr-4 ${
                                        transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                                    }`}></div>
                                    <div>
                                        <p className="text-white font-semibold">{transaction.description}</p>
                                        <p className="text-gray-400 text-sm">{transaction.category}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${
                                        transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        {transaction.date ? new Date(transaction.date).toLocaleDateString() : ''}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer/>
        </div>
    );
}

export default Dashboard;
