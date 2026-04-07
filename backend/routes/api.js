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

// POST /drivers - Register a new driver
router.post('/drivers', async (req, res) => {
  try {
    const { name } = req.body;
    const newDriver = new Driver({ name, type: 'driver_only', availability: true });
    await newDriver.save();
    res.status(201).json(newDriver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /book - Create a new booking
router.post('/book', async (req, res) => {
  try {
    const { userId, driverId, type, date, time, pickupLocation, dropLocation, carModel } = req.body;
    
    // Check if driver is available (If driverId is provided)
    if (driverId) {
      const driver = await Driver.findById(driverId);
      if (!driver || !driver.availability) {
        return res.status(400).json({ error: 'Driver is not available' });
      }
    }

    const bookingId = uuidv4();
    const newBooking = new Booking({
      bookingId,
      userId: userId || 'user_123', // Hardcoded user for simplicity if not provided
      driverId,
      type,
      date,
      time,
      pickupLocation,
      dropLocation,
      carModel,
      status: 'pending'
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

// PUT /bookings/:id/accept
router.put('/bookings/:id/accept', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'accepted' }, { new: true });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /bookings/:id/complete
router.put('/bookings/:id/complete', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'completed' }, { new: true });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /driver/bookings/available
router.get('/driver/bookings/available', async (req, res) => {
  try {
    const bookings = await Booking.find({ status: 'pending' }).populate('driverId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /driver/bookings/my-trips
router.get('/driver/bookings/my-trips', async (req, res) => {
  try {
    const bookings = await Booking.find({ status: { $in: ['accepted', 'ongoing', 'completed'] } }).populate('driverId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
