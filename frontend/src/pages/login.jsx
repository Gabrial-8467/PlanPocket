import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FaSignInAlt } from 'react-icons/fa';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAppContext();
    const navigate = useNavigate();

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
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // For demo purposes, accept any valid email/password
            if (formData.email && formData.password) {
                login({
                    email: formData.email,
                    name: formData.email.split('@')[0]
                });
                navigate('/');
            }
        } catch (error) {
            console.error('Login error:', error);
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
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <FaSignInAlt className="text-blue-400 text-4xl mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white">Login</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition">
                            Sign up here
                        </Link>
                    </p>
                </div>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                    <p className="text-gray-300 text-sm text-center">
                        <strong>Demo:</strong> Use any valid email and password (min 6 chars)
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
