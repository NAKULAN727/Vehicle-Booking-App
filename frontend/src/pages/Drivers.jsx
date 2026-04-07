import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Car, MapPin } from 'lucide-react';

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
    pickupLocation: '',
    dropLocation: '',
    carModel: ''
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
    if (!bookingData.date || !bookingData.time || !bookingData.pickupLocation || !bookingData.dropLocation) {
      alert('Please fill in all standard trip details (Date, Time, Pickup, Dropoff)');
      return;
    }

    if (type === 'driver_with_car' && !bookingData.carModel) {
      alert('Please select a car model for your trip');
      return;
    }
    
    try {
      await axios.post(`${API_URL}/book`, {
        driverId,
        type,
        ...bookingData,
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
        <h2>Available Rides & Drivers</h2>
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

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={20} /> Entrip Trip Details
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Pickup Location</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Starting Point"
              onChange={(e) => setBookingData({...bookingData, pickupLocation: e.target.value})}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Drop Location</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Destination Point"
              onChange={(e) => setBookingData({...bookingData, dropLocation: e.target.value})}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Date</label>
            <input 
              type="date" 
              className="form-control" 
              onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Time</label>
            <input 
              type="time" 
              className="form-control" 
              onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
            />
          </div>
        </div>

        {(filterType === 'driver_with_car' || initialType === 'driver_with_car') && (
          <div className="form-group" style={{ margin: 0, paddingTop: '1rem', borderTop: '1px solid #eaeaea' }}>
            <label className="form-label">Select Car Model</label>
            <select 
              className="form-control"
              onChange={(e) => setBookingData({...bookingData, carModel: e.target.value})}
            >
              <option value="">Select Preferred Model</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <p>Searching for drivers...</p>
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
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.4rem', fontWeight: 600 }}>
                    Experience: {driver.experience || 1} years
                  </div>
                  {driver.type === 'driver_with_car' && driver.vehicleMake && (
                     <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                       <Car size={14} /> {driver.vehicleMake} {driver.vehicleModel} • {driver.vehiclePlateNumber}
                     </div>
                  )}
                </div>
              </div>
              <button 
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
                onClick={() => handleBook(driver._id, driver.type)}
              >
                Book {driver.type === 'driver_with_car' ? 'Ride' : 'Driver'}
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
