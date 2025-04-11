const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const CompanyProfile = require("../models/CompanyProfile"); //import the CompanyProfile model
const CompanyLoginHistory = require("../models/CompanyLoginHistory"); // Import the model // Correctly
const validator = require("validator");

// Sign Up Controller
const signup = async (req, res) => {
  try {
    const {
      businessName,
      email,
      phone,
      fax,
      username,
      password,
      companyImage,
      qrCodeImage,
      checkoutRange,
      image,
      resetTime,
      timeFormat,
      verifyCheckout,
      salaryEnable,
      latitude,
      longitude,
    } = req.body;

    // Validate required fields
    if (!businessName || !email || !phone || !username || !password) {
      return res.status(400).json({
        error:
          "Business Name, Email, Phone, Username, and Password are required.",
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    const passwordStrengthRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!passwordStrengthRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long and contain at least one letter, one number and one special character.",
      });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 12);

    // Check if email or username already exists
    const existingEmail = await CompanyProfile.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already in use." });
    }

    const existingUsername = await CompanyProfile.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken." });
    }

    // Create new company profile
    const newCompanyProfile = new CompanyProfile({
      businessName,
      email,
      phone,
      fax: fax || "",
      username,
      password: hashedPassword,
      companyImage: companyImage || "",
      qrCodeImage: qrCodeImage || "",
      checkoutRange: checkoutRange || "",
      image: image || "",
      resetTime: resetTime || "",
      timeFormat: timeFormat || "24",
      verifyCheckout: verifyCheckout || false,
      salaryEnable: salaryEnable || false,
      location: {
        latitude: latitude || 0,
        longitude: longitude || 0,
      },
    });

    // Save the new company profile to the database
    await newCompanyProfile.save();

    return res.status(201).json({
      message: "Company profile created successfully!",
      companyProfile: newCompanyProfile,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the company profile." });
  }
};

// Login Controller
// const login = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Check if username and password are provided
//     if (!username || !password) {
//       return res.status(400).json({ error: 'Username and password are required' });
//     }

//     // Find the company by username
//     const company = await CompanyProfile.findOne({ username });

//     // If no company is found, return an error
//     if (!company) {
//       return res.status(400).json({ error: 'Invalid username or password' });
//     }

//     // Debugging output to verify the received password and hashed password from DB
//     console.log('Password to compare:', password);  // Password from user input
//     console.log('Hashed password from DB:', company.password);  // Hashed password from the database

//     // Use bcrypt.compare() to compare the plain-text password with the hashed password in DB
//     const isMatch = await bcrypt.compare(password, company.password);

//     // Debugging line to check if passwords match
//     console.log('Password match result:', isMatch);

//     if (!isMatch) {
//       return res.status(400).json({ error: 'Invalid username or password' });
//     }

//     // Generate a JWT token for the company
//     const token = jwt.sign(
//       { companyId: company._id }, // Payload containing companyId
//       process.env.JWT_SECRET, // Secret key (store this in .env file)
//       { expiresIn: '10s' } // Expiration time for the token (1 hour)
//     );

//     // Send the token and company info in the response
//     res.status(200).json({
//       message: 'Login successful',
//       token, // Send the generated token
//       company: {
//         businessName: company.businessName,
//         email: company.email,
//         phone: company.phone,
//         username: company.username
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Find the company by username
    const company = await CompanyProfile.findOne({ username }).select(
      "+password"
    );

    // If no company is found, return an error
    if (!company) {
      return res.status(400).json({ error: "Company profile doesn't exist!" });
    }

    // Use bcrypt.compare() to compare the plain-text password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, company.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "Incorrect password! Try again later." });
    }

    // Generate a JWT token for the company
    const token = jwt.sign(
      { companyId: company._id }, // Payload containing companyId
      process.env.JWT_SECRET, // Secret key (store this in .env file)
      { expiresIn: "90d" } // More secure expiration time
    );

    const options = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Cookie expiration (90 days)
      httpOnly: true, // Ensures cookie cannot be accessed via JavaScript
      // secure: process.env.NODE_ENV === "production", // Set to true in production (HTTPS required)
      // maxAge: 90 * 24 * 60 * 60 * 1000, // Cookie expiration (1 hour)
      sameSite: "None", // Prevents CSRF attacks
    };

    // Prepare the login history object
    const loginHistory = new CompanyLoginHistory({
      companyId: company._id,
      companyDetails: {
        businessName: company.businessName,
        email: company.email,
        phone: company.phone,
        fax: company.fax,
        username: company.username,
        companyImage: company.companyImage,
        qrCodeImage: company.qrCodeImage,
        checkoutRange: company.checkoutRange,
        image: company.image,
        resetTime: company.resetTime,
        timeFormat: company.timeFormat,
        verifyCheckout: company.verifyCheckout,
        salaryEnable: company.salaryEnable,
        location: company.location,
      },
      loginTime: new Date(),
    });

    // Save the login history into the database
    await loginHistory.save();

    // Send the company info in the response
    res.status(200).cookie("Token", token, options).json({
      message: "Logged in successfully!",
      success: true,
      token, // Send the generated token
      company,
    });
  } catch (error) {
    console.error("Login error:", error); // More detailed error logging
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logout Company
const logoutCompany = (req, res) => {
  try {
    // You can destroy the token by setting it to null or removing it from cookies or localStorage
    res.clearCookie("Token"); // This clears the token stored in the cookie (if you're using cookies for session)

    return res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred during logout" });
  }
};

// Get Company Profile (for editing)
const getCompanyProfile = async (req, res) => {
  try {
    const companyId = req.params.id; // Use company ID or any unique identifier
    const companyProfile = await CompanyProfile.findById(companyId);

    if (!companyProfile) {
      return res.status(404).json({ error: "Company profile not found" });
    }

    // Return the company profile details for editing
    return res.status(200).json({
      message: "Company profile fetched successfully",
      companyProfile,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the company profile" });
  }
};

// Update Company Profile
const updateCompanyProfile = async (req, res) => {
  try {
    const companyId = req.params.id; // Use company ID or any unique identifier
    const {
      businessName,
      email,
      phone,
      fax,
      username,
      password,
      companyImage,
      qrCodeImage,
      checkoutRange,
      image,
      resetTime,
      timeFormat,
      verifyCheckout,
      salaryEnable,
      latitude,
      longitude,
    } = req.body;

    // Validate required fields
    if (!businessName || !email || !phone || !username) {
      return res.status(400).json({
        error: "Business Name, Email, Phone, and Username are required.",
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    // Check if email or username already exists
    const existingEmail = await CompanyProfile.findOne({ email });
    if (existingEmail && existingEmail._id.toString() !== companyId) {
      return res.status(400).json({ error: "Email already in use." });
    }

    const existingUsername = await CompanyProfile.findOne({ username });
    if (existingUsername && existingUsername._id.toString() !== companyId) {
      return res.status(400).json({ error: "Username already taken." });
    }

    // Find the company profile
    const companyProfile = await CompanyProfile.findById(companyId);
    if (!companyProfile) {
      return res.status(404).json({ error: "Company profile not found" });
    }

    // Update the company profile with the provided data
    const updatedCompanyProfile = await CompanyProfile.findByIdAndUpdate(
      companyId,
      {
        businessName,
        email,
        phone,
        fax: fax || "",
        username,
        password,
        companyImage: companyImage || "",
        qrCodeImage: qrCodeImage || "",
        checkoutRange: checkoutRange || "",
        image: image || "",
        resetTime: resetTime || "",
        timeFormat: timeFormat || "24",
        verifyCheckout: verifyCheckout || false,
        salaryEnable: salaryEnable || false,
        location: {
          latitude: latitude || 0,
          longitude: longitude || 0,
        },
      },
      { new: true } // Return the updated profile
    );

    return res.status(200).json({
      message: "Company profile updated successfully!",
      companyProfile: updatedCompanyProfile,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the company profile" });
  }
};

// Delete Company Profile
const deleteCompanyProfile = async (req, res) => {
  try {
    const companyId = req.params.id; // Use company ID or any unique identifier

    // Find and delete the company profile
    const deletedProfile = await CompanyProfile.findByIdAndDelete(companyId);

    if (!deletedProfile) {
      return res.status(404).json({ error: "Company profile not found" });
    }

    return res.status(200).json({
      message: "Company profile deleted successfully",
      companyProfile: deletedProfile,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the company profile" });
  }
};

//changePassword
const changePassword = async (req, res) => {
  try {
    const companyId = req.params.id; // Use company ID or any unique identifier
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Validate required fields
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        error: "Old password, new password, and confirm password are required.",
      });
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "New password and confirm password do not match." });
    }

    // Find the company profile by ID
    const company = await CompanyProfile.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: "Company profile not found." });
    }

    // Check if the old password is correct
    const isMatch = await bcrypt.compare(oldPassword, company.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect." });
    }

    const passwordStrengthRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!passwordStrengthRegex.test(newPassword)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long and contain at least one letter, one number and one special character.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the company profile with the new hashed password
    company.password = hashedPassword;
    await company.save();

    return res.status(200).json({
      message: "Password changed successfully!",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while changing the password." });
  }
};

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail", // You can change this to your SMTP provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

// Function to send email
const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // Your email address
      to: to,
      subject: subject,
      text: text,
    });
    return info.accepted.length > 0; // If the email is sent successfully, return true
  } catch (error) {
    console.error("Error sending email:", error);
    return false; // Return false if email sending failed
  }
};

// Forgot password controller for Company Profile
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const company = await CompanyProfile.findOne({ email });
    if (!company) {
      return res.status(400).json({ error: "Company profile not found!" });
    }

    // Generate 5-digit code
    const resetCode = Math.floor(10000 + Math.random() * 90000).toString();
    const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save code and expiration
    company.resetCode = resetCode;
    company.resetCodeExpires = resetCodeExpires;
    await company.save();

    // Send email
    const emailSent = await sendEmail(
      email,
      "Password Reset Code",
      `Your password reset code is: ${resetCode}. It will expire in 15 minutes.`
    );

    if (!emailSent) {
      return res.status(500).json({ error: "Failed to send email" });
    }

    res.status(200).json({ message: "Verification code sent to email" });
  } catch (error) {
    console.error("Error in forgotPassword controller:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Verify reset code controller for Company Profile
const verifyResetCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const company = await CompanyProfile.findOne({ email });
    if (
      !company ||
      company.resetCode !== code ||
      company.resetCodeExpires < new Date()
    ) {
      return res.status(400).json({ error: "Invalid or expired code" });
    }

    res.status(200).json({ message: "Code verified successfully" });
  } catch (error) {
    console.error("Error in verifyResetCode controller:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Reset password controller for Company Profile with Confirm Password
const resetPassword = async (req, res) => {
  const { email, code, newPassword, confirmPassword } = req.body;

  try {
    if (!newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ error: "Both new password and confirmation password are required." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    const passwordStrengthRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!passwordStrengthRegex.test(newPassword)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long and contain at least one letter, one number and one special character.",
      });
    }

    const company = await CompanyProfile.findOne({ email });
    if (
      !company ||
      company.resetCode !== code ||
      company.resetCodeExpires < new Date()
    ) {
      return res.status(400).json({ error: "Invalid or expired code" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    company.password = hashedPassword;
    company.resetCode = undefined;
    company.resetCodeExpires = undefined;

    await company.save();
    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword controller:", error);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = {
  signup,
  login,
  getCompanyProfile,
  updateCompanyProfile,
  deleteCompanyProfile,
  logoutCompany,
  changePassword,
  forgotPassword,
  verifyResetCode,
  resetPassword,
};
