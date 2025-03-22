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

const JWT = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer Token
    const { uniqueKey } = req.body; // Extract uniqueKey from body

    console.log("Token received:", req.headers.authorization);

    if (!token) {
      return res.status(401).send({
        message: "Token missing",
        success: false,
      });
    }

    JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Auth Failed",
          success: false,
        });
      } else {
        req.user = { userId: decoded.id, role: decoded.role }; // Store user details
        next();
      }
    });
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).send({
      message: "Auth Failed",
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
      message: "Access denied. You are not an admin.",
    });
  }
};

module.exports = { authMiddleware, isAdmin };
