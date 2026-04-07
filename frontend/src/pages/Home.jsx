import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Car } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const handleSelection = (type) => {
    navigate(`/drivers?type=${type}`);
  };

  return (
    <div className="hero">
      <h1>
        Premium <span className="text-gradient">Chauffeur</span> Services
      </h1>
      <p>
        Experience luxury and convenience. Book a professional driver or a complete package
        with driver and vehicle for your next journey.
      </p>
      
      <div className="options-container">
        <div className="glass-panel option-card" onClick={() => handleSelection('driver_only')}>
          <User className="option-icon" />
          <h3>Driver Only</h3>
          <p className="text-muted" style={{marginTop: '1rem'}}>
            Hire a professional driver for your own vehicle. Safe, reliable, and convenient.
          </p>
        </div>
        
        <div className="glass-panel option-card" onClick={() => handleSelection('driver_with_car')}>
          <Car className="option-icon" />
          <h3>Driver + Vehicle</h3>
          <p className="text-muted" style={{marginTop: '1rem'}}>
            Premium car and driver combo. Perfect for business meetings or special events.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
