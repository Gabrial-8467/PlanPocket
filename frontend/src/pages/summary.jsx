import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FaChartPie, FaMoneyBillWave, FaCreditCard, FaArrowLeft, FaChartLine, FaCalculator, FaExclamationTriangle } from 'react-icons/fa';

function Summary() {
    const { 
        financialMetrics = {},
        loans = [], 
        transactions = [],
        loading,
        error
    } = useAppContext();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Show loading state
    if (loading) {
        return (
            <div className="container mx-auto px-6 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-white text-xl mt-4">Loading financial summary...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="container mx-auto px-6 py-8">
                <div className="text-center">
                    <div className="bg-red-800 text-red-200 p-4 rounded-lg">
                        <p className="text-xl">Error loading summary: {error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Navigation Breadcrumb */}
            <div className="mb-6">
                <Link to="/" className="flex items-center text-blue-400 hover:text-blue-300 transition">
                    <FaArrowLeft className="mr-2" />
                    Back to Dashboard
                </Link>
            </div>

            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Financial Summary</h1>
                <p className="text-gray-300 text-lg">A comprehensive overview of your financial health and insights.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Income & Spending */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center mb-6">
                        <FaMoneyBillWave className="text-blue-400 text-2xl mr-3" />
                        <h2 className="text-2xl font-bold text-white">Income & Spending</h2>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h3 className="text-gray-300 text-sm">Monthly In-Hand Income</h3>
                            <p className="text-2xl font-bold text-green-500">{formatCurrency(financialMetrics.monthlyIncomeFromTransactions || 0)}</p>
                        </div>
                        
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h3 className="text-gray-300 text-sm">Total Monthly Expenses</h3>
                            <p className="text-2xl font-bold text-red-500">{formatCurrency(financialMetrics.totalExpensesFromTransactions || 0)}</p>
                        </div>
                        
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h3 className="text-gray-300 text-sm">Total Monthly Loan Installments</h3>
                            <p className="text-2xl font-bold text-red-500">{formatCurrency(financialMetrics.totalLoanInstallments || 0)}</p>
                        </div>
                        
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h3 className="text-gray-300 text-sm">Net Monthly Cash Flow</h3>
                            <p className={`text-2xl font-bold ${(financialMetrics.netCashFlow || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {formatCurrency(financialMetrics.netCashFlow || 0)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Loan Summary */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center mb-6">
                        <FaCreditCard className="text-blue-400 text-2xl mr-3" />
                        <h2 className="text-2xl font-bold text-white">Loan Summary</h2>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h3 className="text-gray-300 text-sm">Total Outstanding Debt</h3>
                            <p className="text-2xl font-bold text-red-500">{formatCurrency(financialMetrics.totalOutstandingDebt || 0)}</p>
                        </div>
                        
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h3 className="text-gray-300 text-sm">Total Loans</h3>
                            <p className="text-2xl font-bold text-white">{loans.length}</p>
                        </div>
                        
                        {loans.map((loan, index) => (
                            <div key={loan.id || loan._id} className="bg-gray-700 rounded-lg p-4">
                                <h3 className="text-gray-300 text-sm">{loan.name || loan.notes || `Loan ${index + 1}`}</h3>
                                <p className="text-2xl font-bold text-red-500">{formatCurrency((loan.remainingBalance ?? loan.principal ?? 0))}</p>
                            </div>
                        ))}
                        
                        {loans.length === 0 && (
                            <div className="bg-gray-700 rounded-lg p-4">
                                <h3 className="text-gray-300 text-sm">No loans</h3>
                                <p className="text-2xl font-bold text-gray-400">Rs. 0</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Additional Insights */}
            <div className="mt-8">
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center mb-6">
                        <FaChartPie className="text-blue-400 text-2xl mr-3" />
                        <h2 className="text-2xl font-bold text-white">Financial Insights</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <h3 className="text-gray-300 text-sm mb-2">Debt-to-Income Ratio</h3>
                            <p className="text-2xl font-bold text-white">
                                {(financialMetrics.debtToIncomeRatio || 0).toFixed(1)}%
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <h3 className="text-gray-300 text-sm mb-2">Monthly Savings Rate</h3>
                            <p className="text-2xl font-bold text-white">
                                {(financialMetrics.monthlySavingsRate || 0).toFixed(1)}%
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <h3 className="text-gray-300 text-sm mb-2">Total Transactions</h3>
                            <p className="text-2xl font-bold text-white">{transactions.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-12">
                <p className="text-gray-400">© 2025 PlanPocket. All rights reserved.</p>
            </div>
        </div>
    );
}

export default Summary;
