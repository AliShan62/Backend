// const mongoose = require("mongoose");
// const validator = require("validator");

// // Define the employee schema
// const employeeSchema = new mongoose.Schema(
//   {
//     firstName: {
//       type: String,
//       required: [true, "Enter the first name"],
//       minLength: [2, "First name should have at least 2 characters"],
//       maxLength: [30, "First name should not exceed 30 characters"],
//     },
//     lastName: {
//       type: String,
//       required: [true, "Enter the last name"],
//       minLength: [2, "Last name should have at least 2 characters"],
//       maxLength: [30, "Last name should not exceed 30 characters"],
//     },
//     phoneNumber: {
//       type: String,
//       required: [true, "Enter the phone number"],
//     },
//     avatar: {
//       public_id: {
//         type: String,
//         required: [true, "Avatar public_id is required"], // Required
//       },
//       url: {
//         type: String,
//         required: [true, "Avatar URL is required"], // Required
//       },
//     },
//     geo: {
//       type: Boolean,
//       required: [true, "Geo feature is required"], // Required
//       default: false,
//     },
//     realTime: {
//       type: Boolean,
//       required: [true, "Real-time feature is required"], // Required
//       default: false,
//     },
//     nfcQr: {
//       type: Boolean,
//       required: [true, "NFC/QR feature is required"], // Required
//       default: false,
//     },
//     forceQr: {
//       type: Boolean,
//       required: [true, "Force QR feature is required"], // Required
//       default: false,
//     },
//     branch: {
//       type: String,
//       required: [false, "Enter the branch"], // Optional
//     },
//     shift: {
//       type: String,
//       required: [false, "Enter the shift"], // Optional
//     },
//     hourlyWages: {
//       type: Number,
//       required: function () {
//         return this.salaryBased === false;
//       },
//       validate: {
//         validator: function (value) {
//           return this.salaryBased === false ? value > 0 : true;
//         },
//         message: "Hourly wages should be greater than 0 when not salary-based",
//       },
//     },
//     salary: {
//       type: Number,
//       required: function () {
//         return this.salaryBased === true;
//       },
//       validate: {
//         validator: function (value) {
//           return this.salaryBased === true ? value > 0 : true;
//         },
//         message: "Salary should be greater than 0 when salary-based",
//       },
//     },
//     salaryBased: {
//       type: Boolean,
//       required: [false, "Specify if the employee is salary-based"], // Optional
//     },
//     totalSalary: {
//       type: Number,
//       default: 0,
//     },
//     overtime: {
//       type: Number,
//       default: 0,
//       validate: {
//         validator: function (value) {
//           return this.salaryBased ? value >= 0 : value === 0;
//         },
//         message: "Overtime is only applicable for salary-based employees.",
//       },
//     },
//     totalHours: {
//       type: Number,
//       default: 0, // Total hours worked, applicable to all employees
//     },
//     uniqueKey: {
//       type: String,
//       unique: true,
//       required: true,
//       default: function () {
//         return `EMP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`; // Generate a unique key
//       },
//     },
//     role: {
//       type: String,
//       default: "user", // Optional
//     },
//     activationCode: {
//       type: String,
//       required: true,
//       default: function () {
//         return `ACT-${Math.floor(1000 + Math.random() * 9000)}`; // Generate an activation code
//       },
//     },
//   },
//   { timestamps: true } // Automatically adds createdAt and updatedAt fields
// );

// // Middleware for calculating totalSalary
// employeeSchema.pre("save", function (next) {
//   if (this.salaryBased) {
//     // If salary-based, calculate total salary including overtime
//     this.totalSalary = this.salary + this.overtime * (this.salary / 160) * 1.5; // Assuming 160 hours/month
//   } else {
//     // If hourly-based, calculate total salary using hourly wages and total hours
//     this.totalSalary = this.hourlyWages * this.totalHours;
//   }
//   next();
// });

// // Create the Employee model
// const Employee = mongoose.model("Employee", employeeSchema);

// module.exports = Employee;
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/, // Simple phone number validation (10 digits)
    },
    avatar: {
      type: String, // This can store the URL/path of the uploaded avatar image
      default: null,
    },
    code: {
      type: String,
      required: true,
      default: `ACT-${Math.floor(1000 + Math.random() * 9000)}`, // Unique activation code
    },
    geo: {
      type: Boolean,
      default: false,
    },
    realTime: {
      type: Boolean,
      default: false,
    },
    nfcQr: {
      type: Boolean,
      default: false,
    },
    forceQr: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  }
);

module.exports = mongoose.model("Employee", employeeSchema);
