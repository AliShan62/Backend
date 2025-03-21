// const express = require('express');
// const app = express();
// const employeeRoute=require("./routers/employeeRoute")
// const companyRouter = require("./routers/companyRoutes");
// const AttendenceRoute = require("./routers/AttendenceRoute");
// const shiftRoutes = require('./routers/shiftRoute');
// const branchRoutes = require("./routers/BranchesRoutes");
// const ReportRoutes = require("./routers/ReportRoutes");
// const MiddlewareForIfElse = require('./middleware/error');

// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const fileUpload = require('express-fileupload');
// app.use(bodyParser.json({ limit: '1000mb' }));
// app.use(cookieParser());

// // Corrected cors middleware configuration
// const cors = require('cors');
// const Employee = require('./models/Employee');

// app.use(cors({
//     // origin: 'http://localhost:3000',
//     origin: ['http://localhost:3000','http://10.96.42.40:3000'],
//     credentials: true, // enable set cookie
// }));
// // Middleware for parsing JSON data in requests due to which we can access JSON data from req.body
// // Set limit because I am sending images from frontend
// app.use(express.json({ limit: '1000mb' }));

// // This is parent route for my employees
// app.use('/api/v1/employees', employeeRoute);

// // Parent route for empployees Attandence
// app.use('/api/v1/attendence',AttendenceRoute);

// // Parent route for company-related actions
// app.use('/company', companyRouter);

// // Shift routes
// app.use('/api/v1/shift',shiftRoutes);

// // Mount the branch routes at the `/api/v1/branches` prefix
// app.use('/api/v1/branches', branchRoutes);

// // Use the report routes for /api/reports endpoint
// app.use('/api/v1/reports', ReportRoutes);

// // Middleware to reduce if-else code in our application
// app.use(MiddlewareForIfElse);

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(fileUpload());

// module.exports = app;

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// Import Routes
const employeeRoute = require("./routers/employeeRoute");
const companyRouter = require("./routers/companyRoutes");
const AttendenceRoute = require("./routers/AttendenceRoute");
const shiftRoutes = require("./routers/shiftRoute");
const branchRoutes = require("./routers/BranchesRoutes");
const ReportRoutes = require("./routers/ReportRoutes");

// Middleware for error handling
const MiddlewareForIfElse = require("./middleware/error");

// CORS Configuration (Allow frontend origins)
app.use(
  cors({
    origin: [
      "http://65.0.199.177:9000",
      "http://localhost:3000",
      "http://10.96.42.40:3000",
      "http://localhost:5173",
      "http://192.168.138.148:5173",
      "http://192.168.138.158:5173",
    ], // Add frontend origins
    credentials: true, // Enable cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Middleware for parsing JSON and handling file uploads
app.use(express.json({ limit: "1000mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// Define Routes
app.use("/api/v1/employees", employeeRoute);
app.use("/api/v1/attendence", AttendenceRoute);
app.use("/company", companyRouter);
app.use("/api/v1/shift", shiftRoutes);
app.use("/api/v1/branches", branchRoutes);
app.use("/api/v1/reports", ReportRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});




// Error Handling Middleware
app.use(MiddlewareForIfElse);

module.exports = app;
