// At the top of Job.js, make sure you import Schema from Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Add this line

const jobSchema = new Schema({
  title: { type: String, required: true },
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' }, // Change ObjectId to Schema.Types.ObjectId
  pipeline: { type: Schema.Types.ObjectId, ref: 'Pipeline' }, // Change ObjectId to Schema.Types.ObjectId
  currentStep: { type: String, required: true },
  status: { type: String, enum: ['active', 'completed', 'on-hold', 'cancelled'], default: 'active' },
  dueDate: { type: Date },
  progress: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);