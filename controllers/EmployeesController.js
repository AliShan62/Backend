const express = require("express");
const Employee = require("../models/Employee");
const LoginActivity = require("../models/LoginActivity");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const router = express.Router();

// Utility function to generate a 5-character alphanumeric unique key
const generateUniqueKey = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let uniqueKey = "";
  for (let i = 0; i < 5; i++) {
    uniqueKey += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `EMP-${uniqueKey}`;
};

// Function to send email with employee details
const sendEmail = async (email, uniqueKey) => {
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
    text: `Welcome to our app! Your unique key is ${uniqueKey}. Please use this key to login to the location tracking app: http://yourapp.com/login`,
  };

  try {
    await transporter.sendMail(message);
    console.log("Email sent successfully to " + email);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Controller for adding an employee (wrapped in try-catch)
const addEmployeeController = async (req, res) => {
  try {
    // Destructure employee data from the request body
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

    // Check if employee already exists by email or phone number
    const existingEmployee = await Employee.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }],
    });

    if (existingEmployee) {
      return res.status(400).json({
        message:
          "Employee with this email or phone number is already registered.",
        success: false,
      });
    }

    // Validate salary or hourly wages based on salaryBased flag
    if (salaryBased && !salary) {
      return res.status(400).json({
        message: "Salary is required for salaried employees.",
        success: false,
      });
    }

    if (!salaryBased && !hourlyWages) {
      return res.status(400).json({
        message: "Hourly wages are required for hourly employees.",
        success: false,
      });
    }

    // Generate a unique key for the employee
    const uniqueKey = generateUniqueKey();

    // Create a new employee record
    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      phoneNumber,
      shift,
      branch,
      salaryBased,
      hourlyWages,
      salary,
      totalSalary: salaryBased ? salary : hourlyWages * 160, // Assuming 160 working hours in a month
      uniqueKey,
    });

    // Save new employee to the database
    await newEmployee.save();

    // Send welcome email with the unique key
    await sendEmail(email, uniqueKey);

    // Return success response with employee details
    res.status(201).json({
      message: "Employee added successfully!",
      success: true,
      employee: {
        firstName,
        lastName,
        email,
        phoneNumber,
        uniqueKey,
        shift,
        branch,
        salaryBased,
        hourlyWages,
        salary,
        totalSalary: newEmployee.totalSalary,
      },
    });
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({
      message: "An error occurred while adding the employee.",
      success: false,
    });
  }
};

// Controller for employee login based on uniqueKey
// Login Controller with JWT
// const employeeLoginController = async (req, res) => {
//   try {
//     // Destructure the uniqueKey from the request body
//     const { uniqueKey } = req.body;

//     // Validate if uniqueKey is provided
//     if (!uniqueKey) {
//       return res.status(400).json({
//         message: 'Unique Key is required',
//         success: false,
//       });
//     }

//     // Find the employee by unique key
//     const employee = await Employee.findOne({ uniqueKey });

//     // Check if employee is found
//     if (!employee) {
//       return res.status(404).json({
//         message: 'Employee not found with this unique key',
//         success: false,
//       });
//     }

//     // Create a JWT token
//     const token = jwt.sign({ uniqueKey: employee.uniqueKey }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     // Set the token in the cookies
//     res.cookie('authToken', token, {
//       httpOnly: true, // Ensures the cookie is only accessible by the server
//       secure: process.env.NODE_ENV === 'production', // Ensure this is secure in production (use HTTPS)
//       maxAge: 3600000, // 1 hour
//     });

//     // Respond with employee details and success
//     res.status(200).json({
//       message: 'Login successful',
//       success: true,
//       employee: {
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
//   } catch (error) {
//     console.error('Error logging in employee:', error);
//     res.status(500).json({
//       message: 'An error occurred during login',
//       success: false,
//     });
//   }
// };

// const employeeLoginController = async (req, res) => {
//   try {
//     const { uniqueKey } = req.body;

//     // Validate if uniqueKey is provided
//     if (!uniqueKey) {
//       return res.status(400).json({
//         message: 'Unique Key is required',
//         success: false,
//       });
//     }

//     // Find the employee by unique key
//     const employee = await Employee.findOne({ uniqueKey });

//     if (!employee) {
//       return res.status(404).json({
//         message: 'Employee not found with this unique key',
//         success: false,
//       });
//     }

//     // Save login activity with full employee details
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

//     await loginActivity.save(); // Save login activity to database

//     // Create a JWT token
//     const token = jwt.sign({ uniqueKey: employee.uniqueKey }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     // Set the token in the cookies
//     res.cookie('authToken', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 3600000, // 1 hour
//     });

//     // Respond with employee details
//     res.status(200).json({
//       message: 'Login successful',
//       success: true,
//       employee: {
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
//   } catch (error) {
//     console.error('Error logging in employee:', error);
//     res.status(500).json({
//       message: 'An error occurred during login',
//       success: false,
//     });
//   }
// };
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

    // Fetch employee details
    const employee = await Employee.findOne({ uniqueKey }).select(
      "firstName lastName email phoneNumber branch shift hourlyWages salary salaryBased totalSalary role uniqueKey"
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found with this unique key.",
        success: false,
      });
    }

    // Log activity
    const loginActivity = new LoginActivity({
      uniqueKey: employee.uniqueKey,
      employeeDetails: {
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phoneNumber: employee.phoneNumber,
        branch: employee.branch,
        shift: employee.shift,
        hourlyWages: employee.hourlyWages,
        salary: employee.salary,
        salaryBased: employee.salaryBased,
        totalSalary: employee.totalSalary,
        role: employee.role,
      },
    });

    await loginActivity.save();

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
        token: token,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phoneNumber: employee.phoneNumber,
        branch: employee.branch,
        shift: employee.shift,
        hourlyWages: employee.hourlyWages,
        salary: employee.salary,
        salaryBased: employee.salaryBased,
        totalSalary: employee.totalSalary,
        role: employee.role,
        uniqueKey: employee.uniqueKey,
      },
    });

    console.log("Login attempt for uniqueKey:", uniqueKey, token);
  } catch (error) {
    console.error("Error logging in employee:", error.message, error.stack);
    res.status(500).json({
      message: "An error occurred during login.",
      success: false,
    });
  }
};

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
