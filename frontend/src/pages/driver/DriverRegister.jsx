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
  const [licenseNumber, setLicenseNumber] = useState('');
  const [experience, setExperience] = useState('');
  const [type, setType] = useState('driver_only');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState('');
  const [seatingCapacity, setSeatingCapacity] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Create actual driver profile on backend database
      await axios.post(`${API_URL}/drivers`, { 
        name, email, password, licenseNumber, experience, type, vehicleMake, vehicleModel, vehiclePlateNumber, seatingCapacity
      });
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
            
            <div className="auth-input-group">
              <label htmlFor="licenseNumber">License Number</label>
              <input 
                type="text" 
                id="licenseNumber"
                className="auth-input" 
                placeholder="Enter your license number"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="experience">Years of Experience</label>
              <input 
                type="number" 
                id="experience"
                className="auth-input" 
                placeholder="e.g. 5"
                min="0"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="type">Service Type</label>
              <select
                id="type"
                className="auth-input"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="driver_only">Driver Only</option>
                <option value="driver_with_car">Driver + Vehicle</option>
              </select>
            </div>

            {type === 'driver_with_car' && (
              <>
                <div className="auth-input-group">
                  <label htmlFor="vehicleMake">Vehicle Make (e.g. Maruti, Honda)</label>
                  <input 
                    type="text" 
                    id="vehicleMake"
                    className="auth-input" 
                    placeholder="Enter vehicle make"
                    value={vehicleMake}
                    onChange={(e) => setVehicleMake(e.target.value)}
                    required
                  />
                </div>
                <div className="auth-input-group">
                  <label htmlFor="vehicleModel">Vehicle Model (e.g. Swift, City)</label>
                  <input 
                    type="text" 
                    id="vehicleModel"
                    className="auth-input" 
                    placeholder="Enter vehicle model"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    required
                  />
                </div>
                <div className="auth-input-group">
                  <label htmlFor="vehiclePlateNumber">License Plate Number</label>
                  <input 
                    type="text" 
                    id="vehiclePlateNumber"
                    className="auth-input" 
                    placeholder="e.g. KA-01-EQ-1234"
                    value={vehiclePlateNumber}
                    onChange={(e) => setVehiclePlateNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="auth-input-group">
                  <label htmlFor="seatingCapacity">Seating Capacity (Excluding Driver)</label>
                  <input 
                    type="number" 
                    id="seatingCapacity"
                    className="auth-input" 
                    placeholder="e.g. 4"
                    min="1"
                    value={seatingCapacity}
                    onChange={(e) => setSeatingCapacity(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            
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
