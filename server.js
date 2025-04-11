const app = require('./app')
const dotenv = require('dotenv')
const colors = require('colors')
const connectDatabase  = require('./database')
const error = require('./middleware/error')
const cloudinary = require("cloudinary");

// error handler for uncaughtException
//like "console.log(youtube.com)"
process.on('uncaughtException', (error) => {
    console.log(`Error: ${error.message}`.yellow);
    console.log('Server Shutdown due to uncaughtException '.yellow);
    process.exit(1);
})


//console.log(youtube.com)

//For give path of config.env file 
dotenv.config({ path: "/.env" })



app.get("/test", (req, res) => {
    res.send("Hello world from  server!");
  });

//For Database Connection
connectDatabase()


// Configure Cloudinary with your environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
 
  
const server = app.listen(process.env.PORT , () => {
    console.log(`Server Is running Successfully on Port Number:${process.env.PORT}`.yellow)
})


// // this is errorhandler to for unhandled promise Rejection
// //this error we get when Invalid String Of DB_URL
// process.on('unhandledRejection', (error) => {
//     console.log(`Error: ${error.message}`.red);
//     console.log('Server Shutdown due to unhandled promise Rejection'.yellow);
//     server.close(() => {
//         process.exit(1);
//     });
// });
