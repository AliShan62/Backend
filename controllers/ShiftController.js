// controllers/shiftController.js
const Shift = require('../models/Shift');

// Create a new shift
exports.createShift = async (req, res) => {
    try {
      const { shiftName, daysOfWeek } = req.body;
  
      // Validate that shiftName and daysOfWeek are provided
      if (!shiftName || !daysOfWeek) {
        return res.status(400).json({ message: 'Shift name and days of week are required' });
      }
  
      // Loop through each day in the daysOfWeek and check for 'dayOff' to disable other fields
      Object.keys(daysOfWeek).forEach(day => {
        if (daysOfWeek[day].dayOff) {
          // If day off, set other fields to null
          daysOfWeek[day].attendanceStart = null;
          daysOfWeek[day].attendanceEnd = null;
          daysOfWeek[day].breakStart = null;
          daysOfWeek[day].breakEnd = null;
          daysOfWeek[day].noBreak = null;
        } else {
          // If not day off, ensure that attendance and break times are provided
          const { attendanceStart, attendanceEnd, breakStart, breakEnd, noBreak } = daysOfWeek[day];
          if ((!attendanceStart || !attendanceEnd) && !(noBreak === true)) {
            return res.status(400).json({ message: `Attendance start and end times are required for ${day}` });
          }
          if (!noBreak && (!breakStart || !breakEnd)) {
            return res.status(400).json({ message: `Break start and end times are required for ${day}` });
          }
        }
      });
  
      // Create a new shift document
      const newShift = new Shift({
        shiftName,
        daysOfWeek,
      });
  
      // Save the shift data to the database
      await newShift.save();
  
      // Respond with success
      res.status(201).json({ message: 'Shift created successfully', shift: newShift });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  


// Get all shifts
exports.getShifts = async (req, res) => {
    try {
      const shifts = await Shift.find();
      
      // Modify each shift to disable fields where dayOff is true
      const modifiedShifts = shifts.map(shift => {
        Object.keys(shift.daysOfWeek).forEach(day => {
          if (shift.daysOfWeek[day].dayOff) {
            shift.daysOfWeek[day].attendanceStart = null;
            shift.daysOfWeek[day].attendanceEnd = null;
            shift.daysOfWeek[day].breakStart = null;
            shift.daysOfWeek[day].breakEnd = null;
            shift.daysOfWeek[day].noBreak = null;
          }
        });
        return shift;
      });
  
      res.status(200).json(modifiedShifts);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  

// Get a single shift by ID with all data
// Get a single shift by ID with all data
exports.getShiftById = async (req, res) => {
    try {
      const { shiftId } = req.params;
  
      // Find the shift by its ID
      const shift = await Shift.findById(shiftId);
  
      // If no shift is found, return a 404 error
      if (!shift) {
        return res.status(404).json({ message: 'Shift not found' });
      }
  
      // Modify the shift data to disable fields where dayOff is true
      Object.keys(shift.daysOfWeek).forEach(day => {
        if (shift.daysOfWeek[day].dayOff) {
          shift.daysOfWeek[day].attendanceStart = null;
          shift.daysOfWeek[day].attendanceEnd = null;
          shift.daysOfWeek[day].breakStart = null;
          shift.daysOfWeek[day].breakEnd = null;
          shift.daysOfWeek[day].noBreak = null;
        }
      });
  
      // Return the full shift data
      res.status(200).json({
        shiftName: shift.shiftName,
        daysOfWeek: shift.daysOfWeek,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  

// Update a shift
exports.updateShift = async (req, res) => {
    try {
      const { shiftId } = req.params;
      const { shiftName, daysOfWeek } = req.body;
  
      // Validate that shiftName and daysOfWeek are provided
      if (!shiftName || !daysOfWeek) {
        return res.status(400).json({ message: 'Shift name and days of week are required' });
      }
  
      // Loop through each day and handle the dayOff logic (disable fields if dayOff is true)
      Object.keys(daysOfWeek).forEach(day => {
        if (daysOfWeek[day].dayOff) {
          // If day off, set other fields to null
          daysOfWeek[day].attendanceStart = null;
          daysOfWeek[day].attendanceEnd = null;
          daysOfWeek[day].breakStart = null;
          daysOfWeek[day].breakEnd = null;
          daysOfWeek[day].noBreak = null;
        } else {
          // If not day off, validate attendance and break fields
          const { attendanceStart, attendanceEnd, breakStart, breakEnd, noBreak } = daysOfWeek[day];
          if ((!attendanceStart || !attendanceEnd) && !(noBreak === true)) {
            return res.status(400).json({ message: `Attendance start and end times are required for ${day}` });
          }
          if (!noBreak && (!breakStart || !breakEnd)) {
            return res.status(400).json({ message: `Break start and end times are required for ${day}` });
          }
        }
      });
  
      // Find and update the shift
      const updatedShift = await Shift.findByIdAndUpdate(shiftId, {
        shiftName,
        daysOfWeek,
      }, { new: true });
  
      if (!updatedShift) {
        return res.status(404).json({ message: 'Shift not found' });
      }
  
      res.status(200).json({ message: 'Shift updated successfully', shift: updatedShift });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  


// Delete a shift
exports.deleteShift = async (req, res) => {
    try {
      const { shiftId } = req.params;
  
      // Find and delete the shift
      const deletedShift = await Shift.findByIdAndDelete(shiftId);
  
      if (!deletedShift) {
        return res.status(404).json({ message: 'Shift not found' });
      }
  
      res.status(200).json({ message: 'Shift deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  

