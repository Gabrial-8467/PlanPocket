import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Dashboard from './pages/dashboard';
import Loans from './pages/loans';
import Summary from './pages/summary';
import Login from './pages/login';
import Signup from './pages/Signup';
import Profile from './pages/profile';
import { AppProvider } from './context/AppContext';
import Footer from './components/footer';

function App(){
    return(
        <AppProvider>
            <div className="min-h-screen bg-gray-900">
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/loan" element={<Loans />} />
                    <Route path="/summary" element={<Summary />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
                <Footer/>
            </div>
        </AppProvider>
    )
}

export default App;