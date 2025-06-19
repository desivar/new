const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database-name';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Simple Mongoose Schemas (adjust fields as needed)
const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
const customerSchema = new mongoose.Schema({}, { strict: false, collection: 'customers' });
const jobSchema = new mongoose.Schema({}, { strict: false, collection: 'jobs' });
const pipelineSchema = new mongoose.Schema({}, { strict: false, collection: 'pipelines' });

// Models
const User = mongoose.model('User', userSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Job = mongoose.model('Job', jobSchema);
const Pipeline = mongoose.model('Pipeline', pipelineSchema);

// Routes - Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Routes - Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Routes - Get all jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Routes - Get all pipelines
app.get('/api/pipelines', async (req, res) => {
  try {
    const pipelines = await Pipeline.find({});
    res.json(pipelines);
  } catch (error) {
    console.error('Error fetching pipelines:', error);
    res.status(500).json({ error: 'Failed to fetch pipelines' });
  }
});

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'MongoDB Backend API',
    endpoints: [
      'GET /api/users',
      'GET /api/customers', 
      'GET /api/jobs',
      'GET /api/pipelines'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Available at: http://localhost:${PORT}`);
});

module.exports = app;