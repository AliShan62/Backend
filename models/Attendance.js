const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true, // Links attendance to an employee
    },
    firstName: {
      type: String,
      ref: "Employee",
      required: true,
    },
    lastName: {
      type: String,
      ref: "Employee",
      required: true,
    },
    branch: {
      type: String,
      required: [true, "Enter the branch"],
    },
    checkIn: {
      type: Date,
      default: null, // Will store check-in time
    },
    checkOut: {
      type: mongoose.Schema.Types.Mixed,
      default: "Pending", // Can be a date or 'Pending'
      validate: {
        validator: function (value) {
          return value === "Pending" || value instanceof Date;
        },
        message: 'CheckOut must be a date or "Pending".',
      },
    },
    totalHours: {
      type: Number,
      default: 0, // Auto-calculated based on check-in and check-out
    },
    status: {
      type: String,
      enum: ["Pending", "Success"], // "Pending" before check-out, "Success" after
      default: "Pending",
    },
    date: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^\d{4}-\d{2}-\d{2}$/.test(value); // Format YYYY-MM-DD
        },
        message: "Date must be in the format YYYY-MM-DD.",
      },
    },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt fields

attendanceSchema.methods.calculateTotalHours = function () {
  if (this.checkIn && this.checkOut instanceof Date) {
    const diffInMs = this.checkOut - this.checkIn;
    this.totalHours = Math.round(diffInMs / (1000 * 60 * 60)); // Convert ms to hours
  }
};

// Create the Attendance model
const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
