// backend/routes/user.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user'); // Assuming your controller is in '../controllers/user.js'

// IMPORTANT: Do NOT include any 'protect' middleware here.
// We are explicitly allowing no restrictions and no tokens.

// @desc    Get all users
// @route   GET /api/users/
// @access  Public - Anyone can access this
router.get("/", userController.getAllUsers); // FIXED: 'protect' has been removed

// @desc    Login a user (returns user data, NO TOKEN)
// @route   POST /api/users/login
// @access  Public - Anyone can attempt to login
router.post("/login", userController.loginUser);

// @desc    Create a new user (Registration)
// @route   POST /api/users/
// @access  Public - Anyone can create an account
router.post("/", userController.createUser);

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public - Anyone can view a user by ID
router.get("/:id", userController.getUserById);

// @desc    Update user by ID
// @route   PUT /api/users/:id
// @access  Public - Anyone can attempt to update a user (consider proper validation in controller)
router.put("/:id", userController.updateUser);

// @desc    Delete user by ID
// @route   DELETE /api/users/:id
// @access  Public - Anyone can attempt to delete a user (consider proper validation in controller)
router.delete("/:id", userController.deleteUser);


// If you had a '/me' or other routes that previously used 'protect',
// ensure 'protect' is removed from them too, or remove the routes entirely
// if they are not meant to be public.
// Example:
// router.get("/me", userController.getLoggedInUserProfile); // If you keep this, ensure controller does not rely on req.user

module.exports = router;