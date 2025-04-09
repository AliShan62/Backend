// const mongoose = require('mongoose');
// const validator = require('validator');

// // Helper function to validate and generate a 76-character API Key based on location
// const generateApiKey = (latitude, longitude) => {
//   // Location part if latitude and longitude are provided
//   const locationPart = latitude && longitude
//     ? `${latitude.toFixed(4)}-${longitude.toFixed(4)}-`
//     : '';

//   // Random alphanumeric part (10 characters)
//   const randomPart = Math.random().toString(36).substring(2, 12); // 10 random characters

//   // Generate the key to be exactly 76 characters long
//   const apiKey = `APIKEY-${locationPart}${randomPart}${Math.random().toString(36).substring(2, 15)}`;

//   // Ensure the key length is exactly 76 characters
//   return apiKey.length === 76 ? apiKey : apiKey.substring(0, 76);
// };

// // Define the schema for the company profile
// const companyProfileSchema = new mongoose.Schema({
//   businessName: {
//     type: String,
//     required: [true, 'Enter your business name'],
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: [true, 'Enter your email address'],
//     unique: true,
//     validate: {
//       validator: validator.isEmail,
//       message: 'Please enter a valid email address',
//     },
//   },
//   phone: {
//     type: String,
//     required: [true, 'Enter your phone number'],
//     match: [/^\+?\d{1,4}?\s?\(?\d*\)?\d{1,4}[\s\-]?\d{1,4}[\s\-]?\d{1,9}$/, 'Please enter a valid phone number'],
//   },
//   fax: {
//     type: String,
//     match: [/^\+?\d{1,4}?\s?\(?\d*\)?\d{1,4}[\s\-]?\d{1,4}[\s\-]?\d{1,9}$/, 'Please enter a valid fax number'],
//   },
//   username: {
//     type: String,
//     required: [true, 'Enter your username'],
//     unique: true,
//     trim: true,
//     minlength: [5, 'Username must be at least 5 characters long'],
//   },
//   password: {
//     type: String,
//     required: [true, 'Enter your password'],
//     minlength: [6, 'Password must be at least 6 characters long'],
//   },
//   companyImage: {
//     type: String,
//     match: [/^(http(s)?:\/\/)[\w-]+(\.[\w-]+)+([\w-./?%&=]*)$/, 'Please enter a valid URL for company image'],
//   },
//   qrCodeImage: {
//     type: String,
//     match: [/^(http(s)?:\/\/)[\w-]+(\.[\w-]+)+([\w-./?%&=]*)$/, 'Please enter a valid URL for QR code image'],
//   },
//   apiKey: {
//     type: String,
//   },
//   checkoutRange: {
//     type: String,
//     match: [/^\d{1,2}-\d{1,2}$/, 'Checkout range must be in format "min-max"'],
//   },
//   image: {
//     type: String,
//     match: [/^(http(s)?:\/\/)[\w-]+(\.[\w-]+)+([\w-./?%&=]*)$/, 'Please enter a valid URL for the image'],
//   },
//   resetTime: {
//     type: String,
//     match: [/^\d{2}:\d{2}$/, 'Please enter a valid reset time in format HH:MM'],
//   },
//   timeFormat: {
//     type: String,
//     enum: ['12', '24'],
//     default: '24',
//   },
//   verifyCheckout: {
//     type: Boolean,
//     default: false,
//   },
//   salaryEnable: {
//     type: Boolean,
//     default: false,
//   },
//   location: {
//     latitude: {
//       type: Number,
//       validate: {
//         validator: function (value) {
//           return value >= -90 && value <= 90; // Valid latitude range check
//         },
//         message: 'Latitude must be between -90 and 90',
//       },
//     },
//     longitude: {
//       type: Number,
//       validate: {
//         validator: function (value) {
//           return value >= -180 && value <= 180; // Valid longitude range check
//         },
//         message: 'Longitude must be between -180 and 180',
//       },
//     },
//   },
//   currentLocation: {
//     type: Boolean,
//     default: false,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Pre-save hook to generate the API key based on location
// companyProfileSchema.pre('save', function (next) {
//   if (!this.apiKey) {
//     const { latitude, longitude } = this.location || {};
//     this.apiKey = generateApiKey(latitude, longitude);
//   }
//   this.updatedAt = Date.now();
//   next();
// });

// // Create the model from the schema
// const CompanyProfile = mongoose.model('CompanyProfile', companyProfileSchema);

// module.exports = CompanyProfile;

const mongoose = require("mongoose");
const validator = require("validator");

// Helper function to validate and generate a 76-character API Key based on location
const generateApiKey = (latitude, longitude) => {
  // Location part if latitude and longitude are provided
  const locationPart =
    latitude && longitude
      ? `${latitude.toFixed(4)}-${longitude.toFixed(4)}-`
      : "";

  // Random alphanumeric part (10 characters)
  const randomPart = Math.random().toString(36).substring(2, 12); // 10 random characters

  // Generate the key to be exactly 76 characters long
  const apiKey = `APIKEY-${locationPart}${randomPart}${Math.random()
    .toString(36)
    .substring(2, 15)}`;

  // Ensure the key length is exactly 76 characters
  return apiKey.length === 76 ? apiKey : apiKey.substring(0, 76);
};

// Define the schema for the company profile
const companyProfileSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: [true, "Enter your business name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Enter your email address"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please enter a valid email address",
    },
  },
  phone: {
    type: String,
    required: [true, "Enter your phone number"],
    match: [
      /^\+?\d{1,4}?\s?\(?\d*\)?\d{1,4}[\s\-]?\d{1,4}[\s\-]?\d{1,9}$/,
      "Please enter a valid phone number",
    ],
  },
  fax: {
    type: String,
    match: [
      /^\+?\d{1,4}?\s?\(?\d*\)?\d{1,4}[\s\-]?\d{1,4}[\s\-]?\d{1,9}$/,
      "Please enter a valid fax number",
    ],
  },
  username: {
    type: String,
    required: [true, "Enter your username"],
    unique: true,
    trim: true,
    minlength: [5, "Username must be at least 5 characters long"],
  },
  password: {
    type: String,
    required: [true, "Enter your password"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  companyImage: {
    type: String,
    match: [
      /^(http(s)?:\/\/)[\w-]+(\.[\w-]+)+([\w-./?%&=]*)$/,
      "Please enter a valid URL for company image",
    ],
  },
  qrCodeImage: {
    type: String,
    match: [
      /^(http(s)?:\/\/)[\w-]+(\.[\w-]+)+([\w-./?%&=]*)$/,
      "Please enter a valid URL for QR code image",
    ],
  },
  apiKey: {
    type: String,
  },
  checkoutRange: {
    type: String,
    match: [/^\d{1,2}-\d{1,2}$/, 'Checkout range must be in format "min-max"'],
  },
  image: {
    type: String,
    match: [
      /^(http(s)?:\/\/)[\w-]+(\.[\w-]+)+([\w-./?%&=]*)$/,
      "Please enter a valid URL for the image",
    ],
  },
  resetTime: {
    type: String,
    match: [/^\d{2}:\d{2}$/, "Please enter a valid reset time in format HH:MM"],
  },
  timeFormat: {
    type: String,
    enum: ["12", "24"],
    default: "24",
  },
  verifyCheckout: {
    type: Boolean,
    default: false,
  },
  salaryEnable: {
    type: Boolean,
    default: false,
  },
  location: {
    latitude: {
      type: Number,
      validate: {
        validator: function (value) {
          return value >= -90 && value <= 90; // Valid latitude range check
        },
        message: "Latitude must be between -90 and 90",
      },
    },
    longitude: {
      type: Number,
      validate: {
        validator: function (value) {
          return value >= -180 && value <= 180; // Valid longitude range check
        },
        message: "Longitude must be between -180 and 180",
      },
    },
  },
  currentLocation: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

  // Added fields for Password Reset functionality
  resetPasswordCode: {
    type: String, // Code to verify the user during reset
  },
  resetPasswordExpires: {
    type: Date, // Expiration time for the reset code
  },
});

// Pre-save hook to generate the API key based on location
companyProfileSchema.pre("save", function (next) {
  if (!this.apiKey) {
    const { latitude, longitude } = this.location || {};
    this.apiKey = generateApiKey(latitude, longitude);
  }
  this.updatedAt = Date.now();
  next();
});

// Add method to generate reset code and expiration date
companyProfileSchema.methods.generateResetCode = function () {
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit random code
  const expires = Date.now() + 15 * 60 * 1000; // Expires in 15 minutes
  this.resetPasswordCode = resetCode;
  this.resetPasswordExpires = expires;
  return resetCode;
};

// Create the model from the schema
const CompanyProfile = mongoose.model("CompanyProfile", companyProfileSchema);

module.exports = CompanyProfile;
