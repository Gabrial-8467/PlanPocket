import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import {
    FaUserPlus,
    FaUser,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaPhone,
    FaMapMarkerAlt,
    FaBriefcase,
    FaSpinner,
    FaExclamationCircle,
    FaPiggyBank
} from 'react-icons/fa';

const inputClass = (hasError) =>
    `w-full pl-10 pr-10 py-2.5 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 transition text-sm ${
        hasError ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'
    }`;

const PasswordInput = ({ id, name, value, placeholder, show, onToggle, onChange, hasError }) => (
    <div className="relative">
        <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
        <input
            type={show ? 'text' : 'password'}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={inputClass(hasError)}
        />
        <button
            type="button"
            onClick={onToggle}
            tabIndex={-1}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
            aria-label={show ? 'Hide password' : 'Show password'}
        >
            {show ? <FaEyeSlash /> : <FaEye />}
        </button>
    </div>
);

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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register, login } = useAppContext();
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

    const getPasswordStrength = (password) => {
        if (!password) return { score: 0, label: '', color: '', text: '' };
        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 10) score++;
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        const labels = [
            { score: 1, label: 'Very Weak', color: 'bg-red-500', text: 'text-red-400' },
            { score: 2, label: 'Weak', color: 'bg-orange-500', text: 'text-orange-400' },
            { score: 3, label: 'Fair', color: 'bg-yellow-500', text: 'text-yellow-400' },
            { score: 4, label: 'Good', color: 'bg-lime-500', text: 'text-lime-400' },
            { score: 5, label: 'Strong', color: 'bg-green-500', text: 'text-green-400' }
        ];
        const match = labels.find(l => l.score === score) || labels[labels.length - 1];
        return { score, label: match.label, color: match.color, text: match.text };
    };

    const strength = getPasswordStrength(formData.password);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await register({
                name: formData.fullName,
                email: formData.email,
                password: formData.password,
                contactNumber: formData.contactNumber,
                address: formData.address,
                occupationType: formData.occupationType
            });
            navigate('/');
        } catch (error) {
            if (error?.message?.toLowerCase().includes('user already exists')) {
                try {
                    await login({
                        email: formData.email,
                        password: formData.password
                    });
                    navigate('/');
                    return;
                } catch (loginErr) {
                    console.error('Auto-login failed:', loginErr);
                }
            }
            setErrors({ general: error?.message || 'Signup failed. Please try again.' });
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

    const fieldError = (name) =>
        errors[name] && (
            <p className="text-red-400 text-xs mt-1">{errors[name]}</p>
        );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-6">
            <div className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="text-center pt-7 pb-5 px-6">
                    <div className="flex items-center justify-center mb-2">
                        <FaPiggyBank className="text-yellow-400 text-2xl mr-2" />
                        <span className="text-white text-xl font-bold">PlanPocket</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Create Your Account</h1>
                    <p className="text-gray-400 text-sm mt-1">Join PlanPocket and take control of your finances</p>
                </div>

                <form onSubmit={handleSubmit} className="px-6 pb-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="fullName" className="block text-white text-sm font-medium mb-1.5">
                            Full Name
                        </label>
                        <div className="relative">
                            <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className={`pl-10 ${inputClass(errors.fullName)}`}
                            />
                        </div>
                        {fieldError('fullName')}
                    </div>

                    <div>
                        <label htmlFor="contactNumber" className="block text-white text-sm font-medium mb-1.5">
                            Contact Number
                        </label>
                        <div className="relative">
                            <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <input
                                type="tel"
                                id="contactNumber"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                placeholder="Contact Number"
                                className={`pl-10 ${inputClass(errors.contactNumber)}`}
                            />
                        </div>
                        {fieldError('contactNumber')}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-white text-sm font-medium mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className={`pl-10 ${inputClass(errors.email)}`}
                            />
                        </div>
                        {fieldError('email')}
                    </div>

                    <div>
                        <label htmlFor="occupationType" className="block text-white text-sm font-medium mb-1.5">
                            Occupation Type
                        </label>
                        <div className="relative">
                            <FaBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs z-10" />
                            <select
                                id="occupationType"
                                name="occupationType"
                                value={formData.occupationType}
                                onChange={handleChange}
                                className={`pl-10 ${inputClass(errors.occupationType)} appearance-none`}
                            >
                                {occupationOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {fieldError('occupationType')}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-white text-sm font-medium mb-1.5">
                            Password
                        </label>
                        <PasswordInput
                            id="password"
                            name="password"
                            value={formData.password}
                            placeholder="Password"
                            show={showPassword}
                            onToggle={() => setShowPassword((v) => !v)}
                            onChange={handleChange}
                            hasError={errors.password}
                        />
                        {fieldError('password')}

                        {formData.password && (
                            <div className="mt-1.5">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((bar) => (
                                        <div
                                            key={bar}
                                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                                                bar <= strength.score ? strength.color : 'bg-gray-600'
                                            }`}
                                        ></div>
                                    ))}
                                </div>
                                <p className={`text-xs mt-1 ${strength.text}`}>
                                    Strength: {strength.label}
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-white text-sm font-medium mb-1.5">
                            Confirm Password
                        </label>
                        <PasswordInput
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            placeholder="Confirm Password"
                            show={showConfirmPassword}
                            onToggle={() => setShowConfirmPassword((v) => !v)}
                            onChange={handleChange}
                            hasError={errors.confirmPassword}
                        />
                        {fieldError('confirmPassword')}
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="address" className="block text-white text-sm font-medium mb-1.5">
                            Address
                        </label>
                        <div className="relative">
                            <FaMapMarkerAlt className="absolute left-3.5 top-3 text-gray-400 text-xs" />
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Address"
                                rows="2"
                                className={`pl-10 ${inputClass(errors.address)} resize-none`}
                            ></textarea>
                        </div>
                        {fieldError('address')}
                    </div>

                    {errors.general && (
                        <div className="sm:col-span-2 flex items-center gap-2 bg-red-900/50 border border-red-500 text-red-400 px-4 py-2.5 rounded-lg">
                            <FaExclamationCircle className="shrink-0" />
                            <p className="text-sm">{errors.general}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="sm:col-span-2 w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
                    >
                        {isLoading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Creating Account...
                            </>
                        ) : (
                            <>
                                <FaUserPlus />
                                Create Account
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center pb-6 px-6">
                    <p className="text-gray-400 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-400 hover:text-blue-300 transition font-medium">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;