import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Car } from 'lucide-react';

// Using consistent API URL
const API_URL = 'http://localhost:5000/api';

const Drivers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialType = queryParams.get('type') || '';

  const [drivers, setDrivers] = useState([]);
  const [filterType, setFilterType] = useState(initialType);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    driverId: null
  });

  useEffect(() => {
    fetchDrivers();
  }, [filterType]);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const endpoint = filterType ? `${API_URL}/drivers?type=${filterType}` : `${API_URL}/drivers`;
      const res = await axios.get(endpoint);
      setDrivers(res.data);
    } catch (error) {
      console.error('Error fetching drivers', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (driverId, type) => {
    if (!bookingData.date || !bookingData.time) {
      alert('Please select date and time');
      return;
    }
    
    try {
      await axios.post(`${API_URL}/book`, {
        driverId,
        type,
        date: bookingData.date,
        time: bookingData.time,
        userId: 'user_123'
      });
      alert('Booking confirmed!');
      navigate('/bookings');
    } catch (error) {
      console.error('Booking failed', error);
      alert('Failed to book. Please try again.');
    }
  };

  return (
    <div className="animation-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Available Drivers</h2>
        <select 
          className="form-control" 
          style={{ width: 'auto' }}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Services</option>
          <option value="driver_only">Driver Only</option>
          <option value="driver_with_car">Driver + Vehicle</option>
        </select>
      </div>

      <div className="glass-panel" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <h4 style={{ margin: 0, paddingRight: '1rem', borderRight: '1px solid rgba(255,255,255,0.1)' }}>Booking Details:</h4>
        <input 
          type="date" 
          className="form-control" 
          style={{ padding: '0.5rem', width: 'auto' }}
          onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
        />
        <input 
          type="time" 
          className="form-control" 
          style={{ padding: '0.5rem', width: 'auto' }}
          onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
        />
      </div>

      {loading ? (
        <p>Loading available drivers...</p>
      ) : (
        <div className="drivers-grid">
          {drivers.map(driver => (
            <div key={driver._id} className="glass-panel driver-card">
              <div className="driver-info">
                <div className="avatar">
                  {driver.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>{driver.name}</h3>
                  <div className="badge">
                    {driver.type === 'driver_only' ? 'Driver Only' : 'Driver + Vehicle'}
                  </div>
                </div>
              </div>
              <button 
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
                onClick={() => handleBook(driver._id, driver.type)}
              >
                Book Now
              </button>
            </div>
          ))}
          {drivers.length === 0 && (
            <p>No drivers available for the selected criteria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Drivers;
