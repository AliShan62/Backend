//const app = require('./app')
//const dotenv = require('dotenv')
//const colors = require('colors')
//const connectDatabase  = require('./database')
//const error = require('./middleware/error')
//const cloudinary = require("cloudinary");

// error handler for uncaughtException
//like "console.log(youtube.com)"
//process.on('uncaughtException', (error) => {
  //  console.log(`Error: ${error.message}`.yellow);
   // console.log('Server Shutdown due to uncaughtException '.yellow);
    //process.exit(1);
//})


//console.log(youtube.com)

//For give path of config.env file 
//dotenv.config({ path: "/.env" })



//app.get("/test", (req, res) => {
  //  res.send("Hello world from  server!");
  //});

//For Database Connection
//connectDatabase()


// Configure Cloudinary with your environment variables
//cloudinary.config({
  //  cloud_name: process.env.CLOUDINARY_NAME,
  //  api_key: process.env.CLOUDINARY_API_KEY,
    //api_secret: process.env.CLOUDINARY_API_SECRET,
 // });
 
  
<<<<<<< HEAD
//const server = app.listen(process.env.PORT||4001, () => {
  //  console.log(`Server Is running Successfully on Port Number:${process.env.PORT||4001}`.yellow)
//})
=======
const server = app.listen(process.env.PORT , () => {
    console.log(`Server Is running Successfully on Port Number:${process.env.PORT}`.yellow)
})
>>>>>>> origin/main


// // this is errorhandler to for unhandled promise Rejection
// //this error we get when Invalid String Of DB_URL
// process.on('unhandledRejection', (error) => {
//     console.log(`Error: ${error.message}`.red);
//     console.log('Server Shutdown due to unhandled promise Rejection'.yellow);
//     server.close(() => {
//         process.exit(1);
//     });
// });


const app = require('./app');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDatabase = require('./database');
const cloudinary = require('cloudinary');

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.log(`Error: ${error.message}`.yellow);
    console.log('Server shutting down due to uncaughtException'.yellow);
    process.exit(1);
});

// Load environment variables
dotenv.config();

// Test route
app.get("/test", (req, res) => {
    res.send("Hello world from server!");
});

// Connect to database
connectDatabase();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Start the server
const PORT = process.env.PORT || 9000;
const server = app.listen(PORT, () => {
    console.log(`Server is running successfully on port: ${PORT}`.yellow);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.log(`Error: ${error.message}`.red);
    console.log('Server shutting down due to unhandled promise rejection'.yellow);
    server.close(() => {
        process.exit(1);
    });
});
