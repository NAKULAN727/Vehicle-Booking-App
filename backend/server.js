const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

const { trainChatbotModel } = require('./chatbotModel');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/driver_booking')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Train Custom Machine Learning Model on startup
    await trainChatbotModel();

    // For development: Seed Database if empty
    seedDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

const Driver = require('./models/Driver');
async function seedDatabase() {
  const count = await Driver.countDocuments();
  if (count === 0) {
    const drivers = [
      { name: 'John Doe', type: 'driver_only', availability: true, licenseNumber: 'DL-1001', experience: 2 },
      { name: 'Jane Smith', type: 'driver_with_car', availability: true, licenseNumber: 'DL-1002', experience: 8 },
      { name: 'Michael Johnson', type: 'driver_only', availability: true, licenseNumber: 'DL-1003', experience: 15 },
      { name: 'Emily Davis', type: 'driver_with_car', availability: true, licenseNumber: 'DL-1004', experience: 1 },
    ];
    await Driver.insertMany(drivers);
    console.log('Database seeded with dummy drivers.');
  }
}
