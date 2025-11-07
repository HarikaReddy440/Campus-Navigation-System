const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

console.log('🚀 Starting Server on port', PORT);
const { campusGraph } = require('./campusGraph');
const { campusLocations } = require('./campusLocations');
const { campusRoads, roadConnections } = require('../campus-frontend/src/components/campusRoads');

// Simple in-memory database
let users = [];

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ Server is working perfectly!',
    users_count: users.length,
    locations_count: campusLocations.length,
    roads_count: Object.keys(campusRoads).length
  });
});

// GET all location names for navigation dropdown
app.get('/navigation/locations', (req, res) => {
  try {
    const locationNames = campusLocations.map(loc => loc.name);
    
    res.json({
      success: true,
      data: locationNames
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Find all possible paths between two locations using roads
function findAllPossiblePaths(start, end, maxDepth = 5) {
  const paths = [];
  
  function dfs(current, path, visited, depth) {
    if (depth > maxDepth) return;
    if (current === end) {
      paths.push([...path]);
      return;
    }
    
    const currentRoads = roadConnections[current] || [];
    for (const roadId of currentRoads) {
      const road = campusRoads[roadId];
      if (!road) continue;
      
      // Find all locations connected by this road
      Object.entries(roadConnections).forEach(([nextLoc, nextRoads]) => {
        if (nextLoc === current || visited.has(nextLoc)) return;
        if (nextRoads.includes(roadId)) {
          visited.add(nextLoc);
          path.push(nextLoc);
          dfs(nextLoc, path, visited, depth + 1);
          path.pop();
          visited.delete(nextLoc);
        }
      });
    }
  }
  
  dfs(start, [start], new Set([start]), 0);
  return paths;
}

// Calculate total distance of a path using road network
function calculatePathDistance(path) {
  let totalDistance = 0;
  
  for (let i = 0; i < path.length - 1; i++) {
    const loc1 = campusLocations.find(l => l.name === path[i]);
    const loc2 = campusLocations.find(l => l.name === path[i + 1]);
    if (!loc1 || !loc2) continue;
    
    // Find common roads between locations
    const roads1 = roadConnections[loc1.name] || [];
    const roads2 = roadConnections[loc2.name] || [];
    const commonRoads = roads1.filter(r => roads2.includes(r));
    
    let segmentDistance = Infinity;
    
    if (commonRoads.length > 0) {
      // Calculate distances using each common road and take the minimum
      for (const roadId of commonRoads) {
        const road = campusRoads[roadId];
        if (!road) continue;
        
        let roadDist = 0;
        // Calculate distance along road points
        for (let j = 0; j < road.length - 1; j++) {
          roadDist += calculateDistance(
            road[j][0], road[j][1],
            road[j + 1][0], road[j + 1][1]
          );
        }
        
        // Add distances from locations to nearest road points
        roadDist += calculateDistance(loc1.lat, loc1.lng, road[0][0], road[0][1]);
        roadDist += calculateDistance(loc2.lat, loc2.lng, road[road.length - 1][0], road[road.length - 1][1]);
        
        segmentDistance = Math.min(segmentDistance, roadDist);
      }
    } else {
      // If no common road, use direct distance as fallback
      segmentDistance = calculateDistance(loc1.lat, loc1.lng, loc2.lat, loc2.lng);
    }
    
    totalDistance += segmentDistance;
  }
  
  return Math.round(totalDistance);
}

app.post('/navigation/find-path', (req, res) => {
  try {
    const { source, destination } = req.body;
    
    console.log('🔍 Path finding request:', { source, destination });
    
    if (!source || !destination) {
      return res.status(400).json({
        success: false,
        error: "Source and destination are required"
      });
    }
    
    // Check if locations exist
    const startLocation = campusLocations.find(loc => loc.name === source);
    const endLocation = campusLocations.find(loc => loc.name === destination);
    
    if (!startLocation || !endLocation) {
      return res.status(400).json({
        success: false,
        error: `Location not found in campus map`
      });
    }
    
    // Find all possible paths using road network
    const possiblePaths = findAllPossiblePaths(source, destination);
    console.log('Found possible paths:', possiblePaths.length);
    
    if (possiblePaths.length === 0) {
      // Fallback to direct path if no road path found
      const directPath = [source, destination];
      const directDistance = calculateDistance(
        startLocation.lat, startLocation.lng,
        endLocation.lat, endLocation.lng
      );
      
      const result = {
        path: directPath,
        distance: `${Math.round(directDistance)} meters`,
        totalDistance: Math.round(directDistance),
        roadPath: [
          [startLocation.lat, startLocation.lng],
          [endLocation.lat, endLocation.lng]
        ],
        pathWithCoordinates: directPath.map(name => {
          const loc = campusLocations.find(l => l.name === name);
          return {
            name,
            coordinates: loc ? { lat: loc.lat, lng: loc.lng } : null,
            description: loc ? loc.description : '',
            type: loc ? loc.type : ''
          };
        })
      };
      
      return res.json({
        success: true,
        data: result,
        message: 'Direct path found (no road path available)'
      });
    }
    
    // Calculate distances for all possible paths
    const pathsWithDistances = possiblePaths.map(path => ({
      path,
      distance: calculatePathDistance(path)
    }));
    
    // Find the shortest path
    const shortestPath = pathsWithDistances.reduce((min, current) => 
      current.distance < min.distance ? current : min
    );
    
    // Generate detailed road path
    let roadPath = [];
    for (let i = 0; i < shortestPath.path.length - 1; i++) {
      const loc1 = campusLocations.find(l => l.name === shortestPath.path[i]);
      const loc2 = campusLocations.find(l => l.name === shortestPath.path[i + 1]);
      if (!loc1 || !loc2) continue;
      
      const roads1 = roadConnections[loc1.name] || [];
      const roads2 = roadConnections[loc2.name] || [];
      const commonRoads = roads1.filter(r => roads2.includes(r));
      
      if (commonRoads.length > 0) {
        const road = campusRoads[commonRoads[0]];
        if (road) {
          if (i === 0) {
            roadPath = road.map(point => [point[0], point[1]]);
          } else {
            roadPath.push(...road.map(point => [point[0], point[1]]));
          }
        }
      }
    }
    
    const result = {
      path: shortestPath.path,
      distance: `${shortestPath.distance} meters`,
      totalDistance: shortestPath.distance,
      roadPath: roadPath,
      pathWithCoordinates: shortestPath.path.map(name => {
        const loc = campusLocations.find(l => l.name === name);
        return {
          name,
          coordinates: loc ? { lat: loc.lat, lng: loc.lng } : null,
          description: loc ? loc.description : '',
          type: loc ? loc.type : ''
        };
      })
    };
    
    console.log('🛣️ Road path points:', roadPath.length);
    
    res.json({
      success: true,
      data: result,
      message: `Path found with ${shortestPath.distance} meters distance`
    });
    
  } catch (error) {
    console.error('❌ Path finding error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// GET available locations for dropdown (with details)
app.get('/api/locations-list', (req, res) => {
  try {
    const locationList = campusLocations.map(loc => ({
      name: loc.name,
      type: loc.type,
      description: loc.description,
      coordinates: { lat: loc.lat, lng: loc.lng }
    }));
    
    res.json({
      success: true,
      data: locationList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// GET all GPS locations with full details
app.get('/api/gps-locations', (req, res) => {
  try {
    res.json({
      success: true,
      count: campusLocations.length,
      data: campusLocations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// GET road data for frontend visualization
app.get('/api/campus-roads', (req, res) => {
  try {
    res.json({
      success: true,
      data: campusRoads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
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

app.post('/api/auth/login', (req, res) => {
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

// Start server
app.listen(PORT, () => {
  console.log('════════════════════════════════════════');
  console.log('🎉 SERVER.JS RUNNING WITH IMPROVED ROAD NAVIGATION!');
  console.log('📍 Port:', PORT);
  console.log('📍 Locations:', campusLocations.length);
  console.log('📍 Roads:', Object.keys(campusRoads).length);
  console.log('✅ Navigation routes available at:');
  console.log('✅ GET  http://localhost:5000/navigation/locations');
  console.log('✅ POST http://localhost:5000/navigation/find-path');
  console.log('✅ GET  http://localhost:5000/api/locations-list');
  console.log('✅ GET  http://localhost:5000/api/gps-locations');
  console.log('✅ GET  http://localhost:5000/api/campus-roads');
  console.log('✅ Test: http://localhost:5000/api/test');
  console.log('════════════════════════════════════════');
});