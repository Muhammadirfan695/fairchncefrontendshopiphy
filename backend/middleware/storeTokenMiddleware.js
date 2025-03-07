// const jwt = require('jsonwebtoken');
// const Merchant = require('../models/Merchant'); // Use Merchant model for token verification
// const Admin = require('../models/Admin'); // Use Admin model for token verification (add this model if not already present)

// const verifyToken = async (req, res, next) => {
//   let token;

//   // Check for token in headers
//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       // Get token from header
//       token = req.headers.authorization.split(' ')[1];

//       // Verify the token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // Check if the user is a merchant or admin
//       if (decoded.role === 'merchant') {
//         req.user = await Merchant.findById(decoded.id).select('-password');
//       } else if (decoded.role === 'admin') {
//         req.user = await Admin.findById(decoded.id).select('-password');
//       } else {
//         return res.status(401).json({ message: 'Invalid role' });
//       }

//       return next(); // Continue if valid token and role
//     } catch (error) {
//       return res.status(401).json({ message: 'Not authorized' });
//     }
//   }

//   if (!token) {
//     return res.status(401).json({ message: 'Not authorized, no token' });
//   }

//   return next(); // Allow the request to continue if token is verified
// };
