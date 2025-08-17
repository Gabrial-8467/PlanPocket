import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import apiService from '../api/apiService';
import { FaUserCircle, FaEnvelope, FaEdit, FaCheck, FaTimes, FaMoneyBillWave, FaWallet, FaLock, FaChartLine, FaCreditCard, FaArrowLeft } from 'react-icons/fa';

function Profile() {
  const { 
    user, 
    setUser, 
    loading, 
    error, 
    financialMetrics,
    transactions,
    loans
  } = useAppContext();
  
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [editMode, setEditMode] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [passwordMsg, setPasswordMsg] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaveError(null);
    setSuccess(false);
  };

  const handleEdit = () => {
    setEditMode(true);
    setSuccess(false);
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({ name: user.name || '', email: user.email || '' });
    setSaveError(null);
    setSuccess(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveError(null);
    setSuccess(false);
    try {
      const updated = await apiService.updateProfile(formData);
      setUser && setUser(updated.user || updated.data?.user || formData);
      setEditMode(false);
      setSuccess(true);
    } catch (err) {
      setSaveError(err.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  // Password change UI only (no backend call)
  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      setPasswordMsg('Please fill all password fields.');
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      setPasswordMsg('New passwords do not match.');
      return;
    }
    setPasswordMsg('Password change feature coming soon!');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-white text-xl mt-4">Loading profile...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-center">
        <div className="bg-red-800 text-red-200 p-4 rounded-lg">
          <p className="text-xl">Error loading profile: {error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Navigation Breadcrumb */}
      <div className="mb-6">
        <Link to="/" className="flex items-center text-blue-400 hover:text-blue-300 transition">
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Avatar and Name */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <FaUserCircle className="text-7xl text-blue-400 bg-gray-900 rounded-full p-2 shadow-lg" />
            <span className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-gray-800"></span>
          </div>
          <h2 className="text-3xl font-bold text-white mt-4">{user?.name || 'User'}</h2>
          <p className="text-gray-400 flex items-center mt-1">
            <FaEnvelope className="mr-2" />
            {user?.email}
          </p>
        </div>

        {/* Dynamic Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
            <FaWallet className="text-green-400 text-2xl mb-2" />
            <div className="text-gray-300 text-sm">Monthly Income</div>
            <div className="text-lg font-bold text-white">
              {formatCurrency(financialMetrics.monthlyIncomeFromTransactions)}
            </div>
            <div className="text-xs text-gray-400">From transactions</div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
            <FaMoneyBillWave className="text-red-400 text-2xl mb-2" />
            <div className="text-gray-300 text-sm">Monthly Expenses</div>
            <div className="text-lg font-bold text-white">
              {formatCurrency(financialMetrics.totalExpensesFromTransactions)}
            </div>
            <div className="text-xs text-gray-400">Excluding loans</div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
            <FaCreditCard className="text-yellow-400 text-2xl mb-2" />
            <div className="text-gray-300 text-sm">Loan Installments</div>
            <div className="text-lg font-bold text-white">
              {formatCurrency(financialMetrics.totalLoanInstallments)}
            </div>
            <div className="text-xs text-gray-400">Monthly total</div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
            <FaChartLine className="text-blue-400 text-2xl mb-2" />
            <div className="text-gray-300 text-sm">Net Cash Flow</div>
            <div className={`text-lg font-bold ${financialMetrics.netCashFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(financialMetrics.netCashFlow)}
            </div>
            <div className="text-xs text-gray-400">Income - Expenses - Loans</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <FaChartLine className="mr-2 text-blue-400" />
              Financial Health
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Debt-to-Income:</span>
                <span className="text-white font-semibold">
                  {financialMetrics.debtToIncomeRatio.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Savings Rate:</span>
                <span className="text-white font-semibold">
                  {financialMetrics.monthlySavingsRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Total Loans:</span>
                <span className="text-white font-semibold">{loans.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <FaWallet className="mr-2 text-green-400" />
              Transaction Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Total Transactions:</span>
                <span className="text-white font-semibold">{transactions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Income Count:</span>
                <span className="text-green-400 font-semibold">
                  {transactions.filter(tx => tx.type === 'income').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Expense Count:</span>
                <span className="text-red-400 font-semibold">
                  {transactions.filter(tx => tx.type === 'expense').length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <FaCreditCard className="mr-2 text-yellow-400" />
              Loan Overview
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Outstanding Debt:</span>
                <span className="text-white font-semibold">
                  {formatCurrency(financialMetrics.totalOutstandingDebt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Monthly Payments:</span>
                <span className="text-white font-semibold">
                  {formatCurrency(financialMetrics.totalLoanInstallments)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Active Loans:</span>
                <span className="text-white font-semibold">{loans.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/" className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition text-center">
            <FaChartLine className="text-2xl mx-auto mb-2" />
            <div className="font-semibold">Dashboard</div>
            <div className="text-sm text-blue-200">View financial overview</div>
          </Link>
          
          <Link to="/loan" className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition text-center">
            <FaCreditCard className="text-2xl mx-auto mb-2" />
            <div className="font-semibold">Manage Loans</div>
            <div className="text-sm text-green-200">View and edit loans</div>
          </Link>
          
          <Link to="/summary" className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition text-center">
            <FaChartLine className="text-2xl mx-auto mb-2" />
            <div className="font-semibold">Financial Summary</div>
            <div className="text-sm text-purple-200">Detailed analysis</div>
          </Link>
        </div>

        {/* Profile Edit Form */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">Edit Profile</h3>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-700/50"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-700/50"
                />
              </div>
            </div>
            {saveError && <div className="text-red-400">{saveError}</div>}
            {success && <div className="text-green-400 flex items-center"><FaCheck className="mr-2" />Profile updated!</div>}
            <div className="flex gap-4">
              {!editMode ? (
                <button type="button" onClick={handleEdit} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition flex items-center">
                  <FaEdit className="mr-2" />Edit
                </button>
              ) : (
                <>
                  <button type="submit" disabled={saveLoading} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 flex items-center">
                    {saveLoading ? 'Saving...' : <><FaCheck className="mr-2" />Save</>}
                  </button>
                  <button type="button" onClick={handleCancel} className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition flex items-center">
                    <FaTimes className="mr-2" />Cancel
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Change Password Section (UI only) */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <FaLock className="mr-2" />Change Password
          </h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="flex gap-4">
              <input
                type={showPassword ? 'text' : 'password'}
                name="current"
                placeholder="Current Password"
                value={passwordData.current}
                onChange={e => setPasswordData({ ...passwordData, current: e.target.value })}
                className="w-1/3 px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                name="new"
                placeholder="New Password"
                value={passwordData.new}
                onChange={e => setPasswordData({ ...passwordData, new: e.target.value })}
                className="w-1/3 px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirm"
                placeholder="Confirm New Password"
                value={passwordData.confirm}
                onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
                className="w-1/3 px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setShowPassword(v => !v)} className="text-blue-400 underline text-sm">
                {showPassword ? 'Hide Passwords' : 'Show Passwords'}
              </button>
              <button type="submit" className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition flex items-center">
                <FaLock className="mr-2" />Change Password
              </button>
            </div>
            {passwordMsg && <div className="text-yellow-300 mt-2">{passwordMsg}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
