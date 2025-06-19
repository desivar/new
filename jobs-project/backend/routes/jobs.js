// routes/customers.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Simple Customer Schema (flexible to work with any data structure)
const customerSchema = new mongoose.Schema({}, { strict: false, collection: 'customers' });
const Customer = mongoose.model('Customer', customerSchema);

// GET /api/customers - Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ 
      message: 'Failed to fetch customers',
      error: error.message 
    });
  }
});

// GET /api/customers/:id - Get single customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ 
      message: 'Failed to fetch customer',
      error: error.message 
    });
  }
});

// POST /api/customers - Create new customer (optional)
router.post('/', async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ 
      message: 'Failed to create customer',
      error: error.message 
    });
  }
});

module.exports = router;