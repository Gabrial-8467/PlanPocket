import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FaPlus, FaCar, FaCalculator, FaArrowLeft, FaChartLine, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

function Loans() {
    const { loans, addLoan, financialMetrics } = useAppContext();
    const [showAddLoan, setShowAddLoan] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [loanForm, setLoanForm] = useState({
        name: '',
        principal: '',
        remainingBalance: '',
        termMonths: '',
        interestRate: ''
    });

    const calculateMonthlyInstallment = (principal, termMonths, interestRate) => {
        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = termMonths;
        
        if (monthlyRate === 0) return principal / numberOfPayments;
        
        const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                              (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        
        return monthlyPayment;
    };

    const handleLoanSubmit = (e) => {
        e.preventDefault();
        const principal = parseFloat(loanForm.principal);
        const termMonths = parseFloat(loanForm.termMonths);
        const interestRate = parseFloat(loanForm.interestRate);
        
        // Only send the 3 required fields that the backend expects
        const loanData = {
            principal: principal,
            interestRate: interestRate,
            termMonths: termMonths
        };
        
        addLoan(loanData);
        
        setLoanForm({
            name: '',
            principal: '',
            remainingBalance: '',
            termMonths: '',
            interestRate: ''
        });
        setShowAddLoan(false);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toISOString().split('T')[0];
    };

    if (selectedLoan) {
        return (
            <div className="container mx-auto px-6 py-8">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => setSelectedLoan(null)}
                        className="flex items-center text-white mb-6 hover:text-gray-300 transition"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Loans
                    </button>
                    
                    <h1 className="text-3xl font-bold text-white mb-8">Loan Details</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h3 className="text-white font-semibold mb-2">Principal Amount</h3>
                                <p className="text-2xl font-bold text-white">{formatCurrency(selectedLoan.principal || selectedLoan.principalAmount)}</p>
                            </div>
                            
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h3 className="text-white font-semibold mb-2">Remaining Balance</h3>
                                <p className="text-2xl font-bold text-white">{formatCurrency(selectedLoan.remainingBalance)}</p>
                            </div>
                            
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h3 className="text-white font-semibold mb-2">Term</h3>
                                <p className="text-2xl font-bold text-white">{selectedLoan.termMonths || selectedLoan.tenure} months</p>
                            </div>
                            
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h3 className="text-white font-semibold mb-2">Pending Installments</h3>
                                <p className="text-2xl font-bold text-white">{selectedLoan.termMonths || selectedLoan.tenure}</p>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h3 className="text-white font-semibold mb-2">Sum Assured</h3>
                                <p className="text-2xl font-bold text-white">{formatCurrency(selectedLoan.principal || selectedLoan.principalAmount)}</p>
                            </div>
                            
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h3 className="text-white font-semibold mb-2">Interest Rate</h3>
                                <p className="text-2xl font-bold text-white">{selectedLoan.interestRate}%</p>
                            </div>
                            
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h3 className="text-white font-semibold mb-2">Monthly Installment</h3>
                                <p className="text-2xl font-bold text-white">{formatCurrency(selectedLoan.monthlyInstallment)}</p>
                            </div>
                            
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h3 className="text-white font-semibold mb-2">Start Date</h3>
                                <p className="text-2xl font-bold text-white">{formatDate(selectedLoan.startDate)}</p>
                            </div>
                        </div>
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
                <h1 className="text-4xl font-bold text-white mb-2">PlanPocket Loan Information</h1>
                <p className="text-gray-300 text-lg">View and manage all your active loans.</p>
            </div>

            {/* Loan Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-center">
                    <FaCar className="text-white text-3xl mx-auto mb-3" />
                    <h3 className="text-white font-semibold mb-2">Total Loans</h3>
                    <p className="text-3xl font-bold text-white">{loans.length}</p>
                    <p className="text-blue-200 text-sm">Active loans</p>
                </div>

                <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-6 text-center">
                    <FaCalculator className="text-white text-3xl mx-auto mb-3" />
                    <h3 className="text-white font-semibold mb-2">Total Debt</h3>
                    <p className="text-2xl font-bold text-white">{formatCurrency(financialMetrics.totalOutstandingDebt)}</p>
                    <p className="text-red-200 text-sm">Outstanding balance</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg p-6 text-center">
                    <FaChartLine className="text-white text-3xl mx-auto mb-3" />
                    <h3 className="text-white font-semibold mb-2">Monthly Payments</h3>
                    <p className="text-2xl font-bold text-white">{formatCurrency(financialMetrics.totalLoanInstallments)}</p>
                    <p className="text-yellow-200 text-sm">Total EMI</p>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-center">
                    <FaCheckCircle className="text-white text-3xl mx-auto mb-3" />
                    <h3 className="text-white font-semibold mb-2">Debt Ratio</h3>
                    <p className="text-2xl font-bold text-white">{financialMetrics.debtToIncomeRatio.toFixed(1)}%</p>
                    <p className="text-green-200 text-sm">Of monthly income</p>
                </div>
            </div>

            {/* Add New Loan Button */}
            <div className="mb-8 text-center">
                <button
                    onClick={() => setShowAddLoan(true)}
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition flex items-center mx-auto text-lg"
                >
                    <FaPlus className="mr-3 text-xl" />
                    Add New Loan
                </button>
            </div>

            {/* Loans List */}
            <div className="space-y-6">
                {loans.map((loan) => (
                    <div 
                        key={loan.id || loan._id} 
                        className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition"
                        onClick={() => setSelectedLoan(loan)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <FaCar className="text-blue-400 text-2xl mr-4" />
                                <div>
                                    <h3 className="text-xl font-bold text-white">{loan.name || 'Unnamed Loan'}</h3>
                                    <div className="flex items-center mt-2">
                                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                                            {loan.status || 'Active'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-300 text-sm">Principal Amount</p>
                                <p className="text-xl font-bold text-white">{formatCurrency(loan.principal || loan.principalAmount)}</p>
                                <p className="text-gray-300 text-sm mt-2">Remaining Balance</p>
                                <p className="text-xl font-bold text-white">{formatCurrency(loan.remainingBalance || 0)}</p>
                            </div>
                        </div>
                        
                        {/* Additional Loan Info */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-700">
                            <div className="text-center">
                                <p className="text-gray-400 text-sm">Monthly EMI</p>
                                <p className="text-lg font-semibold text-yellow-400">
                                    {formatCurrency(loan.monthlyInstallment || 0)}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-400 text-sm">Interest Rate</p>
                                <p className="text-lg font-semibold text-white">
                                    {loan.interestRate}%
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-400 text-sm">Term</p>
                                <p className="text-lg font-semibold text-white">
                                    {loan.termMonths || loan.tenure || 0} months
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-400 text-sm">Type</p>
                                <p className="text-lg font-semibold text-blue-400">
                                    {loan.loanType || 'Personal'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                
                {loans.length === 0 && (
                    <div className="text-center py-12">
                        <FaCar className="text-gray-500 text-6xl mx-auto mb-4" />
                        <p className="text-gray-400 text-lg mb-4">No loans added yet. Add your first loan to get started!</p>
                        <button
                            onClick={() => setShowAddLoan(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                        >
                            <FaPlus className="mr-2" />
                            Add Your First Loan
                        </button>
                    </div>
                )}
            </div>

            {/* Add Loan Modal */}
            {showAddLoan && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex items-center mb-6">
                            <FaPlus className="text-white text-xl mr-3" />
                            <h3 className="text-2xl font-bold text-white">Add New Loan</h3>
                        </div>

                        <form onSubmit={handleLoanSubmit}>
                            <input
                                type="text"
                                placeholder="Loan Name (e.g., Car loan)"
                                value={loanForm.name}
                                onChange={(e) => setLoanForm({...loanForm, name: e.target.value})}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                            />
                            
                            <input
                                type="number"
                                placeholder="Principal Amount"
                                value={loanForm.principal}
                                onChange={(e) => setLoanForm({...loanForm, principal: e.target.value})}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                            />
                            
                            <input
                                type="number"
                                placeholder="Remaining Balance"
                                value={loanForm.remainingBalance}
                                onChange={(e) => setLoanForm({...loanForm, remainingBalance: e.target.value})}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                            />
                            
                            <input
                                type="number"
                                placeholder="Term (in months)"
                                value={loanForm.termMonths}
                                onChange={(e) => setLoanForm({...loanForm, termMonths: e.target.value})}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
                            />
                            
                            <input
                                type="number"
                                step="0.1"
                                placeholder="Interest Rate (%)"
                                value={loanForm.interestRate}
                                onChange={(e) => setLoanForm({...loanForm, interestRate: e.target.value})}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                            />

                            {/* Calculated Monthly Installment */}
                            {loanForm.principal && loanForm.termMonths && loanForm.interestRate && (
                                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                                    <h4 className="text-white font-semibold mb-2">Estimated Monthly Installment:</h4>
                                    <p className="text-2xl font-bold text-green-500">
                                        {formatCurrency(calculateMonthlyInstallment(
                                            parseFloat(loanForm.principal),
                                            parseFloat(loanForm.termMonths),
                                            parseFloat(loanForm.interestRate)
                                        ))}
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Add Loan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddLoan(false)}
                                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/" className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition text-center">
                    <FaChartLine className="text-2xl mx-auto mb-2" />
                    <div className="font-semibold">Dashboard</div>
                    <div className="text-sm text-blue-200">View financial overview</div>
                </Link>
                
                <Link to="/summary" className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition text-center">
                    <FaCalculator className="text-2xl mx-auto mb-2" />
                    <div className="font-semibold">Financial Summary</div>
                    <div className="text-sm text-green-200">Detailed analysis</div>
                </Link>
                
                <Link to="/profile" className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition text-center">
                    <FaCheckCircle className="text-2xl mx-auto mb-2" />
                    <div className="font-semibold">My Profile</div>
                    <div className="text-sm text-purple-200">Personal settings</div>
                </Link>
            </div>
        </div>
    );
}

export default Loans;
