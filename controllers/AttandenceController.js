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

// const checkInController = async (req, res) => {
//   try {
//     console.log("Received Query Params:", req.query); // Debugging log

//     let { uniqueKey, latitude, longitude } = req.query; // Extract from query params

//     if (!uniqueKey) {
//       return res.status(400).json({
//         message: "Unique Key is required.",
//         success: false,
//       });
//     }

//     latitude = parseFloat(latitude);
//     longitude = parseFloat(longitude);

//     if (isNaN(latitude) || isNaN(longitude)) {
//       return res.status(400).json({
//         message: "Latitude and Longitude must be valid numbers.",
//         success: false,
//       });
//     }

//     if (
//       latitude < -90 ||
//       latitude > 90 ||
//       longitude < -180 ||
//       longitude > 180
//     ) {
//       return res.status(400).json({
//         message:
//           "Latitude must be between -90 and 90, and Longitude between -180 and 180.",
//         success: false,
//       });
//     }

//     console.log("Checking Employee Record...");
//     const employee = await Employee.findOne(
//       { uniqueKey },
//       "firstName lastName branch"
//     );

//     if (!employee) {
//       return res.status(404).json({
//         message: "Employee not found.",
//         success: false,
//       });
//     }

//     const todayDate = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)

//     console.log("Creating New Attendance Record...");
//     const newAttendance = new Attendance({
//       uniqueKey,
//       firstName: employee.firstName,
//       lastName: employee.lastName,
//       branch: employee.branch,
//       checkIn: new Date(),
//       checkOut: "Pending",
//       status: "Pending",
//       date: todayDate,
//       latitude,
//       longitude,
//     });

//     await newAttendance.save();

//     console.log("Check-in Successful!");
//     res.status(201).json({
//       message: "Check-in successful.",
//       success: true,
//     });
//   } catch (error) {
//     console.error("Check-In Error:", error);
//     res.status(500).json({
//       message: "An error occurred during check-in.",
//       success: false,
//     });
//   }
// };

// const checkInController = async (req, res) => {
//   try {
//     console.log("Received Query Params:", req.query);

//     let { uniqueKey } = req.query;

//     if (!uniqueKey) {
//       return res.status(400).json({
//         message: "Unique Key is required.",
//         success: false,
//       });
//     }
//     const employee = await Employee.findOne(
//       { uniqueKey },
//       "firstName lastName branch"
//     );

//     if (!employee) {
//       return res.status(404).json({
//         message: "Employee not found.",
//         success: false,
//       });
//     }

//     const todayDate = new Date().toISOString().split("T")[0];

//     console.log("Creating New Attendance Record...");
//     const newAttendance = new Attendance({
//       uniqueKey,
//       firstName: employee.firstName,
//       lastName: employee.lastName,
//       branch: employee.branch,
//       checkIn: Date.now(),
//       checkOut: null,
//       status: "Pending",
//       date: todayDate,
//       checkInLatitude: latitude,
//       checkInLongitude: longitude,
//     });

//     await newAttendance.save();

//     console.log("Check-in Successful!");
//     res.status(201).json({
//       message: "Check-in successful.",
//       success: true,
//       // data: {
//       //   uniqueKey,
//       //   firstName: employee.firstName,
//       //   lastName: employee.lastName,
//       //   branch: employee.branch,
//       //   checkIn: newAttendance.checkIn,
//       //   checkInLatitude: latitude,
//       //   checkInLongitude: longitude,
//       //   status: "Pending",
//       //   date: todayDate,
//       // },
//     });
//   } catch (error) {
//     console.error("Check-In Error:", error);
//     res.status(500).json({
//       message: "An error occurred during check-in.",
//       success: false,
//       error: error.message,
//     });
//   }
// };

// const checkInController = async (req, res) => {
//   try {
//     console.log("Received Query Params:", req.query);

//     let { uniqueKey } = req.query; // ✅ Extract from req.query

//     if (!uniqueKey) {
//       return res.status(400).json({
//         message: "Unique Key is required.",
//         success: false,
//       });
//     }

//     const employee = await Employee.findOne(
//       { uniqueKey },
//       "firstName lastName branch"
//     );

//     if (!employee) {
//       return res.status(404).json({
//         message: "Employee not found.",
//         success: false,
//       });
//     }

//     console.log("Checking if already checked in...");
//     let existingAttendance = await Attendance.findOne({
//       uniqueKey,
//       checkOut: null, // ✅ Ensure check-out is not already done
//     });

//     if (existingAttendance) {
//       return res.status(400).json({
//         message: "Employee has already checked in.",
//         success: false,
//         checkInId: existingAttendance._id, // ✅ Return existing check-in ID
//       });
//     }

//     console.log("Creating New Attendance Record...");
//     const todayDate = new Date().toISOString().split("T")[0];

//     const newAttendance = new Attendance({
//       uniqueKey,
//       firstName: employee.firstName,
//       lastName: employee.lastName,
//       branch: employee.branch,
//       checkIn: Date.now(),
//       checkOut: null,
//       status: "Pending",
//       date: todayDate,
//     });

//     await newAttendance.save();

//     console.log("Check-in Successful!");
//     res.status(201).json({
//       message: "Check-in successful.",
//       success: true,
//       checkInId: newAttendance._id, // ✅ Return unique check-in ID
//     });
//   } catch (error) {
//     console.error("Check-In Error:", error);
//     res.status(500).json({
//       message: "An error occurred during check-in.",
//       success: false,
//       error: error.message,
//     });
//   }
// };

const checkInController = async (req, res) => {
  try {
    console.log("Received Query Params:", req.query);

    let { uniqueKey } = req.query; // ✅ Extract from req.query

    if (!uniqueKey) {
      return res.status(400).json({
        message: "Unique Key is required.",
        success: false,
      });
    }

    const employee = await Employee.findOne(
      { uniqueKey },
      "firstName lastName branch"
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found.",
        success: false,
      });
    }

    console.log("Creating New Attendance Record...");
    const todayDate = new Date().toISOString().split("T")[0];

    const newAttendance = new Attendance({
      uniqueKey,
      firstName: employee.firstName,
      lastName: employee.lastName,
      branch: employee.branch,
      checkIn: Date.now(),
      checkOut: null,
      status: "Pending",
      date: todayDate,
    });

    await newAttendance.save();

    console.log("Check-in Successful!");
    res.status(201).json({
      message: "Check-in successful.",
      success: true,
      checkInId: newAttendance._id, // ✅ Return unique check-in ID
    });
  } catch (error) {
    console.error("Check-In Error:", error);
    res.status(500).json({
      message: "An error occurred during check-in.",
      success: false,
      error: error.message,
    });
  }
};

// const GetCurrentLocation = async (req, res) => {
//   try {
//     console.log("Received Query Params:", req.query);

//     let { uniqueKey, latitude, longitude } = req.query;

//     if (!uniqueKey) {
//       return res.status(400).json({
//         message: "Unique Key is required.",
//         success: false,
//       });
//     }

//     latitude = parseFloat(latitude);
//     longitude = parseFloat(longitude);

//     if (isNaN(latitude) || isNaN(longitude)) {
//       return res.status(400).json({
//         message: "Latitude and Longitude must be valid numbers.",
//         success: false,
//       });
//     }

//     if (
//       latitude < -90 ||
//       latitude > 90 ||
//       longitude < -180 ||
//       longitude > 180
//     ) {
//       return res.status(400).json({
//         message:
//           "Latitude must be between -90 and 90, and Longitude between -180 and 180.",
//         success: false,
//       });
//     }

//     console.log("Checking Employee Record...");
//     const employee = await Employee.findOne(
//       { uniqueKey },
//       "firstName lastName branch"
//     );

//     if (!employee) {
//       return res.status(404).json({
//         message: "Employee not found.",
//         success: false,
//       });
//     }

//     const todayDate = new Date().toISOString().split("T")[0];

//     console.log("Creating New Attendance Record...");
//     const newAttendance = new Attendance({
//       uniqueKey,
//       firstName: employee.firstName,
//       lastName: employee.lastName,
//       branch: employee.branch,
//       checkIn: Date.now(),
//       checkOut: null,
//       status: "Pending",
//       date: todayDate,
//       checkInLatitude: latitude,
//       checkInLongitude: longitude,
//     });

//     await newAttendance.save();

//     console.log(" Current Get Successful!");
//     res.status(201).json({
//       message: "Current Get Successful!.",
//       success: true,
//       // data: {
//       //   uniqueKey,
//       //   firstName: employee.firstName,
//       //   lastName: employee.lastName,
//       //   branch: employee.branch,
//       //   checkIn: newAttendance.checkIn,
//       //   checkInLatitude: latitude,
//       //   checkInLongitude: longitude,
//       //   status: "Pending",
//       //   date: todayDate,
//       // },
//     });
//   } catch (error) {
//     console.error("Current Location Error:", error);
//     res.status(500).json({
//       message: "An error occurred during current location.",
//       success: false,
//       error: error.message,
//     });
//   }
// };

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

// const checkOutController = async (req, res) => {
//   try {
//     console.log("Received Query Params:", req.query); // Debugging log

//     const { uniqueKey } = req.query; // Extract uniqueKey from query parameters

//     if (!uniqueKey) {
//       return res.status(400).json({
//         message: "Unique Key is required.",
//         success: false,
//       });
//     }

//     console.log("Checking Attendance Record...");
//     const todayDate = new Date().toISOString().split("T")[0];

//     const attendance = await Attendance.findOne({
//       uniqueKey,
//       date: todayDate,
//     });

//     if (!attendance) {
//       return res.status(404).json({
//         message: "No check-in record found for today.",
//         success: false,
//       });
//     }

//     if (attendance.checkOut !== "Pending") {
//       return res.status(400).json({
//         message: "You have already checked out today.",
//         success: false,
//       });
//     }

//     console.log("Updating Attendance Record...");
//     attendance.checkOut = new Date();
//     attendance.totalHours =
//       (attendance.checkOut - new Date(attendance.checkIn)) / (1000 * 60 * 60);
//     attendance.status = "Success";

//     await attendance.save();

//     console.log("Check-out Successful!");
//     res.status(200).json({
//       message: "Check-out successful.",
//       success: true,
//     });
//   } catch (error) {
//     console.error("Check-Out Error:", error);
//     res.status(500).json({
//       message: "An error occurred during check-out.",
//       success: false,
//     });
//   }
// };

// const checkOutController = async (req, res) => {
//   try {
//     console.log("Received Query Params:", req.query); // Debugging log

//     let { uniqueKey, latitude, longitude } = req.query;

//     if (!uniqueKey) {
//       return res.status(400).json({
//         message: "Unique Key is required.",
//         success: false,
//       });
//     }

//     latitude = parseFloat(latitude);
//     longitude = parseFloat(longitude);

//     if (isNaN(latitude) || isNaN(longitude)) {
//       return res.status(400).json({
//         message: "Latitude and Longitude must be valid numbers.",
//         success: false,
//       });
//     }

//     if (
//       latitude < -90 ||
//       latitude > 90 ||
//       longitude < -180 ||
//       longitude > 180
//     ) {
//       return res.status(400).json({
//         message:
//           "Latitude must be between -90 and 90, and Longitude between -180 and 180.",
//         success: false,
//       });
//     }

//     console.log("Checking Attendance Record...");
//     const todayDate = new Date().toISOString().split("T")[0];

//     const attendance = await Attendance.findOne({
//       uniqueKey,
//       date: todayDate,
//     });

//     if (!attendance) {
//       return res.status(404).json({
//         message: "No check-in record found for today.",
//         success: false,
//       });
//     }

//     console.log("Updating Attendance Record...");
//     attendance.checkOut = new Date();
//     attendance.checkOutLatitude = latitude; // Save check-out latitude
//     attendance.checkOutLongitude = longitude; // Save check-out longitude
//     attendance.totalHours = (
//       (attendance.checkOut - new Date(attendance.checkIn)) /
//       (1000 * 60 * 60)
//     ).toFixed(2);
//     attendance.status = "Success";

//     await attendance.save();

//     console.log("Check-out Successful!");
//     res.status(200).json({
//       message: "Check-out successful.",
//       success: true,
//       // data: {
//       //   uniqueKey,
//       //   checkIn: attendance.checkIn,
//       //   checkOut: attendance.checkOut,
//       //   checkInLatitude: attendance.checkInLatitude, // Ensure check-in latitude is preserved
//       //   checkInLongitude: attendance.checkInLongitude, // Ensure check-in longitude is preserved
//       //   checkOutLatitude: attendance.checkOutLatitude, // Save separate check-out latitude
//       //   checkOutLongitude: attendance.checkOutLongitude, // Save separate check-out longitude
//       //   totalHours: attendance.totalHours,
//       // },
//     });
//   } catch (error) {
//     console.error("Check-Out Error:", error);
//     res.status(500).json({
//       message: "An error occurred during check-out.",
//       success: false,
//     });
//   }
// };

const GetCurrentLocation = async (req, res) => {
  try {
    console.log("Received Query Params:", req.query);

    let { uniqueKey, latitude, longitude } = req.query;

    // ✅ Validate required fields
    if (!uniqueKey) {
      return res.status(400).json({
        message: "❌ Unique Key is required.",
        success: false,
      });
    }

    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);

    // ✅ Validate latitude and longitude values
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        message: "❌ Latitude and Longitude must be valid numbers.",
        success: false,
      });
    }

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        message:
          "❌ Latitude must be between -90 and 90, and Longitude between -180 and 180.",
        success: false,
      });
    }

    console.log("🔍 Checking Employee Record...");
    const employee = await Employee.findOne({ uniqueKey }).lean(); // ✅ Use lean() for performance

    if (!employee) {
      return res.status(404).json({
        message: "❌ Employee not found.",
        success: false,
      });
    }

    console.log("🔍 Checking Existing Attendance...");
    let existingAttendance = await Attendance.findOne({ uniqueKey });

    // If no existing attendance record for the employee, create a new one
    if (!existingAttendance) {
      existingAttendance = new Attendance({
        uniqueKey,
        locations: [],
      });
    }

    console.log("📍 Updating Employee Location...");

    // ✅ Ensure locations array exists before pushing new data
    if (!Array.isArray(existingAttendance.locations)) {
      existingAttendance.locations = [];
    }

    // Push new location data
    existingAttendance.locations.push({
      latitude,
      longitude,
      timestamp: new Date(),
    });

    await existingAttendance.save();

    console.log("✅ Location Updated Successfully!");
    res.status(200).json({
      message: "✅ Location updated successfully.",
      success: true,
      // data: {
      //   uniqueKey,
      //   firstName: employee.firstName,
      //   lastName: employee.lastName,
      //   branch: employee.branch,
      //   latestLocation: {
      //     latitude,
      //     longitude,
      //   },
      //   locations: existingAttendance.locations, // ✅ Return all stored locations
      // },
    });
  } catch (error) {
    console.error("❌ Current Location Error:", error);
    res.status(500).json({
      message: "❌ An error occurred while updating location.",
      success: false,
      error: error.message,
    });
  }
};

const checkOutController = async (req, res) => {
  try {
    console.log("Received Query Params:", req.query); // Debugging log

    let { checkInId, uniqueKey, latitude, longitude } = req.query;

    if (!checkInId && !uniqueKey) {
      return res.status(400).json({
        message: "Either Check-In ID or Unique Key is required.",
        success: false,
      });
    }

    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        message: "Latitude and Longitude must be valid numbers.",
        success: false,
      });
    }

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        message:
          "Latitude must be between -90 and 90, and Longitude between -180 and 180.",
        success: false,
      });
    }

    console.log("Checking Attendance Record...");
    let attendance;

    if (checkInId) {
      attendance = await Attendance.findById(checkInId);
    } else {
      const todayDate = new Date().toISOString().split("T")[0];
      attendance = await Attendance.findOne({ uniqueKey, date: todayDate });
    }

    if (!attendance) {
      return res.status(404).json({
        message: "No matching check-in record found.",
        success: false,
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        message: "Employee has already checked out.",
        success: false,
        checkOutTime: attendance.checkOut,
      });
    }

    console.log("Updating Attendance Record...");
    attendance.checkOut = new Date();
    attendance.checkOutLatitude = latitude;
    attendance.checkOutLongitude = longitude;
    attendance.totalHours = (
      (attendance.checkOut - new Date(attendance.checkIn)) /
      (1000 * 60 * 60)
    ).toFixed(2);
    attendance.status = "Success";

    await attendance.save();

    console.log("✅ Check-out Successful!");
    res.status(200).json({
      message: "Check-out successful.",
      success: true,
      // checkInId: attendance._id,
      // uniqueKey: attendance.uniqueKey,
      // checkIn: attendance.checkIn,
      // checkOut: attendance.checkOut,
      // checkInLatitude: attendance.checkInLatitude,
      // checkInLongitude: attendance.checkInLongitude,
      // checkOutLatitude: attendance.checkOutLatitude,
      // checkOutLongitude: attendance.checkOutLongitude,
      // totalHours: attendance.totalHours,
    });
  } catch (error) {
    console.error("❌ Check-Out Error:", error);
    res.status(500).json({
      message: "An error occurred during check-out.",
      success: false,
      error: error.message,
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
  GetCurrentLocation,
  checkOutController,
  getAttendanceRecordsController,
};
