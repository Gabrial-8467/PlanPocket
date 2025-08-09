import React from 'react';
import { useAppContext } from '../context/AppContext';
import { FaChartPie, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';

function Summary() {
    const { 
        monthlyIncome, 
        totalExpenses, 
        loans, 
        transactions 
    } = useAppContext();

    const totalLoanInstallments = loans.reduce((sum, loan) => sum + loan.monthlyInstallment, 0);
    const totalOutstandingDebt = loans.reduce((sum, loan) => sum + loan.remainingBalance, 0);
    const netCashFlow = monthlyIncome - totalExpenses;

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
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Financial Summary</h1>
                <p className="text-gray-300 text-lg">A high-level overview of your finances.</p>
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
                            <p className="text-2xl font-bold text-green-500">{formatCurrency(monthlyIncome)}</p>
                        </div>
                        
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h3 className="text-gray-300 text-sm">Total Monthly Expenses</h3>
                            <p className="text-2xl font-bold text-red-500">{formatCurrency(totalExpenses - totalLoanInstallments)}</p>
                        </div>
                        
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h3 className="text-gray-300 text-sm">Total Monthly Loan Installments</h3>
                            <p className="text-2xl font-bold text-red-500">{formatCurrency(totalLoanInstallments)}</p>
                        </div>
                        
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h3 className="text-gray-300 text-sm">Net Monthly Cash Flow</h3>
                            <p className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {formatCurrency(netCashFlow)}
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
                            <p className="text-2xl font-bold text-red-500">{formatCurrency(totalOutstandingDebt)}</p>
                        </div>
                        
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h3 className="text-gray-300 text-sm">Total Loans</h3>
                            <p className="text-2xl font-bold text-white">{loans.length}</p>
                        </div>
                        
                        {loans.map((loan, index) => (
                            <div key={loan.id} className="bg-gray-700 rounded-lg p-4">
                                <h3 className="text-gray-300 text-sm">{loan.name}</h3>
                                <p className="text-2xl font-bold text-red-500">{formatCurrency(loan.remainingBalance)}</p>
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
                                {monthlyIncome > 0 ? `${((totalLoanInstallments / monthlyIncome) * 100).toFixed(1)}%` : '0%'}
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <h3 className="text-gray-300 text-sm mb-2">Monthly Savings Rate</h3>
                            <p className="text-2xl font-bold text-white">
                                {monthlyIncome > 0 ? `${((netCashFlow / monthlyIncome) * 100).toFixed(1)}%` : '0%'}
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
