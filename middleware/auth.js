const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const CompanyProfile = require("../models/CompanyProfile");

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.Token;

  if (!token) {
    return res.status(401).json({ error:"Please login to continue!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.companyProfile = await CompanyProfile.findById(decoded.companyId);

    if (!req.companyProfile) {
      return res.status(404).json({ error:"Company profile not found!" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error:"Invalid or expired token. Please login again!" }
    );
  }
});
