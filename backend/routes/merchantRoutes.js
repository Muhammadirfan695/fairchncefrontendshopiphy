// const express = require('express');
// const bcrypt = require('bcrypt');  // Import bcrypt for password comparison
// const jwt = require('jsonwebtoken');  // Import JWT for token generation
// const Admin = require('../models/Admin');  // Import your Admin model

// const router = express.Router();

// // Admin login route
// router.post('/login', async (req, res) => {
//   const { email, password, userType } = req.body;  // userType should map to role

//   console.log('Received data: ', req.body);

//   try {
//     // Find admin by email and role (userType)
//     const admin = await Admin.findOne({ email, role: userType });
//     console.log('Found admin: ', admin);

//     // Check if admin exists
//     if (!admin) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     console.log('Saved password:', admin.password);  // Check password from DB
//     console.log('Provided password:', password);  // Check entered password

//     // Compare password using bcrypt
//     const isMatch = await bcrypt.compare(password, admin.password);
//     console.log('Password match result:', isMatch);  // Log comparison result

//     // If password is incorrect
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Authentication successful, generate JWT token
//     const token = jwt.sign({ userId: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     return res.status(200).json({
//       message: 'Logged in successfully',
//       token,  // Send token back in response
//       admin: {
//         id: admin._id,
//         email: admin.email,
//         role: admin.role
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// module.exports = router;
