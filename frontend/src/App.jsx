import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Dashboard from './pages/dashboard';
import Loans from './pages/loans';
import Summary from './pages/summary';
import Login from './pages/login';
import Signup from './pages/Signup';
import Profile from './pages/profile';
import { AppProvider, useAppContext } from './context/AppContext';
import Footer from './components/footer';

function ProtectedRoute({ children }) {
    const { isLoggedIn, loading } = useAppContext();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    return children;
}

function App(){
    return(
        <AppProvider>
            <div className="min-h-screen bg-gray-900">
                <Navbar/>
                <Routes>
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/loan" element={<ProtectedRoute><Loans /></ProtectedRoute>} />
                    <Route path="/summary" element={<ProtectedRoute><Summary /></ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                </Routes>
                <Footer/>
            </div>
        </AppProvider>
    )
}

export default App;