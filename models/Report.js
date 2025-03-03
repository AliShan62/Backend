const mongoose = require('mongoose');

// Define the schema for Report
const reportSchema = new mongoose.Schema({
  reportData: [{
    firstName: String,
    lastName: String,
    phoneNumber: String,
    dateAdded: Date
  }],
  reportType: {
    
    type: String,
    enum: ['My Employees', 'OtherReportType'],  // Define the valid report types
    required: true  // Ensure reportType is required
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
});

// Create the Report model from the schema
const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
