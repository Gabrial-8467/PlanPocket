import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FaUserPlus } from 'react-icons/fa';

function Signup() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        contactNumber: '',
        address: '',
        occupationType: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAppContext();
    const navigate = useNavigate();

    const occupationOptions = [
        { value: '', label: 'Select Occupation' },
        { value: 'salaried', label: 'Salaried' },
        { value: 'self-employed', label: 'Self-employed' }
    ];

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        if (!formData.contactNumber) {
            newErrors.contactNumber = 'Contact number is required';
        } else if (!/^\d{10}$/.test(formData.contactNumber.replace(/\s/g, ''))) {
            newErrors.contactNumber = 'Contact number must be 10 digits';
        }
        
        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }
        
        if (!formData.occupationType) {
            newErrors.occupationType = 'Please select an occupation type';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Call the register function from AppContext
            await register({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                contactNumber: formData.contactNumber,
                address: formData.address,
                occupationType: formData.occupationType
            });
            navigate('/');
        } catch (error) {
            console.error('Signup error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-8">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <FaUserPlus className="text-blue-400 text-4xl mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white">Create an Account</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="fullName" className="block text-white text-sm font-medium mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                errors.fullName ? 'ring-2 ring-red-500' : ''
                            }`}
                        />
                        {errors.fullName && (
                            <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                errors.email ? 'ring-2 ring-red-500' : ''
                            }`}
                        />
                        {errors.email && (
                            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                errors.password ? 'ring-2 ring-red-500' : ''
                            }`}
                        />
                        {errors.password && (
                            <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-white text-sm font-medium mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm Password"
                            className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                errors.confirmPassword ? 'ring-2 ring-red-500' : ''
                            }`}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="contactNumber" className="block text-white text-sm font-medium mb-2">
                            Contact Number
                        </label>
                        <input
                            type="tel"
                            id="contactNumber"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            placeholder="Contact Number"
                            className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                errors.contactNumber ? 'ring-2 ring-red-500' : ''
                            }`}
                        />
                        {errors.contactNumber && (
                            <p className="text-red-400 text-sm mt-1">{errors.contactNumber}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-white text-sm font-medium mb-2">
                            Address
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Address"
                            rows="3"
                            className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none ${
                                errors.address ? 'ring-2 ring-red-500' : ''
                            }`}
                        />
                        {errors.address && (
                            <p className="text-red-400 text-sm mt-1">{errors.address}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="occupationType" className="block text-white text-sm font-medium mb-2">
                            Occupation Type:
                        </label>
                        <select
                            id="occupationType"
                            name="occupationType"
                            value={formData.occupationType}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                errors.occupationType ? 'ring-2 ring-red-500' : ''
                            }`}
                        >
                            {occupationOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.occupationType && (
                            <p className="text-red-400 text-sm mt-1">{errors.occupationType}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-400 hover:text-blue-300 transition">
                            Sign in here
                        </Link>
                    </p>
                </div>

                {/* Demo Info */}
                <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                    <p className="text-gray-300 text-sm text-center">
                        <strong>Demo:</strong> Fill in the form to create your account
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
