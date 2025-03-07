
const jwt = require('jsonwebtoken');

const User = require('../schemas/User');

const MerchantAdd = require('../models/MerchantAdd');
// const User = require('../models/User'); 

const Merchant = require('../models/Merchant'); // Merchant model for token verification
const Admin = require('../models/Admin'); // Admin model for token verification

const verifyToken = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role === 'merchant') {
        req.user = await MerchantAdd.findById(decoded.id).select('-password'); // Updated to MerchantAdd
      } else if (decoded.role === 'admin') {
        req.user = await Admin.findById(decoded.id).select('-password');
      } else {
        return res.status(401).json({ message: 'Invalid role' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  return next();
};





const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
   return next();  // Admin access granted
  } 
    return res.status(403).json({ message: 'Not authorized as admin' });
  
};

module.exports = { verifyToken, admin };
