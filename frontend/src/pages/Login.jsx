import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import '../Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/home');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <Lock size={36} />
          </div>
          <h2 className="auth-title">Login</h2>
          
          <form className="auth-form" onSubmit={handleLogin}>
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="auth-btn">
              Login
            </button>
          </form>
          
          <div className="auth-link-text">
            Don't have an account? <Link to="/register" className="auth-link">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
