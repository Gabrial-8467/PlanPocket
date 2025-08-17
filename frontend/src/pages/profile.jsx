import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import apiService from '../api/apiService';
import { FaUserCircle, FaEnvelope, FaEdit, FaCheck, FaTimes, FaMoneyBillWave, FaWallet, FaLock } from 'react-icons/fa';

function Profile() {
  const { user, setUser, loading, error, annualIncome, monthlyIncome, totalExpenses } = useAppContext();
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

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-gray-800 rounded-2xl shadow-2xl p-8 relative">
      {/* Avatar and Name */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <FaUserCircle className="text-7xl text-blue-400 bg-gray-900 rounded-full p-2 shadow-lg" />
          <span className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-gray-800"></span>
        </div>
        <h2 className="text-3xl font-bold text-white mt-4">{user?.name || 'User'}</h2>
        <p className="text-gray-400 flex items-center mt-1"><FaEnvelope className="mr-2" />{user?.email}</p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
          <FaMoneyBillWave className="text-green-400 text-2xl mb-2" />
          <div className="text-gray-300 text-sm">Annual Income</div>
          <div className="text-lg font-bold text-white">₹{annualIncome?.toLocaleString() || 0}</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
          <FaWallet className="text-blue-400 text-2xl mb-2" />
          <div className="text-gray-300 text-sm">Monthly Income</div>
          <div className="text-lg font-bold text-white">₹{monthlyIncome?.toLocaleString() || 0}</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
          <FaMoneyBillWave className="text-red-400 text-2xl mb-2" />
          <div className="text-gray-300 text-sm">Total Expenses</div>
          <div className="text-lg font-bold text-white">₹{totalExpenses?.toLocaleString() || 0}</div>
        </div>
      </div>

      {/* Profile Edit Form */}
      <form onSubmit={handleSave} className="space-y-6 mb-10">
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
            <button type="button" onClick={handleEdit} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition flex items-center"><FaEdit className="mr-2" />Edit</button>
          ) : (
            <>
              <button type="submit" disabled={saveLoading} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 flex items-center">
                {saveLoading ? 'Saving...' : <><FaCheck className="mr-2" />Save</>}
              </button>
              <button type="button" onClick={handleCancel} className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition flex items-center"><FaTimes className="mr-2" />Cancel</button>
            </>
          )}
        </div>
      </form>

      {/* Change Password Section (UI only) */}
      <div className="bg-gray-700 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center"><FaLock className="mr-2" />Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="flex gap-4">
            <input
              type={showPassword ? 'text' : 'password'}
              name="current"
              placeholder="Current Password"
              value={passwordData.current}
              onChange={e => setPasswordData({ ...passwordData, current: e.target.value })}
              className="w-1/3 px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type={showPassword ? 'text' : 'password'}
              name="new"
              placeholder="New Password"
              value={passwordData.new}
              onChange={e => setPasswordData({ ...passwordData, new: e.target.value })}
              className="w-1/3 px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirm"
              placeholder="Confirm New Password"
              value={passwordData.confirm}
              onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
              className="w-1/3 px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setShowPassword(v => !v)} className="text-blue-400 underline text-sm">
              {showPassword ? 'Hide Passwords' : 'Show Passwords'}
            </button>
            <button type="submit" className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition flex items-center"><FaLock className="mr-2" />Change Password</button>
          </div>
          {passwordMsg && <div className="text-yellow-300 mt-2">{passwordMsg}</div>}
        </form>
      </div>
    </div>
  );
}

export default Profile;
