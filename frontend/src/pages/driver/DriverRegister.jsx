import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCheck } from 'lucide-react';
import '../../Auth.css';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const DriverRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Create actual driver profile on backend database
      await axios.post(`${API_URL}/drivers`, { name });
      alert('Driver registered successfully! Please login.');
      navigate('/driver/login');
    } catch (error) {
      console.error(error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <UserCheck size={40} />
          </div>
          <h2 className="auth-title">Driver Registration</h2>
          
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="auth-input-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name"
                className="auth-input" 
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="auth-input-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email"
                className="auth-input" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="auth-input-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password"
                className="auth-input" 
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="auth-btn">
              Register as Driver
            </button>
          </form>
          
          <div className="auth-link-text">
            Already have a driver account? <Link to="/driver/login" className="auth-link">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverRegister;
