const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const Booking = require('../models/Booking');
const { v4: uuidv4 } = require('uuid');

// GET /drivers - Get all available drivers, optional filter by type
router.get('/drivers', async (req, res) => {
  try {
    const { type } = req.query;
    const query = { availability: true };
    if (type) {
      query.type = type;
    }
    const drivers = await Driver.find(query);
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /book - Create a new booking
router.post('/book', async (req, res) => {
  try {
    const { userId, driverId, type, date, time } = req.body;
    
    // Check if driver is available
    const driver = await Driver.findById(driverId);
    if (!driver || !driver.availability) {
      return res.status(400).json({ error: 'Driver is not available' });
    }

    const bookingId = uuidv4();
    const newBooking = new Booking({
      bookingId,
      userId: userId || 'user_123', // Hardcoded user for simplicity if not provided
      driverId,
      type,
      date,
      time,
      status: 'confirmed'
    });

    await newBooking.save();

    // Optionally mark driver as unavailable
    // driver.availability = false;
    // await driver.save();

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /bookings - Retrieve user bookings
router.get('/bookings', async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const bookings = await Booking.find(query).populate('driverId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
