const mongoose = require("mongoose");

function generateUniqueKey() {
  return `EMP-${Math.floor(100 + Math.random() * 900)}`; // EMP-XXX
}

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
      validate: [require("validator").isEmail, "Please enter a valid email"],
    },
    avatar: {
      public_id: {
        type: String,
        required: [true, "Avatar public_id is required"],
      },
      url: { type: String, required: [true, "Avatar URL is required"] },
    },
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    geo: { type: Boolean, required: true },
    realTime: { type: Boolean, required: true },
    nfcQr: { type: Boolean, required: true },
    forceQr: { type: Boolean, required: true },
    branch: { type: String, trim: true },
    shift: { type: String, trim: true },
    totalHours: {
      type: Number,
      default: 0,
      min: [0, "Total hours cannot be negative"],
    },
    uniqueKey: {
      type: String,
      unique: true,
      required: true,
      default: generateUniqueKey,
    },
    role: { type: String, default: "user", enum: ["user", "admin", "manager"] },
  },
  { timestamps: true }
);

// Middleware to ensure uniqueKey is unique
employeeSchema.pre("save", async function (next) {
  let isUnique = false;
  while (!isUnique) {
    const newKey = generateUniqueKey();
    const existingEmployee = await mongoose
      .model("Employee")
      .findOne({ uniqueKey: newKey });
    if (!existingEmployee) {
      this.uniqueKey = newKey;
      isUnique = true;
    }
  }
  next();
});

// Create the Employee model
const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
