import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCheck } from 'lucide-react';
import '../Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Simulate registration
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/home');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <UserCheck size={36} />
          </div>
          <h2 className="auth-title">Create Account</h2>
          
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="auth-input-group">
              <label htmlFor="name">Name</label>
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
              Register
            </button>
          </form>
          
          <div className="auth-link-text">
            Already have an account? <Link to="/login" className="auth-link">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
