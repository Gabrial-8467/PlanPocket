import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FaPiggyBank, FaWallet, FaChartLine, FaChartBar, FaPlus, FaReceipt } from 'react-icons/fa';
import Footer from '../components/footer';

function Dashboard() {
    const { 
        annualIncome, 
        setAnnualIncome, 
        monthlyIncome, 
        totalExpenses, 
        remaining, 
        budgetUsed, 
        transactions, 
        addTransaction, 
        updateIncome
    } = useAppContext();

    const [showTransactionForm, setShowTransactionForm] = useState(false);
    const [transactionForm, setTransactionForm] = useState({
        type: 'expense',
        description: '',
        amount: '',
        category: ''
    });

    const handleIncomeSubmit = async (e) => {
        e.preventDefault();
        const income = Number(annualIncome);
        if (income > 0) {
            setAnnualIncome(income);
            if (updateIncome) {
                await updateIncome(income);
            }
        }
    };

    const handleTransactionSubmit = async (e) => {
        e.preventDefault();
        if (transactionForm.description && transactionForm.amount && transactionForm.category) {
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

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Main Dashboard */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">PlanPocket Dashboard</h1>
                <p className="text-gray-300 text-lg">Track your budget and manage your loans with ease.</p>
            </div>

            {/* Annual Income Input */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4">Annual Income</h2>
                <p className="text-gray-300 mb-4">Enter your annual salary to calculate your monthly in-hand income.</p>
                <form onSubmit={handleIncomeSubmit} className="flex gap-4">
                    <input
                        type="number"
                        name="income"
                        placeholder="Enter Annual Income"
                        className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={annualIncome || ''}
                        onChange={e => setAnnualIncome(Number(e.target.value))}
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Submit
                    </button>
                </form>
            </div>

            {/* Budget Overview */}
            <div className="mb-8">
                <div className="flex items-center justify-center mb-6">
                    <FaPiggyBank className="text-blue-400 text-2xl mr-3" />
                    <h2 className="text-3xl font-bold text-white">Budget Overview</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Monthly Income */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                                <FaWallet className="text-white text-xl" />
                            </div>
                            <h3 className="text-white font-semibold">Monthly In-Hand Income</h3>
                        </div>
                        <p className="text-3xl font-bold text-white">{formatCurrency(monthlyIncome)}</p>
                    </div>

                    {/* Total Expenses */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                                <FaChartBar className="text-white text-xl" />
                            </div>
                            <h3 className="text-white font-semibold">Total Expenses</h3>
                        </div>
                        <p className="text-3xl font-bold text-white">{formatCurrency(totalExpenses)}</p>
                    </div>

                    {/* Remaining */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                                <FaChartLine className="text-white text-xl" />
                            </div>
                            <h3 className="text-white font-semibold">Remaining</h3>
                        </div>
                        <p className="text-3xl font-bold text-white">{formatCurrency(remaining)}</p>
                    </div>
                </div>

                {/* Budget Progress */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-white">Budget Used: {isNaN(budgetUsed) ? '0%' : `${budgetUsed.toFixed(1)}%`}</span>
                        <span className="text-white">Remaining: {formatCurrency(remaining)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                            className="bg-green-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                        ></div>
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
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
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
                <div className="flex items-center mb-6">
                    <FaReceipt className="text-blue-400 text-xl mr-3" />
                    <h3 className="text-2xl font-bold text-white">Recent Transactions</h3>
                </div>
                
                {transactions.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No transactions yet. Add your first transaction above!</p>
                ) : (
                    <div className="space-y-4">
                        {transactions.slice(-5).reverse().map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
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
                                        {new Date(transaction.date).toLocaleDateString()}
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
