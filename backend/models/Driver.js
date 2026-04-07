const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  password: { type: String },
  licenseNumber: { type: String, required: true },
  type: { type: String, enum: ['driver_only', 'driver_with_car'], default: 'driver_only' },
  vehicleMake: { type: String },
  vehicleModel: { type: String },
  vehiclePlateNumber: { type: String },
  experience: { type: Number, default: 0 },
  availability: { type: Boolean, default: true },
});

module.exports = mongoose.model('Driver', driverSchema);
