// routers/attendanceRoute.js
const express = require("express");
const router = express.Router();
const {
  checkInController,
  checkOutController,
  getAttendanceRecordsController,
} = require("../controllers/AttandenceController"); // Ensure correct import
const { authMiddleware } = require("../middleware/authMiddleware");

// Check-in route
router.post("/checkin", authMiddleware, checkInController);

// Check-out route
router.post("/checkout", checkOutController);

// Get attendance records by employee ID
router.get("/:employeeId", authMiddleware, getAttendanceRecordsController);

module.exports = router;
