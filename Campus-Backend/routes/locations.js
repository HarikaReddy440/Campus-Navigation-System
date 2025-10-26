// Campus-Backend/routes/locations.js
const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// @desc    Get all locations
// @route   GET /api/locations
// @access  Public
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

// @desc    Get single location
// @route   GET /api/locations/:id
// @access  Public
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

// @desc    Create new location
// @route   POST /api/locations
// @access  Private/Admin
router.post('/', async (req, res) => {
  try {
    const location = await Location.create(req.body);
    
    res.status(201).json({
      success: true,
      data: location
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating location',
      error: error.message
    });
  }
});

// @desc    Search locations
// @route   GET /api/locations/search/:query
// @access  Public
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