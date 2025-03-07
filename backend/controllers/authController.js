const { default: axios } = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const MerchantAdd = require('../models/MerchantAdd');
const Shop = require('../models/Shop');

// Admin login function
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Log the incoming request for debugging purposes
    console.log('Admin login request:', { email });

    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log('Admin not found');
      return res.status(400).json({ message: 'Admin not found' });
    }

    // Compare the password with hashed password using bcrypt
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      console.log('Invalid credentials');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token for admin with a 1-hour expiration
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log('Admin login successful');
    return res.json({ success: true, token, role: 'admin', login_success: 'admin' });

  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


exports.merchantLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Merchant login request received:', { email, password });

    // Find merchant by email
    const merchant = await MerchantAdd.findOne({ pocEmail1: email.toLowerCase() });
    if (!merchant) {
      return res.status(400).json({ message: 'Merchant not found' });
    }

    // Temporarily removing the password hashing logic (direct comparison)
    if (merchant.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token for merchant with a 1-hour expiration
    const token = jwt.sign(
      { id: merchant._id, role: 'merchant' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return the response with token and role
    return res.json({
      success: true,
      token,
      login_success: 'merchant', // Add the login_success field
      role: 'merchant' // Add the role field
    });
  } catch (error) {
    console.error('Error during merchant login:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
