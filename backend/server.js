require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const postexRoutes = require('./routes/postexRoutes');
const authRoutes = require('./routes/auth');
const shopifyInstall = require('./routes/shopify/install');
const shopifyCallback = require('./routes/shopify/callback');  // ✅ Add callback route

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/postex', postexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/shopify/callback', shopifyCallback);  // ✅ Ensure callback route is working
app.use('/api/shopify/install', shopifyInstall);   // ✅ Shopify Install Route

// Catch-all error handler
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Error handler middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message || 'Server Error',
    stack: error.stack,
  });
});

// Start server after MongoDB connection
connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  });
