const mongoose = require('mongoose');

const loginActivitySchema = new mongoose.Schema(
  {
    uniqueKey: {
      type: String,
      required: true, // Unique identifier for the employee
    },
    employeeDetails: {
      type: mongoose.Schema.Types.Mixed, // Store the complete employee object
      required: true,
    },
    loginTime: {
      type: Date,
      default: Date.now, // Automatically log the time of login
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const LoginActivity = mongoose.model('LoginActivity', loginActivitySchema);

module.exports = LoginActivity;
