const express = require('express');
const router = express.Router();
const Job = require('../models/Job'); // Adjust path to your Job model
const Customer = require('../models/Customer'); // Adjust path to your Customer model

// GET /api/dashboard/metrics
router.get('/metrics', async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ 
      status: { $in: ['In Progress', 'Planning', 'Active'] } 
    });
    const completedJobs = await Job.countDocuments({ status: 'Completed' });
    
    const totalRevenueResult = await Job.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$value' } } }
    ]);
    
    const pipelineValueResult = await Job.aggregate([
      { $match: { status: { $ne: 'Completed' } } },
      { $group: { _id: null, total: { $sum: '$value' } } }
    ]);
    
    res.json({
      totalJobs,
      activeJobs,
      completedJobs,
      totalRevenue: totalRevenueResult[0]?.total || 0,
      pipelineValue: pipelineValueResult[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/dashboard/revenue
router.get('/revenue', async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyData = await Job.aggregate([
      { 
        $match: { 
          status: 'Completed',
          completedAt: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: { 
            year: { $year: '$completedAt' },
            month: { $month: '$completedAt' }
          },
          revenue: { $sum: '$value' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formatted = monthlyData.map(item => ({
      month: months[item._id.month - 1],
      revenue: item.revenue
    }));
    
    res.json({ monthlyData: formatted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;