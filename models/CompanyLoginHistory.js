const mongoose = require('mongoose');

const companyLoginHistorySchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CompanyProfile', // Reference to the CompanyProfile model
      required: true, // Ensure that companyId is provided
    },
    companyDetails: {
      type: mongoose.Schema.Types.Mixed, // Store the complete company object
      required: true, // Ensure that company details are provided
    },
    loginTime: {
      type: Date,
      default: Date.now, // Automatically log the time of login
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const CompanyLoginHistory = mongoose.model('CompanyLoginHistory', companyLoginHistorySchema);

module.exports = CompanyLoginHistory;
