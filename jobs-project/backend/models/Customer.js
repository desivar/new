// At the top of Customer.js (or wherever you define your customer model)
const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Ensure Schema is imported

const customerSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true // Removes whitespace from both ends of a string
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email addresses are unique
    lowercase: true, // Stores emails in lowercase
    trim: true,
    // Basic email validation regex
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phone: {
    type: String,
    trim: true,
    // Optional: Add regex for phone number validation if needed
  },
  address: { // Keeping it simple as a single string for now, as in your example.
             // For more complex needs, consider breaking this into sub-fields or a separate schema.
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  // --- Additional Recommended Fields ---

  // For the educational context (students, teachers)
  isStudent: { // Flag to differentiate between general customers and students
    type: Boolean,
    default: false
  },
  isTeacher: { // Flag to differentiate between general customers and teachers
    type: Boolean,
    default: false
  },
  // If this customer IS a student:
  studentDetails: {
    enrollmentDate: { type: Date },
    gradeLevel: { type: String }, // e.g., "Beginner", "Intermediate", "Advanced" or "Grade 10"
    // Reference to the teacher (if a student can have one primary teacher)
    // This assumes you'd have a 'Teacher' model or teachers are also 'Customer' types
    primaryTeacher: { type: Schema.Types.ObjectId, ref: 'Customer', required: function() { return this.isStudent; } }, // Required if isStudent is true
    // Array to store courses/classes a student is enrolled in
    classesEnrolled: [{ type: Schema.Types.ObjectId, ref: 'Class' }] // Assuming a 'Class' model
  },
  // If this customer IS a teacher:
  teacherDetails: {
    hireDate: { type: Date },
    specialties: [{ type: String }], // e.g., ["Math", "Science"]
    // Array of classes this teacher teaches
    classesTaught: [{ type: Schema.Types.ObjectId, ref: 'Class' }]
  },

  // Communication Preferences
  optInWhatsApp: { // Directly relevant to your requirement for sending WhatsApp messages
    type: Boolean,
    default: false
  },
  optInEmail: {
    type: Boolean,
    default: true // Default to true, but allow users to opt-out
  },
  preferredContactMethod: {
    type: String,
    enum: ['email', 'phone', 'whatsapp', 'none'], // 'none' for no preferred method
    default: 'email'
  },
  status: { // Customer lifecycle status (e.g., 'lead', 'active', 'inactive', 'archived')
    type: String,
    enum: ['lead', 'active', 'inactive', 'churned'],
    default: 'active'
  },
  leadSource: { // How the customer was acquired
    type: String,
    trim: true
  },
  lastActivityAt: { // Timestamp of last interaction
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Create a text index for searchable fields
customerSchema.index({ firstName: 'text', lastName: 'text', email: 'text', phone: 'text', notes: 'text', 'studentDetails.gradeLevel': 'text' });


module.exports = mongoose.model('Customer', customerSchema);