import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, User, CalendarDays } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-brand">
        DriveFlow
      </Link>
      <div className="nav-links" style={{ alignItems: 'center' }}>
        <Link to="/home" className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}>
          Home
        </Link>
        <Link to="/drivers" className={`nav-link ${location.pathname === '/drivers' ? 'active' : ''}`}>
          Book Now
        </Link>
        <Link to="/bookings" className={`nav-link ${location.pathname === '/bookings' ? 'active' : ''}`}>
          My Bookings
        </Link>
        <button onClick={handleLogout} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', marginLeft: '1rem' }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
