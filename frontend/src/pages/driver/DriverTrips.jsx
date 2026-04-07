import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Clock, Car, CheckCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const DriverTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTrips();
  }, []);

  const fetchMyTrips = async () => {
    try {
      const res = await axios.get(`${API_URL}/driver/bookings/my-trips`);
      setTrips(res.data);
    } catch (error) {
      console.error('Error fetching trips', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (bookingId) => {
    try {
      await axios.put(`${API_URL}/bookings/${bookingId}/complete`);
      setTrips(trips.map(t => t._id === bookingId ? { ...t, status: 'completed' } : t));
    } catch (error) {
      console.error('Error completing booking', error);
      alert('Failed to update status');
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading your trips...</p>;

  return (
    <div className="animation-fade-in">
      <h2 style={{ marginBottom: '2rem' }}>My Trips</h2>
      
      {trips.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>You haven't accepted any trips yet.</h3>
          <p>Go to your Dashboard to find available rides.</p>
        </div>
      ) : (
        <div className="drivers-grid">
          {trips.map(trip => (
            <div key={trip._id} className="glass-panel driver-card" style={{ gap: '0.5rem', border: trip.status === 'completed' ? '1px solid #10b981' : '' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge" style={{ 
                  margin: 0, 
                  background: trip.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)', 
                  color: trip.status === 'completed' ? '#10b981' : '#3b82f6' 
                }}>
                  {trip.status === 'completed' ? 'Completed' : 'Ongoing'}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Driver Only
                </span>
              </div>
              
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={18} color="var(--primary)" />
                  <span>{trip.date} at {trip.time}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <MapPin size={18} color="var(--primary)" style={{ marginTop: '0.2rem' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <span style={{ fontSize: '0.9rem' }}><strong>From:</strong> {trip.pickupLocation}</span>
                    <span style={{ fontSize: '0.9rem' }}><strong>To:</strong> {trip.dropLocation}</span>
                  </div>
                </div>
              </div>

              {trip.status !== 'completed' && (
                <button 
                  className="btn btn-outline" 
                  style={{ marginTop: '1.5rem', width: '100%', borderColor: '#10b981', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  onClick={() => handleComplete(trip._id)}
                >
                  <CheckCircle size={18} /> Mark as Completed
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverTrips;
