// backend/server.js

const express = require('express');
const dotenv = require('dotenv').config(); // Load environment variables
const connectDB = require('./db/database'); // Your MongoDB connection file
const cors = require('cors'); // For Cross-Origin Resource Sharing
const path = require('path'); // Node.js path module
const app = express(); // Initialize Express app

// --- Configuration ---
const port = process.env.PORT || 5500; // Use port from .env or default to 5500

// --- Database Connection ---
connectDB()
  .then(() => {
    console.log('MongoDB connection established successfully.');
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1); // Exit process with failure
  });
  // --- Middleware ---

// CORS setup: IMPORTANT for frontend communication in development
const allowedOrigins = [
    'http://localhost:5500', // Your backend's current actual URL
    'http://localhost:5501', // Your frontend's current actual URL
    'http://localhost:5173'  // Keep this in case your frontend setup changes or you switch to Vite's default
];

console.log('CORS allowedOrigins:', allowedOrigins); // <--- ADD THIS LINE

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies/authorization headers to be sent
}));


// Body parsers for incoming request data
app.use(express.json()); // Parses JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parses URL-encoded request bodies

// --- API Routes ---
app.use('/api/users', require('./routes/user'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/pipelines', require('./routes/pipelines'));

// --- Frontend Serving (for production deployment only) ---
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Backend API is running. Access frontend at http://localhost:5173' });
  });
}

// --- Global Error Handler Middleware ---
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  const statusCode = res.statusCode ? res.statusCode : 500; // Use existing status code or default to 500
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Don't send stack in production
  });
});

// --- Start Server ---
app.listen(port, () => console.log(`Server listening on port ${port}!`));