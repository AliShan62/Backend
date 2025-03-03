// routes/shiftRoutes.js
const express = require('express');
const router = express.Router();
const {createShift,getShifts,getShiftById,updateShift,deleteShift} = require('../controllers/ShiftController');

// Create a new shift
router.post('/create', createShift);

// Get all shifts
router.get('/getallshift', getShifts);

// Get a single shift by ID with full details
router.get('/:shiftId', getShiftById);

// Update a shift
router.put('/update/:shiftId', updateShift);

// Delete a shift
router.delete('/delete/:shiftId', deleteShift);


module.exports = router;
