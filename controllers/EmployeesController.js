const express = require("express");
const Employee = require("../models/Employee");
const LoginActivity = require("../models/LoginActivity");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const router = express.Router();
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
    text: `Welcome to our app! Your unique key is ${uniqueKey}. Please use this key to log in: http://yourapp.com/login`,
  };

  try {
    await transporter.sendMail(message);
    console.log("Email sent successfully to " + email);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const addEmployeeController = async (req, res) => {
  try {
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
      joiningDate,
      role,
      avatar,
      location,
      realTimeTracking,
      nfcQrEnabled,
      forceQrScan,
      overtime,
      totalHours,
    } = req.body;

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingEmployee) {
      return res.status(400).json({
        message: "Employee with this email or phone number already exists.",
        success: false,
      });
    }

    // Validate salary or hourly wages
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

    // Compute total salary (if applicable)
    let totalSalary = salaryBased
      ? salary
      : (hourlyWages || 0) * (totalHours || 0);
    if (overtime) {
      totalSalary += overtime;
    }

    // Create new employee instance
    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      phoneNumber,
      shift,
      branch,
      salaryBased,
      hourlyWages: hourlyWages || null,
      salary: salary || null,
      totalSalary,
      overtime: overtime || 0,
      totalHours: totalHours || 0,
      joiningDate,
      role: role || "user",
      avatar: avatar || { public_id: "", url: "" },
      location: location || { lat: null, lng: null },
      realTimeTracking: realTimeTracking || false,
      nfcQrEnabled: nfcQrEnabled || false,
      forceQrScan: forceQrScan || false,
    });

    // Save to database
    await newEmployee.save();

    // Ensure uniqueKey exists before sending email
    if (!newEmployee.uniqueKey) {
      console.error("Error: uniqueKey not generated.");
    } else {
      await sendEmail(email, newEmployee.uniqueKey);
    }

    // Return success response with all fields
    res.status(201).json({
      message: "Employee added successfully!",
      success: true,
      employee: {
        firstName,
        lastName,
        email,
        phoneNumber,
        uniqueKey: newEmployee.uniqueKey,
        shift,
        branch,
        salaryBased,
        hourlyWages: newEmployee.hourlyWages,
        salary: newEmployee.salary,
        totalSalary: newEmployee.totalSalary,
        overtime: newEmployee.overtime,
        totalHours: newEmployee.totalHours,
        joiningDate: newEmployee.joiningDate,
        role: newEmployee.role,
        avatar: newEmployee.avatar,
        location: newEmployee.location,
        realTimeTracking: newEmployee.realTimeTracking,
        nfcQrEnabled: newEmployee.nfcQrEnabled,
        forceQrScan: newEmployee.forceQrScan,
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
