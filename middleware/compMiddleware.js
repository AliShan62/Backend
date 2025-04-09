const jwt = require("jsonwebtoken");

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Retrieve token from cookies

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded data (companyId) to the request object
    req.companyId = decoded.companyId;
    next(); // Call the next middleware/route handler
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = authenticateToken;
