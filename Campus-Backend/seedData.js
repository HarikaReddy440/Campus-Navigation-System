// Campus-Backend/seedData.js
const mongoose = require('mongoose');
const Location = require('./models/Location');
require('dotenv').config();

const sampleLocations = [
  {
    name: "Central Library",
    type: "library",
    coordinates: { lat: 28.6129, lng: 77.2295 },
    building: "Library Building",
    description: "Main library with study spaces, books, and digital resources",
    hours: "8:00 AM - 10:00 PM",
    contact: {
      phone: "+91-11-12345678",
      email: "library@campus.edu"
    },
    amenities: [
      { name: "WiFi", available: true },
      { name: "Computers", available: true },
      { name: "Study Rooms", available: true },
      { name: "Printing", available: true }
    ]
  },
  {
    name: "Student Cafeteria",
    type: "cafeteria",
    coordinates: { lat: 28.6139, lng: 77.2305 },
    building: "Student Center",
    description: "Main dining hall serving variety of cuisines",
    hours: "7:00 AM - 9:00 PM",
    amenities: [
      { name: "Food Court", available: true },
      { name: "Coffee Shop", available: true },
      { name: "Outdoor Seating", available: true }
    ]
  },
  {
    name: "Computer Science Department",
    type: "academic",
    coordinates: { lat: 28.6119, lng: 77.2285 },
    building: "Engineering Block",
    description: "Department of Computer Science and Engineering",
    hours: "9:00 AM - 5:00 PM",
    contact: {
      phone: "+91-11-12345679",
      email: "cs@campus.edu"
    },
    amenities: [
      { name: "Labs", available: true },
      { name: "WiFi", available: true },
      { name: "Projector", available: true }
    ]
  },
  {
    name: "Sports Complex",
    type: "sports",
    coordinates: { lat: 28.6149, lng: 77.2315 },
    building: "Sports Center",
    description: "Indoor and outdoor sports facilities",
    hours: "6:00 AM - 10:00 PM",
    amenities: [
      { name: "Gym", available: true },
      { name: "Swimming Pool", available: true },
      { name: "Basketball Court", available: true },
      { name: "Tennis Court", available: true }
    ]
  },
  {
    name: "Administration Block",
    type: "administrative",
    coordinates: { lat: 28.6109, lng: 77.2275 },
    building: "Admin Building",
    description: "Main administrative offices",
    hours: "9:00 AM - 5:00 PM",
    contact: {
      phone: "+91-11-12345680",
      email: "admin@campus.edu"
    }
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Location.deleteMany({});
    console.log('🗑️  Cleared existing locations');

    // Insert sample data
    await Location.insertMany(sampleLocations);
    console.log('📝 Sample locations added successfully');

    // Display added locations
    const locations = await Location.find();
    console.log(`📊 Total locations in database: ${locations.length}`);
    
    locations.forEach(location => {
      console.log(`📍 ${location.name} - ${location.type}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();