// routes/user.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Simple User Schema (flexible to work with any data structure)
const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
const User = mongoose.model('User', userSchema);

// GET /api/users - Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      message: 'Failed to fetch users',
      error: error.message 
    });
  }
});

// GET /api/users/:id - Get single user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user',
      error: error.message 
    });
  }
});

// POST /api/users - Create new user (optional)
router.post('/', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      message: 'Failed to create user',
      error: error.message 
    });
  }
});

module.exports = router;