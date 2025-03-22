const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// const checkInController = async (req, res) => {
//     try {
//         const { employeeId } = req.body;

//         // Find existing attendance for the employee on the same day
//         let attendance = await Attendance.findOne({
//             employeeId,
//             date: new Date().toISOString().split('T')[0],  // Match only the date part
//         });

//         if (attendance) {
//             // Fetch employee details for the response
//             const employee = await Employee.findById(employeeId);

//             return res.json({
//                 message: 'Already checked in for today.',
//                 status: 'Success',
//                 employee,  // Include employee details
//             });
//         }

//         // If no check-in record, create a new one
//         attendance = new Attendance({
//             employeeId,
//             checkIn: new Date(),
//             status: 'Success',
//             date: new Date().toISOString().split('T')[0],  // Store only the date part
//         });

//         await attendance.save();

//         // Fetch employee details for the response
//         const employee = await Employee.findById(employeeId);

//         res.json({
//             message: 'Check-in successful',
//             status: 'Success',
//             attendance,
//             employee,  // Include employee details
//         });
//     } catch (error) {
//         // Log detailed error for development
//         console.error("Check-In Error:", error);

//         res.status(500).json({
//             message: 'An error occurred during check-in.',
//             success: false,
//         });
//     }
// };

const checkInController = async (req, res) => {
  try {
    const { uniqueKey } = req.body;

    // Validate input
    if (!uniqueKey) {
      return res.status(400).json({
        message: "❌ Unique Key is required.",
        success: false,
      });
    }

    // Find the employee by uniqueKey
    const employee = await Employee.findOne({ uniqueKey }).select(
      "firstName lastName branch uniqueKey"
    );

    if (!employee) {
      return res.status(404).json({
        message: "❌ Employee not found.",
        success: false,
      });
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Check if the employee has already checked in today
    const existingAttendance = await Attendance.findOne({
      uniqueKey,
      date: today,
    });

    if (existingAttendance) {
      return res.status(200).json({
        message: "✅ Already checked in for today.",
        success: true,
        attendance: existingAttendance, // Send existing record for reference
      });
    }

    // Create a new attendance record
    const newAttendance = new Attendance({
      uniqueKey,
      firstName: employee.firstName,
      lastName: employee.lastName,
      branch: employee.branch,
      checkIn: new Date(),
      status: "Pending", // Status remains "Pending" until check-out
      date: today,
    });

    await newAttendance.save();

    res.status(201).json({
      message: "✅ Check-in successful.",
      success: true,
      attendance: newAttendance, // Return the newly created attendance
    });
  } catch (error) {
    console.error("❌ Check-In Error:", error);
    res.status(500).json({
      message: "❌ An error occurred during check-in.",
      success: false,
      error: error.message,
    });
  }
};

// const checkOutController = async (req, res) => {
//     try {
//         const { employeeId } = req.body;

//         // Find today's check-in record
//         const attendance = await Attendance.findOne({
//             employeeId,
//             date: new Date().toISOString().split('T')[0],  // Match only the date part
//         });

//         // If no check-in record is found, respond with a message
//         if (!attendance || !attendance.checkIn) {
//             return res.status(400).json({
//                 message: 'No check-in record found for today.',
//                 status: 'Pending',
//             });
//         }

//         // If the employee has already checked out, respond with a message
//         if (attendance.checkOut !== 'Pending') {
//             return res.status(400).json({
//                 message: 'Already checked out for today.',
//                 status: 'Success',
//             });
//         }

//         // Update check-out time and calculate total hours worked
//         attendance.checkOut = new Date();
//         const hoursWorked = (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60);  // Convert milliseconds to hours
//         attendance.totalHours = hoursWorked;
//         attendance.status = 'Success'; // Update the status after check-out

//         // Save the updated attendance record to the database
//         await attendance.save();

//         // Fetch employee details for the response
//         const employee = await Employee.findById(employeeId);
//         // Send a successful response with the updated attendance record
//         res.status(200).json({
//             message: 'Check-out successful',
//             status: 'Success',
//             attendance,
//             employee
//         });
//     } catch (error) {
//         // Log detailed error for development
//         console.error("Check-Out Error:", error);

//         // Return a 500 status code if an error occurs
//         res.status(500).json({
//             message: 'An error occurred during check-out.',
//             success: false,
//         });
//     }
// };

const checkOutController = async (req, res) => {
  try {
    const { employeeId } = req.body;

    // Find today's attendance record
    const attendance = await Attendance.findOne({
      employeeId,
      date: new Date().toISOString().split("T")[0], // Match only the date part
    });

    // If no attendance record found
    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({
        message: "No check-in record found for today.",
        status: "Pending",
      });
    }

    // If the employee has already checked out
    if (attendance.checkOut !== "Pending") {
      return res.status(400).json({
        message: "Already checked out for today.",
        status: "Success",
      });
    }

    // Update check-out time and calculate total hours worked
    attendance.checkOut = new Date();
    const hoursWorked =
      (attendance.checkOut - new Date(attendance.checkIn)) / (1000 * 60 * 60); // Convert milliseconds to hours
    attendance.totalHours = hoursWorked;
    attendance.status = "Success"; // Update status after check-out

    // Save updated attendance record
    await attendance.save();

    // Fetch employee details
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found.",
        success: false,
      });
    }

    // Update the total hours in the employee profile
    employee.totalHours += hoursWorked;

    // Standard work hours (e.g., 8 hours/day)
    const standardWorkHours = 8;

    // Calculate overtime if applicable
    if (hoursWorked > standardWorkHours) {
      const overtimeHours = hoursWorked - standardWorkHours;

      // Calculate daily rate for salaried employees
      const dailyRate = employee.salaryBased ? employee.salary / 30 : 0;

      // Calculate overtime payment
      const overtimePayment = employee.salaryBased
        ? (dailyRate / standardWorkHours) * overtimeHours
        : employee.hourlyWages * overtimeHours;

      // Add overtime payment to totalSalary
      employee.totalSalary += overtimePayment;
    }

    // Recalculate total salary for hourly-based employees
    if (!employee.salaryBased) {
      employee.totalSalary = employee.hourlyWages * employee.totalHours;
    }

    // Save updated employee details
    await employee.save();

    // Respond with success
    res.status(200).json({
      message: "Check-out successful. Overtime calculated if applicable.",
      status: "Success",
      attendance,
      employee,
    });
  } catch (error) {
    // Log error details for debugging
    console.error("Check-Out Error:", error);

    // Respond with error message
    res.status(500).json({
      message: "An error occurred during check-out.",
      success: false,
    });
  }
};

const getAttendanceRecordsController = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Fetch attendance records for the employee
    const attendanceRecords = await Attendance.find({ employeeId });
    // Fetch employee details for the response
    const employee = await Employee.findById(employeeId);

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(404).json({
        message: "No attendance records found for this employee.",
        success: false,
      });
    }

    res.status(200).json({
      message: "Attendance records fetched successfully",
      success: true,
      attendanceRecords,
      employee,
    });
  } catch (error) {
    // Log detailed error for development
    console.error("Get Attendance Error:", error);

    res.status(500).json({
      message: "An error occurred while fetching attendance records.",
      success: false,
    });
  }
};

module.exports = {
  checkInController,
  checkOutController,
  getAttendanceRecordsController,
};
