const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/customers', require('./routes/customers'));
// ... other routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});