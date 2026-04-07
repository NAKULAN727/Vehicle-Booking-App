const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const Booking = require('../models/Booking');
const { v4: uuidv4 } = require('uuid');
const { GoogleGenAI } = require('@google/genai');

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
    const { name, email, password, licenseNumber, type, vehicleMake, vehicleModel, vehiclePlateNumber, experience } = req.body;
    
    const newDriver = new Driver({
      name,
      email,
      password,
      licenseNumber,
      type: type || 'driver_only',
      vehicleMake,
      vehicleModel,
      vehiclePlateNumber,
      experience: experience || 0,
      availability: true
    });
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

const { manager } = require('../chatbotModel');

// POST /chat - Chatbot endpoint (Custom Machine Learning Model)
router.post('/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    
    // Evaluate message against our trained local NLP model
    const nlpResponse = await manager.process('en', message);
    const intent = nlpResponse.intent;
    const score = nlpResponse.score;

    // Reject extremely low confidence predictions (fallback)
    if (score < 0.4 || intent === 'None') {
      return res.json({ reply: "I deeply apologize, but I am unable to process that specific request. May I assist you with checking driver availability, reviewing your itineraries, or providing booking instructions instead?" });
    }

    switch(intent) {
      case 'driver.experience': {
        const drivers = await Driver.find({ availability: true }).sort({ experience: -1 });
        if (drivers.length === 0) return res.json({ reply: 'I apologize, but we have no available drivers at this moment.' });
        
        const driverNames = drivers.map(d => `${d.name} (${d.experience || 0} years experience)`).join('\n- ');
        return res.json({ reply: `Certainly! Here are our available drivers, expertly sorted by their years of experience:\n\n- ${driverNames}\n\nPlease proceed to our reservation system to confirm your request.` });
      }

      case 'driver.car': {
        const drivers = await Driver.find({ availability: true, type: 'driver_with_car' });
        if (drivers.length === 0) return res.json({ reply: 'I regret to inform you that all of our drivers equipped with vehicles are currently engaged. Please check back shortly.' });
        
        const driverNames = drivers.map(d => `${d.name} (${d.vehicleMake || 'Premium'} ${d.vehicleModel || 'Vehicle'})`).join('\n- ');
        return res.json({ reply: `Excellent news. We currently have ${drivers.length} premium driver(s) with private vehicles ready for dispatch:\n\n- ${driverNames}\n\nYou may secure your reservation directly through our Drivers interface.` });
      }

      case 'driver.find': {
        const drivers = await Driver.find({ availability: true });
        if (drivers.length === 0) return res.json({ reply: 'I apologize, but all of our executive drivers are currently deployed. We anticipate more availability shortly.' });
        const driverNames = drivers.map(d => `${d.name} (${d.type === 'driver_only' ? 'Driver Only' : 'With Vehicle'})`).join('\n- ');
        return res.json({ reply: `We presently have ${drivers.length} highly qualified driver(s) available for immediate booking:\n\n- ${driverNames}\n\nPlease proceed to our reservation system to confirm your request.` });
      }

      case 'booking.check': {
        const query = (userId && userId !== 'user_123') ? { userId } : {};
        const bookings = await Booking.find(query).populate('driverId');
        
        if (bookings.length === 0) return res.json({ reply: 'Upon reviewing our records, it appears you do not have any active or upcoming reservations at this time.' });
        
        const bookingDetails = bookings.map(b => `- Date: ${b.date} | Time: ${b.time} | Status: ${b.status.toUpperCase()}${b.driverId ? ` (Driver: ${b.driverId.name})` : ''}`).join('\n');
        return res.json({ reply: `I have retrieved your booking itinerary:\n\n${bookingDetails}\n\nWe look forward to providing you with exceptional service.` });
      }

      case 'booking.help': {
        return res.json({ reply: 'Securing a reservation is quite straightforward. Please follow these instructions:\n\n1. Navigate to our professional "Drivers" directory.\n2. Select the chauffeur that best meets your requirements.\n3. Proceed to "Book" and specify your preferred date and time.\n4. Finalize and confirm your itinerary.\n\nOur team looks forward to serving you.' });
      }

      case 'agent.greeting': {
        return res.json({ reply: 'Greetings! I am your Custom Trained Vehicle Booking Assistant. How may I assist you today?' });
      }

      case 'agent.help': {
        return res.json({ reply: 'I would be delighted to assist you. Here are some of the services I provide:\n- Checking real-time driver availability based on experience or vehicle type\n- Retrieving your personal booking itinerary\n- Guiding you through our reservation process\n\nPlease let me know how I may serve you.' });
      }

      default:
        return res.json({ reply: "I deeply apologize, but I am unable to process that specific request. May I assist you with checking driver availability or reviewing your itineraries instead?" });
    }

  } catch (error) {
    res.status(500).json({ error: 'Chatbot encountered an AI error: ' + error.message });
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
