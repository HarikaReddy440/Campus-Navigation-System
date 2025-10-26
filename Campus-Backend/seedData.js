const mongoose = require('mongoose');
const Location = require('./models/Location');
require('dotenv').config();

const sampleLocations = [
  {
    name: "Central Library",
    type: "library",
    coordinates: { lat: 28.6129, lng: 77.2295 },
    building: "Library Building",
    description: "Main library with study spaces and books",
    hours: "8:00 AM - 10:00 PM"
  },
  {
    name: "Student Cafeteria",
    type: "cafeteria",
    coordinates: { lat: 28.6139, lng: 77.2305 },
    building: "Student Center",
    description: "Main dining hall for students",
    hours: "7:00 AM - 9:00 PM"
  },
  {
    name: "Computer Science Department",
    type: "academic",
    coordinates: { lat: 28.6119, lng: 77.2285 },
    building: "Engineering Block",
    description: "Department of Computer Science",
    hours: "9:00 AM - 5:00 PM"
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Location.deleteMany({});
    console.log('🗑️ Cleared existing locations');

    // Insert sample data
    await Location.insertMany(sampleLocations);
    console.log('📝 Sample locations added successfully');

    const locations = await Location.find();
    console.log(`📊 Total locations: ${locations.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedDatabase();
