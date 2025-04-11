const express = require("express");

const {
  signup,
  login,
  getCompanyProfile,
  updateCompanyProfile,
  changePassword,
  deleteCompanyProfile,
  logoutCompany,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../controllers/CompanyController");

const compMiddleware = require("../middleware/compMiddleware");
const { isAuthenticated } = require("../middleware/auth");
// Sign up and login routes

const router = express.Router();

// Route to register a new company
router.post("/register", signup);

router.post("/login", login);

router.get("/profile/me", isAuthenticated, (req, res) => {
  res.status(200).json({ message: "Authenticated" });
}); // Get company profile details

// Get company profile details for editing
router.get("/profile/:id", isAuthenticated, getCompanyProfile); // Get profile by company ID

// Update company profile details
router.put("/profile/:id", isAuthenticated, updateCompanyProfile); // Update profile by company ID

// Update company profile details
router.put("/changePassword/:id", isAuthenticated, changePassword);

// Delete company profile
router.delete("/profile/:id", isAuthenticated, deleteCompanyProfile); // Delete profile by company ID
// Logout route
router.post("/logout", isAuthenticated, logoutCompany); // Logout route

// Route for Forgot Password
router.post("/forgot-password", forgotPassword);

// Route for Verify Reset Code
router.post("/verify-reset-code", verifyResetCode);

// Route for Reset Password
router.post("/reset-password", resetPassword);

module.exports = router;
