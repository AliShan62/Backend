// routers/attendanceRoute.js
const express = require("express");
const router = express.Router();
const {
  checkInController,
  getCheckInDetails,
  checkOutController,
  getAttendanceRecordsController,
  GetCurrentLocation,
} = require("../controllers/AttandenceController"); // Ensure correct import
const { authMiddleware } = require("../middleware/authMiddleware");

// Check-in route
router.post("/checkin", authMiddleware, checkInController);

// Check-in route
router.get("/getcheckIndetails", authMiddleware, getCheckInDetails);

// Check-in route
router.post("/currentlocation", authMiddleware, GetCurrentLocation);
// Check-out route
router.post("/checkout", authMiddleware, checkOutController);

// Get attendance records by employee ID
router.get("/:employeeId", authMiddleware, getAttendanceRecordsController);

module.exports = router;
