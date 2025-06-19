// Job Schema
const jobSchema = {
  title: String,
  customer: { type: ObjectId, ref: 'Customer' },
  status: { type: String, enum: ['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled'] },
  value: Number,
  dueDate: Date,
  createdAt: { type: Date, default: Date.now },
  completedAt: Date
};

// Customer Schema  
const customerSchema = {
  
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address: String,
  notes: String

};