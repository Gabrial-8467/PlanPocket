import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FaPlus, FaCar, FaCalculator, FaArrowLeft } from 'react-icons/fa';

function Loans() {
    const { loans, addLoan } = useAppContext();
    const [showAddLoan, setShowAddLoan] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [loanForm, setLoanForm] = useState({
        name: '',
        principalAmount: '',
        remainingBalance: '',
        tenure: '',
        interestRate: ''
    });

    const calculateMonthlyInstallment = (principal, tenure, interestRate) => {
        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = tenure * 12;
        
        if (monthlyRate === 0) return principal / numberOfPayments;
        
        const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                              (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        
        return monthlyPayment;
    };

    const handleLoanSubmit = (e) => {
        e.preventDefault();
        const principal = parseFloat(loanForm.principalAmount);
        const tenure = parseFloat(loanForm.tenure);
        const interestRate = parseFloat(loanForm.interestRate);
        
        const monthlyInstallment = calculateMonthlyInstallment(principal, tenure, interestRate);
        
        addLoan({
            ...loanForm,
            principalAmount: principal,
            remainingBalance: principal,
            tenure: tenure,
            interestRate: interestRate,
            monthlyInstallment: monthlyInstallment,
            startDate: new Date().toISOString(),
            status: 'Active'
        });
        
        setLoanForm({
            name: '',
            principalAmount: '',
            remainingBalance: '',
            tenure: '',
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
                                <p className="text-2xl font-bold text-white">{formatCurrency(selectedLoan.principalAmount)}</p>
                            </div>
                            
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h3 className="text-white font-semibold mb-2">Remaining Balance</h3>
                                <p className="text-2xl font-bold text-white">{formatCurrency(selectedLoan.remainingBalance)}</p>
                            </div>
                            
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h3 className="text-white font-semibold mb-2">Tenure</h3>
                                <p className="text-2xl font-bold text-white">{selectedLoan.tenure} months</p>
                            </div>
                            
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h3 className="text-white font-semibold mb-2">Pending Installments</h3>
                                <p className="text-2xl font-bold text-white">{selectedLoan.tenure}</p>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h3 className="text-white font-semibold mb-2">Sum Assured</h3>
                                <p className="text-2xl font-bold text-white">{formatCurrency(selectedLoan.principalAmount)}</p>
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
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">PlanPocket Loan Information</h1>
                <p className="text-gray-300 text-lg">View and manage all your active loans.</p>
            </div>

            {/* Add New Loan Button */}
            <div className="mb-8">
                <button
                    onClick={() => setShowAddLoan(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center"
                >
                    <FaPlus className="mr-2" />
                    Add New Loan
                </button>
            </div>

            {/* Loans List */}
            <div className="space-y-6">
                {loans.map((loan) => (
                    <div 
                        key={loan.id} 
                        className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition"
                        onClick={() => setSelectedLoan(loan)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <FaCar className="text-blue-400 text-2xl mr-4" />
                                <div>
                                    <h3 className="text-xl font-bold text-white">{loan.name}</h3>
                                    <div className="flex items-center mt-2">
                                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                                            {loan.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-300 text-sm">Principal Amount</p>
                                <p className="text-xl font-bold text-white">{formatCurrency(loan.principalAmount)}</p>
                                <p className="text-gray-300 text-sm mt-2">Remaining Balance</p>
                                <p className="text-xl font-bold text-white">{formatCurrency(loan.remainingBalance)}</p>
                            </div>
                        </div>
                    </div>
                ))}
                
                {loans.length === 0 && (
                    <div className="text-center py-12">
                        <FaCar className="text-gray-500 text-6xl mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No loans added yet. Add your first loan to get started!</p>
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
                                value={loanForm.principalAmount}
                                onChange={(e) => setLoanForm({...loanForm, principalAmount: e.target.value})}
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
                                placeholder="Tenure (in years)"
                                value={loanForm.tenure}
                                onChange={(e) => setLoanForm({...loanForm, tenure: e.target.value})}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
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
                            {loanForm.principalAmount && loanForm.tenure && loanForm.interestRate && (
                                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                                    <h4 className="text-white font-semibold mb-2">Estimated Monthly Installment:</h4>
                                    <p className="text-2xl font-bold text-green-500">
                                        {formatCurrency(calculateMonthlyInstallment(
                                            parseFloat(loanForm.principalAmount),
                                            parseFloat(loanForm.tenure),
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
        </div>
    );
}

export default Loans;
