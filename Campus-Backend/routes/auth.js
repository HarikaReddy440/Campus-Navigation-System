const express = require('express');
const router = express.Router();

// Simple auth routes for now
router.post('/login', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Login endpoint - implement later',
    token: 'dummy_token'
  });
});

router.post('/register', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Register endpoint - implement later' 
  });
});

module.exports = router;
