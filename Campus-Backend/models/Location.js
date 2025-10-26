const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a location name'],
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['academic', 'library', 'cafeteria', 'sports', 'administrative', 'residential', 'parking', 'health', 'entertainment', 'other']
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  building: {
    type: String,
    required: [true, 'Please add building name']
  },
  description: {
    type: String,
    default: ''
  },
  hours: {
    type: String,
    default: '24/7'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Location', locationSchema);
