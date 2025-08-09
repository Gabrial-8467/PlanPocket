import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdOutlineDashboard } from "react-icons/md";
import { HiMenu, HiX } from "react-icons/hi";
import { HiMiniCreditCard } from "react-icons/hi2";
import { BsFillFileRichtextFill } from "react-icons/bs";
import { CiLogin } from "react-icons/ci";
import { FaUserPlus } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { useAppContext } from '../context/AppContext';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { isLoggedIn, logout } = useAppContext();
    const location = useLocation();

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const toggleProfile = () => setProfileOpen(!profileOpen);

    const navItems = [
        { name: 'Dashboard', href: '/', icon: <MdOutlineDashboard className="mr-1" /> },
        { name: 'Loans', href: '/loan', icon: <HiMiniCreditCard className="mr-1" /> },
        { name: 'Summary', href: '/summary', icon: <BsFillFileRichtextFill className="mr-1" /> },
    ];

    const handleLogout = () => {
        logout();
        setProfileOpen(false);
    };

    return (
        <>
            <nav className="bg-gray-800 px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-white text-3xl font-bold cursor-pointer">
                    PlanPocket
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center text-lg transition ${
                                location.pathname === item.href 
                                    ? 'text-blue-400' 
                                    : 'text-white hover:text-gray-300'
                            }`}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}

                    {/* Auth Buttons */}
                    {!isLoggedIn ? (
                        <>
                            <Link
                                to="/login"
                                className="flex items-center text-white text-lg hover:text-gray-300 transition"
                            >
                                <CiLogin className="mr-1" />
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="flex items-center text-white text-lg hover:text-gray-300 transition"
                            >
                                <FaUserPlus className="mr-1" />
                                Signup
                            </Link>
                        </>
                    ) : (
                        <div className="relative">
                            <div
                                className="flex items-center cursor-pointer text-white text-lg hover:text-gray-300"
                                onClick={toggleProfile}
                            >
                                <FaUserCircle className="mr-2 text-xl" />
                                Profile
                            </div>
                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">My Profile</Link>
                                    <Link to="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Settings</Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden text-white text-3xl cursor-pointer" onClick={toggleMenu}>
                    <HiMenu />
                </div>
            </nav>

            {/* Overlay */}
            {menuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleMenu}></div>
            )}

            {/* Mobile Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-gray-900 z-50 p-6 transform ${
                    menuOpen ? 'translate-x-0' : 'translate-x-full'
                } transition-transform duration-300 ease-in-out md:hidden`}
            >
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-white text-2xl font-bold">Menu</h2>
                    <HiX className="text-white text-3xl cursor-pointer" onClick={toggleMenu} />
                </div>

                <nav className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center text-lg transition ${
                                location.pathname === item.href 
                                    ? 'text-blue-400' 
                                    : 'text-white hover:text-gray-300'
                            }`}
                            onClick={toggleMenu}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}

                    {!isLoggedIn ? (
                        <>
                            <Link
                                to="/login"
                                className="flex items-center text-white text-lg hover:text-gray-300 transition"
                                onClick={toggleMenu}
                            >
                                <CiLogin className="mr-1" />
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="flex items-center text-white text-lg hover:text-gray-300 transition"
                                onClick={toggleMenu}
                            >
                                <FaUserPlus className="mr-1" />
                                Signup
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/profile" className="flex items-center text-white text-lg hover:text-gray-300 transition" onClick={toggleMenu}>
                                <FaUserCircle className="mr-2" />
                                My Profile
                            </Link>
                            <Link to="/settings" className="flex items-center text-white text-lg hover:text-gray-300 transition" onClick={toggleMenu}>
                                Settings
                            </Link>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    toggleMenu();
                                }}
                                className="flex items-center text-red-500 text-lg hover:text-red-300 transition"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </>
    );
}

export default Navbar;
