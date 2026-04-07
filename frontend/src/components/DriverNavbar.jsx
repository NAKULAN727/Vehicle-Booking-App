import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const DriverNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isDriverAuthenticated');
    navigate('/driver');
  };

  return (
    <nav className="navbar">
      <Link to="/driver/dashboard" className="navbar-brand">
        DriveFlow <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500, marginLeft: '0.5rem' }}>| Driver Portal</span>
      </Link>
      <div className="nav-links" style={{ alignItems: 'center' }}>
        <Link to="/driver/dashboard" className={`nav-link ${location.pathname === '/driver/dashboard' ? 'active' : ''}`}>
          Dashboard
        </Link>
        <Link to="/driver/trips" className={`nav-link ${location.pathname === '/driver/trips' ? 'active' : ''}`}>
          My Trips
        </Link>
        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1.5rem', marginLeft: '1rem' }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default DriverNavbar;
