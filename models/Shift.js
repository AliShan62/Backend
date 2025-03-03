const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema(
  {
    shiftName: {
      type: String,
      required: true,
      unique: true, // Ensures each shift name is unique
    },
    daysOfWeek: {
      type: Map,
      of: new mongoose.Schema(
        {
          dayOff: { type: Boolean, default: false },
          attendanceStart: { type: String, default: null },
          attendanceEnd: { type: String, default: null },
          noBreak: { type: Boolean, default: false },
          breakStart: { type: String, default: null },
          breakEnd: { type: String, default: null },
        },
        { _id: false }
      ),
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Shift = mongoose.model('Shift', shiftSchema);

module.exports = Shift;
