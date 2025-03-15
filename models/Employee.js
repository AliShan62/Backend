const mongoose = require("mongoose");
const validator = require("validator");

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
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    avatar: {
      public_id: {
        type: String,
        required: [true, "Avatar public_id is required"],
      },
      url: {
        type: String,
        required: [true, "Avatar URL is required"],
      },
    },
    geo: {
      type: Boolean,
      required: true,
      default: false,
    },
    realTime: {
      type: Boolean,
      required: true,
      default: false,
    },
    nfcQr: {
      type: Boolean,
      required: true,
      default: false,
    },
    forceQr: {
      type: Boolean,
      required: true,
      default: false,
    },
    branch: {
      type: String,
      trim: true,
    },
    shift: {
      type: String,
      trim: true,
    },
    hourlyWages: {
      type: Number,
      required: function () {
        return !this.salaryBased;
      },
      min: [0, "Hourly wages must be greater than 0 when not salary-based"],
    },
    salary: {
      type: Number,
      required: function () {
        return this.salaryBased;
      },
      min: [0, "Salary must be greater than 0 when salary-based"],
    },
    salaryBased: {
      type: Boolean,
      default: false,
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
      min: [0, "Total hours cannot be negative"],
    },
    uniqueKey: {
      type: String,
      unique: true,
      required: true,
      default: function () {
        return Math.random().toString(36).substr(2, 5).toUpperCase(); // Generates exactly 5 characters
      },
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "manager"],
    },
  },
  { timestamps: true }
);

// Middleware for calculating totalSalary
employeeSchema.pre("save", function (next) {
  if (this.salaryBased) {
    if (this.salary && this.overtime >= 0) {
      this.totalSalary =
        this.salary + this.overtime * (this.salary / 160) * 1.5;
    }
  } else {
    if (this.hourlyWages && this.totalHours >= 0) {
      this.totalSalary = this.hourlyWages * this.totalHours;
    }
  }
  next();
});

// Create the Employee model
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
