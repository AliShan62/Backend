// const jwt = require('jsonwebtoken');

// // Middleware to verify JWT
// const authenticateJWT = (req, res, next) => {
//   // Get token from cookies
//   const token = req.cookies.authToken;

//   console.log(token)
//   // If no token is found, deny access
//   if (!token) {
//     return res.status(403).json({
//       message: 'Access denied. No token provided.',
//       success: false,
//     });
//   }

//   // Verify token
//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({
//         message: 'Invalid or expired token.',
//         success: false,
//       });
//     }
//     req.user = user; // Store the user data in request for future use
//    console.log(req.user)
//     next();
//   });
// };

// module.exports = authenticateJWT;

const Employee = require("../models/Employee");

const authMiddleware = async (req, res, next) => {
  try {
    const { uniqueKey } = req.query; // Get uniqueKey from request query

    // Validate input
    if (!uniqueKey) {
      return res.status(401).send({
        message: "❌ Unique Key is required.",
        success: false,
      });
    }

    // Find the employee using uniqueKey
    const employee = await Employee.findOne({ uniqueKey });

    // Check if employee exists
    if (!employee) {
      return res.status(401).send({
        message: "❌ Authentication failed. Invalid Unique Key.",
        success: false,
      });
    }

    // Attach employee details to the request
    req.user = {
      userId: employee._id,
      role: employee.role, // Assuming role is stored in the Employee model
    };

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(500).send({
      message: "❌ Internal Server Error.",
      success: false,
    });
  }
};

const isAdmin = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).send({
      success: false,
      message: "❌ Access denied. You are not an admin.",
    });
  }
};

module.exports = { authMiddleware, isAdmin };
