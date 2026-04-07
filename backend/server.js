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

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/driver_booking')
  .then(() => {
    console.log('Connected to MongoDB');
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
      { name: 'John Doe', type: 'driver_only', availability: true },
      { name: 'Jane Smith', type: 'driver_with_car', availability: true },
      { name: 'Michael Johnson', type: 'driver_only', availability: true },
      { name: 'Emily Davis', type: 'driver_with_car', availability: true },
    ];
    await Driver.insertMany(drivers);
    console.log('Database seeded with dummy drivers.');
  }
}
