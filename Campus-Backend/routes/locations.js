const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// GET all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true });
    res.json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// GET single location
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }
    
    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// Search locations
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    const locations = await Location.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { building: { $regex: query, $options: 'i' } },
            { type: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    });
    
    res.json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

module.exports = router;
