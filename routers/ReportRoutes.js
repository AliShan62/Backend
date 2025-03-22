const express = require("express");
const {
  generateMyEmployeesReport,
  generateWorkingHoursReport,
  generateDailyHistoryReport,
  generateLocationHistoryReport,
  generateSalaryReport,
  generateLocationReport,
  getCheckInOutHistoryReport,
  getLateAttendanceReport,
} = require("../controllers/ReportController"); //

//Import the controller
const router = express.Router();

// Route to generate "My Employees" report with query parameters for branch selection
router.get("/generate-my-employees-report", generateMyEmployeesReport);

// Route to generate "My Employees" report with query parameters for branch selection
router.get("/working-hours", generateWorkingHoursReport);

router.get("/daily-history-report", generateDailyHistoryReport);

router.get("/location-history-report", generateLocationHistoryReport);

// Define the route for generating the salary report
router.get("/salary-report", generateSalaryReport);

router.get("/location-report", generateLocationReport);

router.get("/ChecksHistory", getCheckInOutHistoryReport);

// Route to get the Late Attendance Report
router.get("/get-late", getLateAttendanceReport);

module.exports = router;
