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
    const { name, email, password, licenseNumber, type, vehicleMake, vehicleModel, vehiclePlateNumber } = req.body;
    
    const newDriver = new Driver({
      name,
      email,
      password,
      licenseNumber,
      type: type || 'driver_only',
      vehicleMake,
      vehicleModel,
      vehiclePlateNumber,
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

// POST /chat - Generative Chatbot endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    
    if (!process.env.GEMINI_API_KEY) {
      return res.json({ reply: "I am ready to be a true AI Assistant! However, I need an API Key first.\n\nPlease add a `GEMINI_API_KEY` parameter in your backend `.env` file and restart the server!" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Fetch live system data
    const drivers = await Driver.find({ availability: true });
    const query = (userId && userId !== 'user_123') ? { userId } : {};
    const bookings = await Booking.find(query).populate('driverId');

    // Build Context
    const driverContext = drivers.map(d => `${d.name} (${d.type === 'driver_with_car' ? `Driver + Vehicle [${d.vehiclePlateNumber || 'Unknown'}]` : 'Driver Only'})`).join(', ');
    const bookingContext = bookings.map(b => `${b.date} at ${b.time} - ${b.status}`).join(' | ');

    const prompt = `You are an Executive Vehicle Booking Assistant. 
    Answer the user's query naturally, politely, and comprehensively using plain text. Do not output markdown arrays.
    Do NOT output pre-programmed menus or ask them predefined questions to select from. Just address their exact underlying query intelligently.
    
    CONTEXT (Your Database):
    Available Drivers right now: ${drivers.length > 0 ? driverContext : 'None available currently.'}
    The User's Bookings: ${bookings.length > 0 ? bookingContext : 'No bookings exist for this user.'}
    
    User Query: "${message}"`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return res.json({ reply: response.text });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Chatbot encountered an AI system error: ' + error.message });
  }
});

module.exports = router;
