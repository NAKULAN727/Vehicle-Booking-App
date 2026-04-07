import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Drivers from './pages/Drivers';
import Bookings from './pages/Bookings';
import Login from './pages/Login';
import Register from './pages/Register';
import Chatbot from './components/Chatbot';

import DriverNavbar from './components/DriverNavbar';
import DriverLogin from './pages/driver/DriverLogin';
import DriverDashboard from './pages/driver/DriverDashboard';
import DriverTrips from './pages/driver/DriverTrips';
import DriverRegister from './pages/driver/DriverRegister';

function App() {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isDriverAuth = localStorage.getItem('isDriverAuthenticated') === 'true';
  
  const isDriverAppPath = location.pathname === '/driver' || location.pathname.startsWith('/driver/');
  const isDriverRoute = isDriverAppPath && location.pathname !== '/driver' && location.pathname !== '/driver/register';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/driver' || location.pathname === '/driver/register';

  return (
    <>
      {!isAuthPage && !isDriverRoute && (
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
            <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
            <Route path="/drivers" element={isAuthenticated ? <Drivers /> : <Navigate to="/login" />} />
            <Route path="/bookings" element={isAuthenticated ? <Bookings /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      )}

      {!isAuthPage && isDriverRoute && (
        <div className="app-container">
          <DriverNavbar />
          <Routes>
            <Route path="/driver/dashboard" element={isDriverAuth ? <DriverDashboard /> : <Navigate to="/driver" />} />
            <Route path="/driver/trips" element={isDriverAuth ? <DriverTrips /> : <Navigate to="/driver" />} />
            <Route path="*" element={<Navigate to="/driver" />} />
          </Routes>
        </div>
      )}
      
      {isAuthPage && (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/driver" element={<DriverLogin />} />
          <Route path="/driver/register" element={<DriverRegister />} />
        </Routes>
      )}
      
      {isAuthenticated && !isDriverRoute && <Chatbot />}
    </>
  );
}

export default App;
