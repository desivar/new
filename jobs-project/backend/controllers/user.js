// backend/routes/user.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user'); // Assuming your controller is in '../controllers/user.js'

// REMOVED: const { protect } = require('../middleware/authMiddleware'); // This line is not needed for 'no tokens'

// Routes for user management

// @desc    Get all users
// @route   GET /api/users/
// @access  Public (No protection needed as per your request)
router.get("/", userController.getAllUsers); // THIS IS THE FIXED LINE

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
router.post("/login", userController.loginUser);

// @desc    Create a new user (Registration)
// @route   POST /api/users/
// @access  Public
router.post("/", userController.createUser);

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public (changed from private for 'no tokens' setup)
router.get("/:id", userController.getUserById);

// @desc    Update user by ID
// @route   PUT /api/users/:id
// @access  Public (changed from private for 'no tokens' setup)
router.put("/:id", userController.updateUser);

// @desc    Delete user by ID
// @route   DELETE /api/users/:id
// @access  Public (changed from private for 'no tokens' setup)
router.delete("/:id", userController.deleteUser);


// REMOVED: If you had a route like this, remove the 'protect' middleware
// router.get("/me", protect, userController.getLoggedInUserProfile);

module.exports = router;