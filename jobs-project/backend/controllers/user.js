const User = require('../db/User'); // THIS IS THE CORRECTED LINE (assuming User model is in db folder)
const bcrypt = require('bcryptjs'); // Needed for password hashing (e.g., in createUser)
// const jwt = require('jsonwebtoken'); // REMOVED: Not needed if no tokens


// --- REMOVED: Helper function for JWT token generation ---
// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
//         expiresIn: '1h',
//     });
// };

// @desc    Authenticate user & get token (Login) - MODIFIED to return user data only, NO TOKEN
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
                role: user.role, // Ensure 'role' is in your User schema if you use it
                // REMOVED: token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public
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
// @access  Public (changed from Private as no protection is applied)
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Find by ID, exclude password
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

        // NOTE: The User model's pre('save') hook already handles hashing.
        // You can remove this explicit hashing here if your model's pre-save hook is reliable.
        // If you want to keep this for clarity or specific reasons, ensure it doesn't double-hash.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword, // Use the explicitly hashed password
            role: role || 'user'
        });

        if (newUser) {
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                // REMOVED: password: undefined, // No need to explicitly set undefined as it's not sent by default
                role: newUser.role,
                // REMOVED: token: generateToken(newUser._id) // No token on creation
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
// @access  Public (changed from Private as no protection is applied)
exports.updateUser = async (req, res) => {
    const { name, email, role } = req.body; // Include role if it can be updated

    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = name !== undefined ? name : user.name; // Only update if provided
            user.email = email !== undefined ? email : user.email;
            user.role = role !== undefined ? role : user.role; // Update role if provided

            // Only update password if provided and hashed
            if (req.body.password) {
                // NOTE: The pre-save hook on the User model will hash this automatically.
                // Setting user.password = req.body.password; would be enough.
                // However, if you explicitly hash here, ensure it doesn't cause double hashing.
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
// @access  Public (changed from Private as no protection is applied)
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

// @desc    Get current logged-in user's profile - REMOVED as no protection/tokens
// @route   GET /api/users/me
// @access  (No longer applicable without authMiddleware)
// exports.getLoggedInUserProfile = async (req, res) => {
//     res.status(400).json({ message: 'This route requires authentication, which is currently disabled.' });
//     // Alternatively, simply remove this function if it's not needed.
// };