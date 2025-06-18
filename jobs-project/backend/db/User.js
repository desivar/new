// backend/db/User.js (or backend/models/User.js if you decide to create a models folder)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Needed for hashing passwords

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Method to compare entered password with hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash the password before saving (pre-save hook)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next(); // Only hash if password has been modified
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


const User = mongoose.model('User', userSchema);

module.exports = User;