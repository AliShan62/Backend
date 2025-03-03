const mongoose = require('mongoose');

// Define the LocationHistory schema
const locationHistorySchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  startLocation: {
    area: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  endLocation: {
    area: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  durationInMinutes: { type: Number, required: true },  // Duration in minutes
  distanceKm: { type: Number, required: true },        // Distance in kilometers
  reportPeriod: { type: String, required: true },      // Report period (e.g., "2024-11-01 to 2024-11-30")
}, { timestamps: true });

// Create the model from the schema
const LocationHistory = mongoose.model('LocationHistory', locationHistorySchema);

module.exports = LocationHistory;
