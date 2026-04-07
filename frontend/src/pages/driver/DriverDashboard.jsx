import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Clock, Car } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableBookings();
  }, []);

  const fetchAvailableBookings = async () => {
    try {
      const res = await axios.get(`${API_URL}/driver/bookings/available`);
      setBookings(res.data);
    } catch (error) {
      console.error('Error fetching available bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId) => {
    try {
      await axios.put(`${API_URL}/bookings/${bookingId}/accept`);
      // Update local state to remove the accepted booking
      setBookings(bookings.filter(b => b._id !== bookingId));
      alert('Ride Accepted! You can view it in My Trips.');
    } catch (error) {
      console.error('Error accepting booking', error);
      alert('Failed to accept booking');
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading available rides...</p>;

  return (
    <div className="animation-fade-in">
      <h2 style={{ marginBottom: '2rem' }}>Available Bookings</h2>
      
      {bookings.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>No new rides available right now.</h3>
          <p>Please check back later.</p>
        </div>
      ) : (
        <div className="drivers-grid">
          {bookings.map(booking => (
            <div key={booking._id} className="glass-panel driver-card" style={{ gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge" style={{ margin: 0, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  Available
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {booking.type === 'driver_with_car' ? 'Driver + Vehicle' : 'Driver Only'}
                </span>
              </div>
              
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={18} color="var(--primary)" />
                  <span>{booking.date} at {booking.time}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <MapPin size={18} color="var(--primary)" style={{ marginTop: '0.2rem' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <span style={{ fontSize: '0.9rem' }}><strong>From:</strong> {booking.pickupLocation}</span>
                    <span style={{ fontSize: '0.9rem' }}><strong>To:</strong> {booking.dropLocation}</span>
                  </div>
                </div>
              </div>

              <button 
                className="btn btn-primary" 
                style={{ marginTop: '1.5rem', width: '100%' }}
                onClick={() => handleAccept(booking._id)}
              >
                Accept Ride
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
