import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, User, CalendarDays } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        DriveFlow
      </Link>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          Home
        </Link>
        <Link to="/drivers" className={`nav-link ${location.pathname === '/drivers' ? 'active' : ''}`}>
          Book Now
        </Link>
        <Link to="/bookings" className={`nav-link ${location.pathname === '/bookings' ? 'active' : ''}`}>
          My Bookings
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
