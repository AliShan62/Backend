// routers/employeeRoute.js
const express = require('express');
const router = express.Router();
const { addEmployeeController,employeeLoginController,getProfileController,updateProfileController,deleteProfileController,logoutController} = require('../controllers/EmployeesController');
const { authMiddleware } = require('../middleware/authMiddleware');
// Ensure correct import

// Define the route for employee registration
router.post('/registration', addEmployeeController);

// Define the route for employee login
router.post('/login', employeeLoginController);

// getProfile
// router.get('/getprofile/:uniqueKey',authMiddleware, getProfileController);
router.get('/getprofile/:uniqueKey',authMiddleware, getProfileController);
//updateProfile
// Route to update employee profile by uniqueKey
router.put('/updateprofile/:uniqueKey',authMiddleware, updateProfileController);
//deleteProfile
router.delete('/deleteprofile/:uniqueKey',authMiddleware, deleteProfileController);
//logout
router.post('/logout',logoutController);

module.exports = router;