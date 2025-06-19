const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// GET /api/customers/count
router.get('/count', async (req, res) => {
  try {
    const count = await Customer.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;