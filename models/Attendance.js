const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    uniqueKey: {
      type: String,
      required: [true, "❌ Unique Key is required."],
    },
    firstName: {
      type: String,
      required: [true, "❌ First Name is required."],
    },
    lastName: {
      type: String,
      required: [true, "❌ Last Name is required."],
    },
    branch: {
      type: String,
      required: [true, "❌ Branch is required."],
    },
    checkIn: {
      type: Date,
      default: null,
    },
    checkOut: {
      type: Date,
      default: null,
    },
    checkOutLatitude: {
      type: Number,
      default: null,
    },
    checkOutLongitude: {
      type: Number,
      default: null,
    },
    totalHours: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Success"],
      default: "Pending",
    },
    date: {
      type: String,
      required: [true, "❌ Date is required."],
      validate: {
        validator: function (value) {
          return /^\d{4}-\d{2}-\d{2}$/.test(value);
        },
        message: "❌ Date must be in the format YYYY-MM-DD.",
      },
    },
    checkInId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CheckIn",
      default: null, // ✅ Making it optional
    },

    locations: [
      {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// 🔹 Automatically calculates total hours before saving
attendanceSchema.pre("save", function (next) {
  if (this.checkIn && this.checkOut) {
    const diffInMs = this.checkOut - this.checkIn;
    this.totalHours = parseFloat((diffInMs / (1000 * 60 * 60)).toFixed(2));
  }
  next();
});

// ✅ Create the Attendance model
const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
