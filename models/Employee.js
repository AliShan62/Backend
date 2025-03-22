const mongoose = require("mongoose");
const validator = require("validator");

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
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    uniqueKey: {
      type: String,
      unique: true,
      required: true,
    },
    avatar: {
      public_id: {
        type: String,
        default: null,
      },
      url: {
        type: String,
        default: null,
      },
    },
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    geo: { type: Boolean, required: true },
    realTime: { typee: Boolean, required: true },
    nfcQr: { type: Boolean, required: true },
    forceQr: { type: Boolean, required: true },
    branch: { type: String, trim: true },
    shift: { type: String, trim: true },
    joiningDate: { type: Date, default: Date.now },
    totalHours: {
      type: Number,
      default: 0,
      min: [0, "Total hours cannot be negative"],
    },
    role: { type: String, default: "user", enum: ["user", "admin", "manager"] },
  },
  { timestamps: true }
);

// Generate uniqueKey before saving the employee
employeeSchema.pre("save", async function (next) {
  if (!this.uniqueKey) {
    const count = await mongoose.model("Employee").countDocuments();
    this.uniqueKey = `EPM-${1000 + count + 1}`;
  }
  next();
});

// Create the Employee model
const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
