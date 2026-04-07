const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  type: { type: String, enum: ['driver_only', 'driver_with_car'], default: 'driver_only' },
  carModel: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'accepted', 'ongoing', 'completed', 'cancelled'], default: 'pending' },
});

module.exports = mongoose.model('Booking', bookingSchema);
