const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes - Only include locations for now
app.use('/api/locations', require('./routes/locations'));

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Way2Valley Backend is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campusnav')
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API Available at: http://localhost:${PORT}`);
});
