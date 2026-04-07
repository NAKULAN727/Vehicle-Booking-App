import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarDays } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_URL}/bookings?userId=user_123`);
      setBookings(res.data);
    } catch (error) {
      console.error('Error fetching bookings', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading your bookings...</p>;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>My Bookings</h2>
      
      <div className="bookings-list">
        {bookings.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
            <CalendarDays size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3>No Bookings Found</h3>
            <p className="text-muted">You haven't made any bookings yet.</p>
          </div>
        ) : (
          bookings.map(booking => (
            <div key={booking.bookingId} className="glass-panel booking-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1rem' }}>
                <h3 style={{ margin: '0' }}>
                  {booking.driverId?.name || 'Assigned Driver'}
                </h3>
                <div className={`status-badge status-${booking.status.toLowerCase()}`}>
                  {booking.status.toUpperCase()}
                </div>
              </div>
              <div style={{ width: '100%' }}>
                <p className="text-muted" style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Schedule:</strong> {booking.date} at {booking.time}
                </p>
                <p className="text-muted" style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>From:</strong> {booking.pickupLocation || 'N/A'} <br/>
                  <strong>To:</strong> {booking.dropLocation || 'N/A'}
                </p>
                {booking.carModel && (
                  <p className="text-muted" style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                    <strong>Vehicle:</strong> {booking.carModel}
                  </p>
                )}
                <div className="badge" style={{ marginTop: '0.5rem' }}>
                  {booking.type === 'driver_only' ? 'Driver Only' : 'Driver + Vehicle'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Bookings;
