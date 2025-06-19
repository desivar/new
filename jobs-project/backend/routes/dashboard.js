// routes/dashboard.js
const express = require("express");
const router = express.Router();

// Import your existing controllers - adjust paths as needed
const jobsController = require("../controllers/jobs");
const customersController = require("../controllers/customers"); // if you have this

// You'll need to create dashboard-specific controller functions
// For now, let's create simple routes that use mock data

// GET /api/dashboard/metrics
router.get('/metrics', async (req, res) => {
  try {
    // Replace this with actual database queries using your models
    // You'll need to adapt this based on your database connection method
    
    // Mock data for now - replace with real queries
    const dashboardData = {
      totalJobs: 47,
      activeJobs: 23,
      completedJobs: 18,
      totalRevenue: 125000,
      pipelineValue: 89000
    };
    
    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/dashboard/revenue
router.get('/revenue', async (req, res) => {
  try {
    // Mock revenue data - replace with real database queries
    const monthlyData = [
      { month: 'Jan', revenue: 15000 },
      { month: 'Feb', revenue: 18000 },
      { month: 'Mar', revenue: 22000 },
      { month: 'Apr', revenue: 25000 },
      { month: 'May', revenue: 28000 },
      { month: 'Jun', revenue: 17000 }
    ];
    
    res.json({ monthlyData });
  } catch (error) {
    console.error('Dashboard revenue error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;