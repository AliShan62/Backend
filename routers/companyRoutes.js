const express = require('express');

const { signup, login, getCompanyProfile, updateCompanyProfile,changePassword, deleteCompanyProfile, logoutCompany } = require('../controllers/CompanyController');

// Sign up and login routes

const router = express.Router();

// Route to register a new company
router.post('/register', signup);

router.post('/login',login );

// Get company profile details for editing
router.get('/profile/:id', getCompanyProfile); // Get profile by company ID

// Update company profile details
router.put('/profile/:id', updateCompanyProfile); // Update profile by company ID

// Update company profile details
router.put('/changePassword/:id', changePassword); 

// Delete company profile
router.delete('/profile/:id', deleteCompanyProfile); // Delete profile by company ID


// Logout route
router.post('/logout', logoutCompany); // Logout rou

module.exports = router;
