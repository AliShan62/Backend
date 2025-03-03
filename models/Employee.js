const mongoose = require('mongoose');
const validator = require('validator');

// Define the employee schema
const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Enter the first name'],
      minLength: [2, 'First name should have at least 2 characters'],
      maxLength: [30, 'First name should not exceed 30 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Enter the last name'],
      minLength: [2, 'Last name should have at least 2 characters'],
      maxLength: [30, 'Last name should not exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Enter your email address'],
      unique: true,
      validate: [validator.isEmail, 'Please enter a valid email address'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Enter the phone number'],
    },
    branch: {
      type: String,
      required: [true, 'Enter the branch'],
    },
    shift: {
      type: String,
      required: [true, 'Enter the shift'],
    },
    hourlyWages: {
      type: Number,
      required: function () {
        return this.salaryBased === false;
      },
      validate: {
        validator: function (value) {
          return this.salaryBased === false ? value > 0 : true;
        },
        message: 'Hourly wages should be greater than 0 when not salary-based',
      },
    },
    salary: {
      type: Number,
      required: function () {
        return this.salaryBased === true;
      },
      validate: {
        validator: function (value) {
          return this.salaryBased === true ? value > 0 : true;
        },
        message: 'Salary should be greater than 0 when salary-based',
      },
    },
    salaryBased: {
      type: Boolean,
      required: [true, 'Specify if the employee is salary-based'],
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
        message: 'Overtime is only applicable for salary-based employees.',
      },
    },
    totalHours: {
      type: Number,
      default: 0, // Total hours worked, applicable to all employees
    },
    uniqueKey: {
      type: String,
      unique: true,
      required: true,
      default: function () {
        return `EMP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`; // Generate a unique key
      },
    },
    // avatar: {
    //   public_id: {
    //     type: String,
    //     required: [true, 'Avatar public_id is required'],
    //   },
    //   url: {
    //     type: String,
    //     required: [true, 'Avatar URL is required'],
    //   },
    // },
    role: {
      type: String,
      default: 'user',
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Middleware for calculating totalSalary
employeeSchema.pre('save', function (next) {
  if (this.salaryBased) {
    // If salary-based, calculate total salary including overtime
    this.totalSalary = this.salary + this.overtime * (this.salary / 160) * 1.5; // Assuming 160 hours/month
  } else {
    // If hourly-based, calculate total salary using hourly wages and total hours
    this.totalSalary = this.hourlyWages * this.totalHours;
  }
  next();
});

// Create the Employee model
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
