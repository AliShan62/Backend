
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



const JWT = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        const {uniqueKey, token} = req.query;
        
    //    console.log(uniqueKey, token)

        if (!token) {
            return res.status(401).send({
                message: 'Token missing',
                success: false,
            });
        }

        JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(401).send({
                    message: 'Auth Failed',
                    success: false,
                });
            } else {
                req.user = { userId: decode.id };
                next();
            }
        });
    } catch (error) {
        console.log(error);
        res.status(401).send({
            message: 'Auth Failed',
            success: false,
        });
    }
};

const isAdmin = async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send({
            success: false,
            message: 'Access denied. You are not an admin.',
        });
    }
};

module.exports = { authMiddleware, isAdmin };
