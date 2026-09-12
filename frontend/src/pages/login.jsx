import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import {
    FaSignInAlt,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaSpinner,
    FaExclamationCircle,
    FaPiggyBank,
    FaCreditCard,
    FaChartLine
} from 'react-icons/fa';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
            document.documentElement.style.overflow = previousOverflow;
        };
    }, []);

    const validateForm = () => {
        const newErrors = {};

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
            await login({
                email: formData.email,
                password: formData.password
            });
            navigate('/');
        } catch (error) {
            setErrors({
                general: error.message || 'Login failed. Please try again.'
            });
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

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: '' }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-10">
            <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">
                {/* Branding Panel */}
                <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-blue-700 via-blue-800 to-gray-900 p-8">
                    <div>
                        <div className="flex items-center mb-6">
                            <FaPiggyBank className="text-yellow-400 text-3xl mr-3" />
                            <span className="text-white text-2xl font-bold">PlanPocket</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-4">Welcome Back!</h1>
                        <p className="text-blue-200 mb-8">Your personal finance companion. Track budgets, manage loans, and stay financially healthy.</p>
                    </div>

                    <ul className="space-y-4">
                        <li className="flex items-center text-blue-100">
                            <FaChartLine className="text-green-400 mr-3" />
                            Real-time budget tracking
                        </li>
                        <li className="flex items-center text-blue-100">
                            <FaCreditCard className="text-yellow-400 mr-3" />
                            Loan & EMI management
                        </li>
                        <li className="flex items-center text-blue-100">
                            <FaPiggyBank className="text-purple-400 mr-3" />
                            Savings and debt insights
                        </li>
                    </ul>
                </div>

                {/* Form Panel */}
                <div className="p-8 md:p-10">
                    <div className="text-center mb-8 md:hidden">
                        <FaSignInAlt className="text-blue-400 text-4xl mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-white">Login</h1>
                        <p className="text-gray-400 mt-2">Welcome back to PlanPocket</p>
                    </div>

                    <div className="hidden md:block mb-8">
                        <h2 className="text-2xl font-bold text-white mb-1">Login</h2>
                        <p className="text-gray-400">Enter your credentials to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    autoFocus
                                    className={`w-full pl-11 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 transition ${
                                        errors.email ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'
                                    }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className={`w-full pl-11 pr-12 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 transition ${
                                        errors.password ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    tabIndex={-1}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        {errors.general && (
                            <div className="flex items-center gap-2 bg-red-900/50 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                                <FaExclamationCircle className="shrink-0" />
                                <p className="text-sm">{errors.general}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    <FaSignInAlt />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-gray-400 text-sm">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition font-medium">
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;