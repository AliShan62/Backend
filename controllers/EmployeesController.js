const express = require("express");
const Employee = require("../models/Employee");
const LoginActivity = require("../models/LoginActivity");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

dotenv.config(); // Load environment variables

// Send Email Function
const sendEmail = async (email, uniqueKey) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const message = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to the Location Tracking App",
      text: `Welcome to our app! Your Employee ID is ${uniqueKey}. Please log in to get started: http://yourapp.com/login`,
    };

    await transporter.sendMail(message);
    console.log("✅ Email sent successfully to " + email);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

// Controller to Add Employee
const addEmployeeController = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      shift,
      branch,
      joiningDate,
      role,
      avatar,
      location,
      geo,
      realTime,
      nfcQr,
      forceQr,
    } = req.body;

    console.log(req.body);

    // Check if employee already exists by email
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({
        message: "❌ Employee with this email already exists.",
        success: false,
      });
    }

    // If phoneNumber is provided, ensure it's unique
    if (phoneNumber) {
      const existingPhone = await Employee.findOne({ phoneNumber });
      if (existingPhone) {
        return res.status(400).json({
          message: "❌ Employee with this phone number already exists.",
          success: false,
        });
      }
    }

    // Generate uniqueKey
    const employeeCount = await Employee.countDocuments();
    const uniqueKey = `EPM-${1000 + employeeCount + 1}`;

    // Create new employee instance
    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      phoneNumber: phoneNumber || null, // Optional phone number
      shift,
      branch,
      joiningDate: joiningDate || Date.now(),
      role: role || "user",
      avatar: avatar || { public_id: "", url: "" },
      location: location && location.lat && location.lng ? location : null,
      geo,
      realTime,
      nfcQr,
      forceQr,
      uniqueKey, // Assign the generated uniqueKey
    });

    // Save to database
    await newEmployee.save();

    // Send welcome email with uniqueKey
    await sendEmail(email, uniqueKey);

    // Return success response
    res.status(201).json({
      message: "✅ Employee added successfully!",
      success: true,
      employee: {
        firstName,
        lastName,
        email,
        phoneNumber: newEmployee.phoneNumber,
        shift,
        branch,
        joiningDate: newEmployee.joiningDate,
        role: newEmployee.role,
        avatar: newEmployee.avatar,
        location: newEmployee.location,
        geo: newEmployee.geo,
        realTime: newEmployee.realTime,
        nfcQr: newEmployee.nfcQr,
        forceQr: newEmployee.forceQr,
        uniqueKey: newEmployee.uniqueKey, // Include uniqueKey in response
      },
    });
  } catch (error) {
    console.error("❌ Error adding employee:", error);
    res.status(500).json({
      message: "❌ An error occurred while adding the employee.",
      error: error.message,
      success: false,
    });
  }
};

const employeeLoginController = async (req, res) => {
  try {
    const { uniqueKey } = req.body;

    // Validate input
    if (!uniqueKey || typeof uniqueKey !== "string") {
      return res.status(400).json({
        message: "Invalid unique key provided.",
        success: false,
      });
    }

    // Fetch employee details (excluding salary-related fields)
    const employee = await Employee.findOne({ uniqueKey }).select(
      "firstName lastName email phoneNumber branch shift role uniqueKey"
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found with this unique key.",
        success: false,
      });
    }

    // Log activity
    await new LoginActivity({
      uniqueKey: employee.uniqueKey,
      employeeDetails: employee.toObject(),
    }).save();

    // Generate JWT
    const token = jwt.sign(
      { uniqueKey: employee.uniqueKey, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set token in cookies
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    // Respond with employee details
    res.status(200).json({
      message: "Login successful.",
      success: true,
      employee: {
        token,
        ...employee.toObject(), // Spread employee details for cleaner response
      },
    });

    console.log("✅ Login successful for uniqueKey:", uniqueKey);
  } catch (error) {
    console.error("❌ Error logging in employee:", error.message);
    res.status(500).json({
      message: "An error occurred during login.",
      success: false,
    });
  }
};

//

//   try {
//     const { uniqueKey } = req.body;

//     // Validate input
//     if (!uniqueKey || typeof uniqueKey !== "string") {
//       return res.status(400).json({
//         message: "Invalid unique key provided.",
//         success: false,
//       });
//     }

//     // Fetch employee details
//     const employee = await Employee.findOne({ uniqueKey }).select(
//       "firstName lastName email phoneNumber branch shift hourlyWages salary salaryBased totalSalary role uniqueKey"
//     );

//     if (!employee) {
//       return res.status(404).json({
//         message: "Employee not found with this unique key.",
//         success: false,
//       });
//     }

//     // Log activity
//     const loginActivity = new LoginActivity({
//       uniqueKey: employee.uniqueKey,
//       employeeDetails: {
//         firstName: employee.firstName,
//         lastName: employee.lastName,
//         email: employee.email,
//         phoneNumber: employee.phoneNumber,
//         branch: employee.branch,
//         shift: employee.shift,
//         hourlyWages: employee.hourlyWages,
//         salary: employee.salary,
//         salaryBased: employee.salaryBased,
//         totalSalary: employee.totalSalary,
//         role: employee.role,
//       },
//     });

//     await loginActivity.save();

//     // Generate JWT
//     const token = jwt.sign(
//       { uniqueKey: employee.uniqueKey, role: employee.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     // Set token in cookies
//     res.cookie("authToken", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 3600000,
//     });

//     // Respond with employee details
//     res.status(200).json({
//       message: "Login successful.",
//       success: true,
//       employee: {
//         token: token,
//         firstName: employee.firstName,
//         lastName: employee.lastName,
//         email: employee.email,
//         phoneNumber: employee.phoneNumber,
//         branch: employee.branch,
//         shift: employee.shift,
//         hourlyWages: employee.hourlyWages,
//         salary: employee.salary,
//         salaryBased: employee.salaryBased,
//         totalSalary: employee.totalSalary,
//         role: employee.role,
//         uniqueKey: employee.uniqueKey,
//       },
//     });

//     console.log("Login attempt for uniqueKey:", uniqueKey, token);
//   } catch (error) {
//     console.error("Error logging in employee:", error.message, error.stack);
//     res.status(500).json({
//       message: "An error occurred during login.",
//       success: false,
//     });
//   }
// };

const getProfileController = async (req, res) => {
  try {
    const { uniqueKey, token } = req.query; // Expecting the uniqueKey in the request params

    console.log(uniqueKey, token);

    // Find employee by unique key
    const employee = await Employee.findOne({ uniqueKey });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found.",
        success: false,
      });
    }

    res.status(200).json({
      message: "Employee profile fetched successfully.",
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      message: "An error occurred while fetching the profile.",
      success: false,
    });
  }
};

// Controller to update employee profile
const updateProfileController = async (req, res) => {
  try {
    const { uniqueKey } = req.params; // Expecting uniqueKey in the request params
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      shift,
      branch,
      salaryBased,
      hourlyWages,
      salary,
    } = req.body;

    // Find employee by uniqueKey
    const employee = await Employee.findOne({ uniqueKey });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found.",
        success: false,
      });
    }

    // Update the employee profile with new data
    employee.firstName = firstName || employee.firstName;
    employee.lastName = lastName || employee.lastName;
    employee.email = email || employee.email;
    employee.phoneNumber = phoneNumber || employee.phoneNumber;
    employee.shift = shift || employee.shift;
    employee.branch = branch || employee.branch;
    employee.salaryBased =
      salaryBased !== undefined ? salaryBased : employee.salaryBased;
    employee.hourlyWages =
      hourlyWages !== undefined ? hourlyWages : employee.hourlyWages;
    employee.salary = salary !== undefined ? salary : employee.salary;

    // Recalculate total salary if needed
    employee.totalSalary = salaryBased ? salary : hourlyWages * 160;

    // Save updated employee profile
    await employee.save();

    res.status(200).json({
      message: "Employee profile updated successfully.",
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      message: "An error occurred while updating the profile.",
      success: false,
    });
  }
};

// Controller to delete employee profile
const deleteProfileController = async (req, res) => {
  try {
    const { uniqueKey } = req.params; // Expecting uniqueKey in the request params

    // Find and delete employee by uniqueKey
    const employee = await Employee.findOneAndDelete({ uniqueKey });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found.",
        success: false,
      });
    }

    res.status(200).json({
      message: "Employee profile deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({
      message: "An error occurred while deleting the profile.",
      success: false,
    });
  }
};

// Controller to handle logout
const logoutController = (req, res) => {
  try {
    // Clear the authToken from cookies
    res.clearCookie("authToken");

    // Respond with success
    res.status(200).json({
      message: "Logout successful.",
      success: true,
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({
      message: "An error occurred during logout.",
      success: false,
    });
  }
};

module.exports = {
  addEmployeeController,
  employeeLoginController,
  getProfileController,
  updateProfileController,
  deleteProfileController,
  logoutController,
};
