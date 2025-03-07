// const cors = require('cors');

// const allowedOrigins = [
//   'http://35.180.255.171', 
// ];

// const corsMiddleware = cors({
//   origin: (origin, callback) => {
//     // Check if the request origin is in allowed origins
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);  // Allow the request
//     } else {
//       callback(new Error('Not allowed by CORS'));  // Block the request
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow HTTP methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
//   credentials: true, // Allow cookies/auth credentials
// });

// module.exports = corsMiddleware;
