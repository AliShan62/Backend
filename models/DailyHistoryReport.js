const mongoose = require('mongoose');

const dailyHistoryReportSchema = new mongoose.Schema({
  branch: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  reportData: [
    {
      employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      started: {
        type: Date,
        required: true,
      },
      finished: {
        type: Date,
        required: true,
      },
      locationIn: {
        type: String,
        required: true,
      },
      locationOut: {
        type: String,
        required: true,
      },
      spent: {
        type: Number,
        required: true,
      },
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DailyHistoryReport = mongoose.model('DailyHistoryReport', dailyHistoryReportSchema);

module.exports = DailyHistoryReport;
