import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import '../../Auth.css';

const DriverLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('isDriverAuthenticated', 'true');
    navigate('/driver/dashboard');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <Lock size={36} color="#D4AF37" strokeWidth={2} />
            <h2 className="auth-title" style={{ margin: 0 }}>Login</h2>
          </div>
          
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
            Don't have a driver account? <Link to="/driver/register" className="auth-link">Register Here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverLogin;
