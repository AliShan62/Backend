const mongoose = require('mongoose');

// Define the schema for Working Hours Report
const workingHoursReportSchema = new mongoose.Schema({
  reportData: [{
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    hoursOfWork: { type: Number, required: true },
    branch: { type: String, required: true },
    dateAdded: { type: Date, required: true }
  }],
  reportType: {
    type: String,
    enum: ['Working Hours Report'],
    required: true
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Create the WorkingHoursReport model from the schema
const WorkingHoursReport = mongoose.model('WorkingHoursReport', workingHoursReportSchema);

module.exports = WorkingHoursReport;
