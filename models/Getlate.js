const mongoose = require('mongoose');

// Define the schema for the Late Attendance Report
const lateAttendanceReportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  attendanceStartTime: {
    type: Date,
    required: true,
  },
  checkInTime: {
    type: Date,
    required: true,
  },
  late: {
    type: Boolean,
    required: true,
  },
  lateDuration: {
    type: Number,
    default: 0, // Store in minutes
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model for the Late Attendance Report
const LateAttendanceReport = mongoose.model('LateAttendanceReport', lateAttendanceReportSchema);

module.exports = LateAttendanceReport;
