const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// GET /api/jobs
router.get('/', async (req, res) => {
  try {
    const { limit = 10, sort = '-createdAt' } = req.query;
    const jobs = await Job.find()
      .populate('customer', 'name')
      .sort(sort)
      .limit(parseInt(limit));
    
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;