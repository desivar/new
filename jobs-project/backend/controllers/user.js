// backend/controllers/user.js

const User = require('../db/User'); // THIS IS THE CORRECTED LINE
const bcrypt = require('bcryptjs'); // Needed for password hashing (e.g., in createUser)



// --- Helper function for JWT token generation (if you handle login here) ---
const generateToken = (id) => {
    // Replace 'your_jwt_secret' with a strong, secret key from your environment variables
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '1h', // Token expires in 1 hour
    });
};
// @desc    Authenticate user & get token (Login)
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists by email
        const user = await User.findOne({ email });

        // Check password using the method defined in User model
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role, // Ensure 'role' is in your User schema
                token: generateToken(user._id),
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
        const users = await User.find({}); // Find all users
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (e.g., for admin viewing specific user)
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Find by ID, exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(`Error fetching user with ID ${req.params.id}:`, error);
        // Handle CastError for invalid IDs (e.g., if ID format is wrong)
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
    const { name, email, password,role } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user' // Use the destructured 'role' or default to 'user'
            // REMOVE age and preferences lines completely
        });

        if (newUser) {
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                password: undefined, 
                role: newUser.role, // Include role in response
                
                
                token: generateToken(newUser._id) // Generate token upon registration
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
// @access  Private (e.g., admin or user updating their own profile)
exports.updateUser = async (req, res) => {
    const { name, email } = req.body; // Password typically handled in a separate route

    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;
            
        

            // Only update password if provided and hashed
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                
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
// @access  Private (e.g., admin)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await User.deleteOne({ _id: req.params.id }); // Use deleteOne with filter
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(`Error deleting user with ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get current logged-in user's profile
// @route   GET /api/users/me
// @access  Private (authMiddleware ensures this)
exports.getLoggedInUserProfile = async (req, res) => {
    try {
        // req.user is populated by the authMiddleware (from backend/middleware/authMiddleware.js)
        // It contains the ID of the user who is currently authenticated via their JWT token.
        const user = await User.findById(req.user.id).select('-password'); // Find user by ID and exclude the password field for security

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user); // Send the user data as a JSON response
    } catch (error) {
        console.error('Error fetching logged-in user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};