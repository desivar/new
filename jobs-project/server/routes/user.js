// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
// Ensure userController is correctly imported, including loginUser
const userController = require("../controllers/user");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/", userController.createUser); // Register a new user
router.post("/login", userController.loginUser); 

// Protected routes (example - adjust as per your requirements)
router.get("/", protect, userController.getAllUsers); // Admin only
router.get("/me", protect, userController.getLoggedInUserProfile); // Get own profile
router.get("/:id", protect, userController.getUserById); // Admin or specific logic
router.put("/:id", protect, userController.updateUser); // Admin or user updating own
router.delete("/:id", protect, userController.deleteUser); // Admin only

module.exports = router;