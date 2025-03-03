const mongoose = require('mongoose');

const checkInOutHistoryReportSchema = new mongoose.Schema({
  branchSelection: { type: String, required: true },
  employeeSelection: { type: String, required: true },
  startDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
  reportData: { type: Array, required: true }, // Store the report data
  generatedAt: { type: Date, default: Date.now }, // Timestamp for when the report was generated
});

const CheckInOutHistoryReport = mongoose.model(
  'CheckInOutHistoryReport',
  checkInOutHistoryReportSchema
);

module.exports = CheckInOutHistoryReport;
