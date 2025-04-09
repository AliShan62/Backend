const mongoose = require("mongoose");

// Branch Schema
const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Enforce unique name
    },
    location: {
      city: {
        type: String,
        required: true,
      },
      latitude: {
        type: Number,
        required: true,
        validate: {
          validator: (v) => v >= -90 && v <= 90,
          message: "Latitude must be between -90 and 90",
        },
      },
      longitude: {
        type: Number,
        required: true,
        validate: {
          validator: (v) => v >= -180 && v <= 180,
          message: "Longitude must be between -180 and 180",
        },
      },
    },
    radius: {
      type: Number,
      default: 5000, // Set the default radius (e.g., 5000 meters)
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", // Assuming you have a Company model
      required: true, // The companyId now represents the main branch
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the model from the schema
const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;
