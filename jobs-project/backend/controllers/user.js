// backend/controllers/user.js

const User = require('../db/User'); // Or require('../models/User') based on your actual path
const bcrypt = require('bcryptjs');

// === Fix: Ensure NO router.get/post etc. calls are in this file ===
// This file should ONLY contain functions that are exported,
// like exports.loginUser, exports.getAllUsers, etc.
// The "router" calls belong in the routes/user.js file.

// No 'router' definitions here:
// const router = express.Router(); // DO NOT INCLUDE THIS HERE if it exists
// router.get("/", someFunction);    // DO NOT INCLUDE THIS HERE if it exists

// (The generateToken function was already commented out/removed in the previous fix)
// const generateToken = (id) => { ... };


// @desc    Authenticate user & get token (Login)
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(`Error fetching user with ID ${req.params.id}:`, error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create new user (e.g., for registration)
// @route   POST /api/users
// @access  Public
exports.createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        if (newUser) {
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user by ID
// @route   PUT /api/users/:id
// @access  Public
exports.updateUser = async (req, res) => {
    const { name, email, role } = req.body;

    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = name !== undefined ? name : user.name;
            user.email = email !== undefined ? email : user.email;
            user.role = role !== undefined ? role : user.role;

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(`Error updating user with ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete user by ID
// @route   DELETE /api/users/:id
// @access  Public
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await User.deleteOne({ _id: req.params.id });
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(`Error deleting user with ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Server error' });
    }
};