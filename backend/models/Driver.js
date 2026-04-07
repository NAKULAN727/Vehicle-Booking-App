const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['driver_only', 'driver_with_car'], required: true, default: 'driver_only' },
  availability: { type: Boolean, default: true },
});

module.exports = mongoose.model('Driver', driverSchema);
