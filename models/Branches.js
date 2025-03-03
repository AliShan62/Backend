// models/Branch.js

const mongoose = require('mongoose');

// Branch Schema
const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // Enforce unique name
  },
  tag: {
    type: String, // This will store the QR code data or file reference
    required: true
  },
  location: {
    city: {
      type: String,
      required: true
    },
    latitude: {
      type: Number,
      required: true,
      validate: {
        validator: (v) => v >= -90 && v <= 90,
        message: 'Latitude must be between -90 and 90'
      }
    },
    longitude: {
      type: Number,
      required: true,
      validate: {
        validator: (v) => v >= -180 && v <= 180,
        message: 'Longitude must be between -180 and 180'
      }
    }
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Branch = mongoose.model('Branch', branchSchema);

module.exports = Branch;
