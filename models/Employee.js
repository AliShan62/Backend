const mongoose = require("mongoose");
const validator = require("validator");
const { v4: uuidv4 } = require("uuid");

// Define the employee schema
const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Enter the first name"],
      minLength: [2, "First name should have at least 2 characters"],
      maxLength: [30, "First name should not exceed 30 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Enter the last name"],
      minLength: [2, "Last name should have at least 2 characters"],
      maxLength: [30, "Last name should not exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Enter your email address"],
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Enter the phone number"],
      validate: {
        validator: function (value) {
          return validator.isMobilePhone(value, "any", { strictMode: false });
        },
        message: "Enter a valid phone number",
      },
    },
    branch: {
      type: String,
      required: [true, "Enter the branch"],
      enum: ["New York", "Los Angeles", "Chicago", "Houston", "Miami"],
    },
    shift: {
      type: String,
      required: [true, "Enter the shift"],
      enum: ["Morning", "Evening", "Night"],
    },
    salaryBased: {
      type: Boolean,
      required: [true, "Specify if the employee is salary-based"],
    },
    hourlyWages: {
      type: Number,
      required: function () {
        return !this.salaryBased;
      },
      validate: {
        validator: function (value) {
          return this.salaryBased === false ? value > 0 : true;
        },
        message: "Hourly wages should be greater than 0 when not salary-based",
      },
    },
    salary: {
      type: Number,
      required: function () {
        return this.salaryBased;
      },
      validate: {
        validator: function (value) {
          return this.salaryBased === true ? value > 0 : true;
        },
        message: "Salary should be greater than 0 when salary-based",
      },
    },
    totalSalary: {
      type: Number,
      default: 0,
    },
    overtime: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value) {
          return this.salaryBased ? value >= 0 : value === 0;
        },
        message: "Overtime is only applicable for salary-based employees.",
      },
    },
    totalHours: {
      type: Number,
      default: 0,
    },
    joiningDate: {
      type: Date,
      required: [true, "Enter the joining date"],
    },
    uniqueKey: {
      type: String,
      unique: true,
      required: true,
      default: function () {
        return `EMP-${uuidv4().toUpperCase()}`;
      },
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
        validate: [validator.isURL, "Enter a valid URL"],
      },
    },
    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },

    /** GEO-LOCATION (Latitude & Longitude) **/
    location: {
      type: {
        lat: { type: Number, required: false },
        lng: { type: Number, required: false },
      },
      default: null,
    },

    /** REAL-TIME TRACKING **/
    realTimeTracking: {
      type: Boolean,
      default: false,
    },

    /** NFC/QR SCANNING **/
    nfcQrEnabled: {
      type: Boolean,
      default: false,
    },

    /** FORCE QR SCAN **/
    forceQrScan: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Middleware for calculating totalSalary
employeeSchema.pre("save", function (next) {
  if (this.salaryBased) {
    this.totalSalary = this.salary + this.overtime * (this.salary / 160) * 1.5;
  } else {
    this.totalSalary = this.hourlyWages * this.totalHours;
  }
  next();
});

// Create the Employee model
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
