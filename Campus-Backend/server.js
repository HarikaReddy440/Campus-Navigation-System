const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

console.log('🚀 Starting Server on port', PORT);

// Simple in-memory database (no MongoDB needed)
let users = [];
let locations = [
  {
    id: 1,
    name: "Main Library",
    type: "library",
    building: "Library Building",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    description: "Central library with study spaces and books",
    hours: "8:00 AM - 10:00 PM",
    amenities: ["WiFi", "Study Rooms", "Computers", "Printers"],
    icon: "📚"
  },
  {
    id: 2,
    name: "Student Cafeteria",
    type: "cafeteria", 
    building: "Student Center",
    coordinates: { lat: 40.7599, lng: -73.9841 },
    description: "Main dining hall for students",
    hours: "7:00 AM - 9:00 PM",
    amenities: ["Food Court", "Vending Machines", "Seating"],
    icon: "🍽️"
  },
  {
    id: 3,
    name: "Computer Science Department",
    type: "academic",
    building: "Science Block",
    coordinates: { lat: 40.7579, lng: -73.9861 },
    description: "Department of Computer Science",
    hours: "9:00 AM - 5:00 PM",
    amenities: ["Labs", "Classrooms", "Faculty Offices"],
    icon: "🏫"
  },
  {
    id: 4,
    name: "Sports Complex",
    type: "sports",
    building: "Athletics Center", 
    coordinates: { lat: 40.7600, lng: -73.9830 },
    description: "University sports facility with gym and pool",
    hours: "6:00 AM - 11:00 PM",
    amenities: ["Gym", "Pool", "Courts", "Track"],
    icon: "⚽"
  },
  {
    id: 5,
    name: "Administration Building",
    type: "administrative",
    building: "Admin Block",
    coordinates: { lat: 40.7560, lng: -73.9870 },
    description: "Main administrative offices",
    hours: "8:30 AM - 4:30 PM", 
    amenities: ["Offices", "Meeting Rooms", "Reception"],
    icon: "🏛️"
  }
];

// Test route - ALWAYS works
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ Server is working perfectly!',
    users_count: users.length,
    locations_count: locations.length
  });
});

// Register - ALWAYS works (no validation)
app.post('/api/auth/register', (req, res) => {
  console.log('📝 Register:', req.body.email);
  
  const { name, email, password, role } = req.body;
  
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    role: role || 'student',
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  res.json({
    success: true,
    token: 'token-' + newUser.id,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
});

// Login - ALWAYS works with any email/password
app.post('/api/auth/login', (req, res) => {
  console.log('🔐 Login attempt:', req.body.email);
  
  const { email, password } = req.body;
  
  let user = users.find(u => u.email === email);
  
  if (!user) {
    user = {
      id: users.length + 1,
      name: email.split('@')[0],
      email: email,
      role: 'student'
    };
    users.push(user);
  }
  
  res.json({
    success: true,
    token: 'token-' + user.id,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// Get all locations
app.get('/api/locations', (req, res) => {
  res.json({
    success: true,
    data: locations,
    count: locations.length
  });
});

// Search locations
app.get('/api/locations/search', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.json({
      success: true,
      data: locations,
      count: locations.length
    });
  }
  
  const searchTerm = q.toLowerCase();
  const results = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm) ||
    location.building.toLowerCase().includes(searchTerm) ||
    location.type.toLowerCase().includes(searchTerm) ||
    location.description.toLowerCase().includes(searchTerm)
  );
  
  res.json({
    success: true,
    data: results,
    count: results.length,
    query: q
  });
});

// Get single location
app.get('/api/locations/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const location = locations.find(loc => loc.id === id);
  
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
});

// Start server
app.listen(PORT, () => {
  console.log('════════════════════════════════════════');
  console.log('🎉 SERVER.JS RUNNING!');
  console.log('📍 Port:', PORT);
  console.log('✅ No MongoDB required');
  console.log('✅ Using your original server.js file');
  console.log('✅ Ready to use immediately');
  console.log('✅ Test: http://localhost:5000/api/test');
  console.log('════════════════════════════════════════');
});