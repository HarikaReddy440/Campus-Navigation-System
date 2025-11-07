import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import RealMap from '../components/RealMap';
import CampusSidebar from './CampusSidebar';
import LocationPanel from './LocationPanel';
import NavigationPanel from '../components/NavigationPanel';
import CampusHeader from './CampusHeader';
import './MapPage.css';
import { campusRoads, roadConnections } from './campusRoads';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('MapPage Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong.</h2>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// 🛣️ ROAD-BASED PATHFINDING FUNCTIONS

// Helper: Calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 1000; // Distance in meters
};

// Helper: Find nearest point on any road to a given location
const findNearestRoadPoint = (targetLat, targetLng) => {
  let nearestPoint = null;
  let nearestDistance = Infinity;
  let nearestRoad = null;
  let nearestIndex = -1;

  Object.entries(campusRoads).forEach(([roadName, roadPath]) => {
    roadPath.forEach((point, index) => {
      const distance = calculateDistance(targetLat, targetLng, point[0], point[1]);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestPoint = point;
        nearestRoad = roadName;
        nearestIndex = index;
      }
    });
  });

  return { point: nearestPoint, road: nearestRoad, index: nearestIndex, distance: nearestDistance };
};

// Helper: Find path between two points on the same road
const findPathOnSameRoad = (startPoint, endPoint, roadName) => {
  const road = campusRoads[roadName];
  const startIndex = road.findIndex(point => 
    point[0] === startPoint[0] && point[1] === startPoint[1]
  );
  const endIndex = road.findIndex(point => 
    point[0] === endPoint[0] && point[1] === endPoint[1]
  );

  if (startIndex === -1 || endIndex === -1) return [];

  if (startIndex <= endIndex) {
    return road.slice(startIndex, endIndex + 1);
  } else {
    return road.slice(endIndex, startIndex + 1).reverse();
  }
};

// Helper: Find connecting roads between two road segments
const findConnectingRoads = (startRoad, endRoad, visited = new Set()) => {
  if (startRoad === endRoad) return [startRoad];
  
  visited.add(startRoad);
  
  // Get all roads connected to current road through locations
  const connectedRoads = new Set();
  Object.entries(roadConnections).forEach(([location, roads]) => {
    if (roads.includes(startRoad)) {
      roads.forEach(road => {
        if (road !== startRoad && !visited.has(road)) {
          connectedRoads.add(road);
        }
      });
    }
  });

  // Try each connected road
  for (let nextRoad of connectedRoads) {
    const path = findConnectingRoads(nextRoad, endRoad, new Set(visited));
    if (path.length > 0) {
      return [startRoad, ...path];
    }
  }

  return [];
};

// Helper: Find connection point between two roads
const findConnectionPoint = (road1, road2) => {
  const points1 = campusRoads[road1];
  const points2 = campusRoads[road2];
  
  // Find closest points between the two roads
  let closestPoint = null;
  let minDistance = Infinity;
  
  points1.forEach(point1 => {
    points2.forEach(point2 => {
      const distance = calculateDistance(point1[0], point1[1], point2[0], point2[1]);
      if (distance < minDistance && distance < 50) { // 50 meter threshold
        minDistance = distance;
        closestPoint = point1; // Use point from first road
      }
    });
  });
  
  return closestPoint;
};

// Helper: Calculate total path distance
const calculatePathDistance = (path) => {
  let totalDistance = 0;
  for (let i = 1; i < path.length; i++) {
    totalDistance += calculateDistance(
      path[i-1][0], path[i-1][1],
      path[i][0], path[i][1]
    );
  }
  return totalDistance;
};

// Helper: Generate route steps based on path
const generateRouteSteps = (startName, endName, path, roadSequence = []) => {
  const steps = [`Start at ${startName}`];
  
  if (roadSequence.length > 0) {
    steps.push(`Take ${roadSequence[0].replace(/_/g, ' ')}`);
    
    for (let i = 1; i < roadSequence.length; i++) {
      steps.push(`Continue on ${roadSequence[i].replace(/_/g, ' ')}`);
    }
  } else {
    steps.push('Follow the campus road');
  }
  
  steps.push(`Arrive at ${endName}`);
  return steps;
};

// 🗺️ MAIN ROAD PATHFINDING FUNCTION
const findRoadPath = (startCoords, endCoords) => {
  console.log('🛣️ Finding road path from:', startCoords, 'to:', endCoords);
  
  const startLat = startCoords.lat;
  const startLng = startCoords.lng;
  const endLat = endCoords.lat;
  const endLng = endCoords.lng;

  // Step 1: Find nearest road points for start and end
  const startRoadInfo = findNearestRoadPoint(startLat, startLng);
  const endRoadInfo = findNearestRoadPoint(endLat, endLng);

  console.log('📍 Start road:', startRoadInfo.road, 'at point:', startRoadInfo.point);
  console.log('🎯 End road:', endRoadInfo.road, 'at point:', endRoadInfo.point);

  // Step 2: If same road, just path on that road
  if (startRoadInfo.road === endRoadInfo.road) {
    console.log('🛣️ Same road, direct path');
    const path = findPathOnSameRoad(startRoadInfo.point, endRoadInfo.point, startRoadInfo.road);
    return [[startLat, startLng], ...path, [endLat, endLng]];
  }

  // Step 3: Find road sequence between start and end roads
  const roadSequence = findConnectingRoads(startRoadInfo.road, endRoadInfo.road);
  console.log('🛣️ Road sequence:', roadSequence);

  if (roadSequence.length === 0) {
    console.log('❌ No road path found, using straight line');
    return [[startLat, startLng], [endLat, endLng]];
  }

  // Step 4: Build complete path through road sequence
  let completePath = [[startLat, startLng]];
  
  // Add path from start point to first road
  completePath.push(...findPathOnSameRoad(
    startRoadInfo.point, 
    campusRoads[roadSequence[0]][0], 
    startRoadInfo.road
  ).slice(1));

  // Add paths for each road in sequence
  for (let i = 0; i < roadSequence.length - 1; i++) {
    const currentRoad = roadSequence[i];
    const nextRoad = roadSequence[i + 1];
    
    // Find connection point between current and next road
    const connectionPoint = findConnectionPoint(currentRoad, nextRoad);
    if (connectionPoint) {
      // Add path to connection point on current road
      const lastPoint = completePath[completePath.length - 1];
      const pathSegment = findPathOnSameRoad(
        lastPoint, 
        connectionPoint, 
        currentRoad
      ).slice(1);
      completePath.push(...pathSegment);
      
      // Add path from connection point on next road
      const nextRoadPath = campusRoads[nextRoad];
      const connectionIndex = nextRoadPath.findIndex(point =>
        point[0] === connectionPoint[0] && point[1] === connectionPoint[1]
      );
      if (connectionIndex !== -1) {
        completePath.push(...nextRoadPath.slice(connectionIndex));
      }
    }
  }

  // Add path to end point on last road
  const lastRoad = roadSequence[roadSequence.length - 1];
  const lastPoint = completePath[completePath.length - 1];
  const finalSegment = findPathOnSameRoad(
    lastPoint,
    endRoadInfo.point,
    lastRoad
  ).slice(1);
  completePath.push(...finalSegment);
  
  completePath.push([endLat, endLng]);

  console.log('✅ Complete path points:', completePath.length);
  return completePath;
};

// 🗺️ Your campus locations data
const campusLocations = [
  {
    id: '1',
    name: 'Main Gate - Entry',
    lat: 14.334000,
    lng: 78.538500,
    description: 'Main campus entrance gate',
    type: 'entrance'
  },
  {
    id: '2',
    name: 'ACADEMIC BLOCK 1',
    lat: 14.334968,
    lng: 78.536993,
    description: 'Main academic building - Block 1',
    type: 'academic'
  },
  {
    id: '3',
    name: 'ACADEMIC BLOCK 2',
    lat: 14.335212,
    lng: 78.539975,
    description: 'Main academic building - Block 2',
    type: 'academic'
  },
  {
    id: '4',
    name: 'CENTRAL LIBRARY',
    lat: 14.335734,
    lng: 78.538381,
    description: 'Main library with study areas',
    type: 'academic'
  },
  {
    id: '5',
    name: 'Computer Center',
    lat: 14.336280,
    lng: 78.539276,
    description: 'Computer center and IT department',
    type: 'academic'
  },
  {
    id: '6',
    name: 'LAB COMPLEX',
    lat: 14.336225,
    lng: 78.538080,
    description: 'Central laboratory complex',
    type: 'academic'
  },
  {
    id: '7',
    name: 'MECHANICAL WORKSHOP',
    lat: 14.336195,
    lng: 78.538857,
    description: 'Mechanical engineering workshops',
    type: 'academic'
  },
  {
    id: '8',
    name: 'CSE BLOCK',
    lat: 14.336055,
    lng: 78.541580,
    description: 'Computer Science and Engineering Department',
    type: 'academic'
  },
  {
    id: '9',
    name: 'EEE BLOCK',
    lat: 14.336897,
    lng: 78.542637,
    description: 'Electrical and Electronics Engineering',
    type: 'academic'
  },
  {
    id: '10',
    name: 'Chemical Block',
    lat: 14.335252,
    lng: 78.542771,
    description: 'Chemical Engineering Department',
    type: 'academic'
  },
  {
    id: '11',
    name: 'Civil Block',
    lat: 14.335202,
    lng: 78.543589,
    description: 'Civil Engineering Department',
    type: 'academic'
  },
  {
    id: '12',
    name: 'Mechanical Block',
    lat: 14.336426,
    lng: 78.543423,
    description: 'Mechanical Engineering Department',
    type: 'academic'
  },
  {
    id: '13',
    name: 'ECE BLOCK',
    lat: 14.334339,
    lng: 78.541674,
    description: 'Electronics and Communication Engineering',
    type: 'academic'
  },
  {
    id: '14',
    name: 'MME BLOCK',
    lat: 14.337449,
    lng: 78.541580,
    description: 'Metallurgical and Materials Engineering',
    type: 'academic'
  },
  {
    id: '15',
    name: 'Boys Hostel 1',
    lat: 14.334201,
    lng: 78.536894,
    description: 'Primary boys accommodation block',
    type: 'hostel'
  },
  {
    id: '16',
    name: 'Boys Hostel 2',
    lat: 14.334578,
    lng: 78.540433,
    description: 'Secondary boys accommodation block',
    type: 'hostel'
  },
  {
    id: '17',
    name: 'Girls Hostel 1',
    lat: 14.334410,
    lng: 78.538021,
    description: 'Primary girls accommodation block',
    type: 'hostel'
  },
  {
    id: '18',
    name: 'Girls Hostel 2',
    lat: 14.334626,
    lng: 78.538733,
    description: 'Secondary girls accommodation block',
    type: 'hostel'
  },
  {
    id: '19',
    name: 'MESS(1,2,3,4)',
    lat: 14.333798,
    lng: 78.538112,
    description: 'Mess blocks 1-4 for students',
    type: 'facility'
  },
  {
    id: '20',
    name: 'MESS(5,6,7,8)',
    lat: 14.333778,
    lng: 78.538997,
    description: 'Mess blocks 5-8 for students',
    type: 'facility'
  },
  {
    id: '21',
    name: 'IQAC',
    lat: 14.336845,
    lng: 78.540403,
    description: 'Internal Quality Assurance Cell',
    type: 'administrative'
  },
  {
    id: '22',
    name: 'Student Activity Center',
    lat: 14.338162,
    lng: 78.540100,
    description: 'Student clubs and activities',
    type: 'facility'
  },
  {
    id: '23',
    name: 'RKV GROUND',
    lat: 14.337277,
    lng: 78.537297,
    description: 'Sports ground',
    type: 'sports'
  },
  {
    id: '24',
    name: 'RKV POLICE STATION',
    lat: 14.337865,
    lng: 78.536239,
    description: 'Local police station',
    type: 'external'
  },
  {
    id: '25',
    name: 'Old Hostel Girls Hostel 1',
    lat: 14.338501,
    lng: 78.538719,
    description: 'Original girls hostel building',
    type: 'hostel'
  },
  {
    id: '26',
    name: 'Old Campus Girls Hostel 2',
    lat: 14.338269,
    lng: 78.536889,
    description: 'Older accommodation for female students',
    type: 'hostel'
  },
  {
    id: '27',
    name: 'DIRECTOR HOUSE',
    lat: 14.337864,
    lng: 78.531434,
    description: 'Director\'s residence',
    type: 'administrative'
  },
  {
    id: '28',
    name: 'CHANCELLOR HOUSE',
    lat: 14.338134,
    lng: 78.531455,
    description: 'Chancellor\'s residence',
    type: 'administrative'
  },
  {
    id: '29',
    name: 'RKV HOSPITAL',
    lat: 14.337230,
    lng: 78.532539,
    description: 'Local hospital',
    type: 'external'
  },
  {
    id: '30',
    name: 'MALLELAMA TEMPLE',
    lat: 14.337122,
    lng: 78.533270,
    description: 'Campus temple',
    type: 'religious'
  },
  {
    id: '31',
    name: 'POST OFFICE',
    lat: 14.337199,
    lng: 78.533624,
    description: 'Campus post office',
    type: 'commercial'
  },
  {
    id: '32',
    name: 'SBH bank',
    lat: 14.337307,
    lng: 78.534577,
    description: 'State Bank of Hyderabad branch',
    type: 'commercial'
  },
  {
    id: '33',
    name: 'RGUKT RKV Supermarket',
    lat: 14.337313,
    lng: 78.534002,
    description: 'Campus Mart',
    type: 'commercial'
  },
  {
    id: '34',
    name: 'POWER HOUSE',
    lat: 14.335130,
    lng: 78.536508,
    description: 'Campus power station',
    type: 'facility'
  },
  {
    id: '35',
    name: 'GUEST HOUSE',
    lat: 14.332184,
    lng: 78.537342,
    description: 'Campus guest accommodation',
    type: 'administrative'
  }
];

const MapPage = () => {
  const location = useLocation();
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [destination, setDestination] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [pathResult, setPathResult] = useState(null);
  const [isLoadingPath, setIsLoadingPath] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const [showNavigationPanel, setShowNavigationPanel] = useState(true);
  const [autoNavigationStarted, setAutoNavigationStarted] = useState(false);

  // RK VALLEY EXACT COORDINATES
  const CAMPUS_CENTER = { lat: 14.33549, lng: 78.53987 };
  const CAMPUS_BOUNDS = {
    north: 14.3385,
    south: 14.3320,  
    east: 78.5440,
    west: 78.5300
  };

  // 🗺️ FIXED: getUserLocation function inside component
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const isOnCampus = 
            latitude >= CAMPUS_BOUNDS.south && 
            latitude <= CAMPUS_BOUNDS.north &&
            longitude >= CAMPUS_BOUNDS.west && 
            longitude <= CAMPUS_BOUNDS.east;
          
          setUserLocation({
            lat: isOnCampus ? latitude : CAMPUS_CENTER.lat,
            lng: isOnCampus ? longitude : CAMPUS_CENTER.lng
          });
        },
        () => {
          setUserLocation(CAMPUS_CENTER);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setUserLocation(CAMPUS_CENTER);
    }
  };

  useEffect(() => {
    initializeCampusData();
    getUserLocation();
  }, []);

  // 🎯 Handle navigation from Home page
  useEffect(() => {
    if (location.state && location.state.destination && !autoNavigationStarted) {
      console.log('📍 Received destination from Home:', location.state.destination);
      handleDestinationFromHome(location.state.destination);
    }
  }, [location.state, locations, userLocation, autoNavigationStarted]);

  // Function to handle destination from Home page
  const handleDestinationFromHome = (destinationData) => {
    if (!destinationData || !locations.length || !userLocation) return;

    setDestination(destinationData);
    setToLocation(destinationData.name);
    setIsNavigating(true);
    setShowNavigationPanel(true);
    setAutoNavigationStarted(true);

    // Auto-set from location to user's current nearest location
    const nearest = findNearestLocation(userLocation);
    if (nearest) {
      setFromLocation(nearest.name);
      
      // Automatically find path after a short delay
      setTimeout(() => {
        findShortestPath();
      }, 500);
    }
  };

  // 🗺️ UPDATED: Initialize with your coordinate data
  const initializeCampusData = () => {
    // Convert your data format to match the expected format
    const formattedLocations = campusLocations.map(location => ({
      ...location,
      coordinates: { lat: location.lat, lng: location.lng },
      position: [location.lat, location.lng],
      building: location.description,
      // Add any missing fields that your components expect
      hours: '8:00 AM - 6:00 PM',
      floors: location.type === 'hostel' ? 3 : 2,
      amenities: getDefaultAmenities(location.type),
      contact: '08559-123456'
    }));

    setLocations(formattedLocations);
    setFilteredLocations(formattedLocations);
    
    // Set location options for dropdowns
    const options = formattedLocations.map(loc => loc.name);
    setLocationOptions(options);
  };

  // Helper function for default amenities
  const getDefaultAmenities = (type) => {
    const amenities = {
      academic: ['Classrooms', 'Faculty Rooms', 'WiFi'],
      hostel: ['Common Room', 'Mess', 'WiFi', 'Security'],
      facility: ['Basic Amenities', 'Services'],
      administrative: ['Office', 'Services'],
      sports: ['Sports Equipment', 'Playing Area'],
      commercial: ['Services', 'Products'],
      religious: ['Prayer Hall', 'Peaceful Area'],
      entrance: ['Security', 'Main Entry']
    };
    return amenities[type] || ['General Amenities'];
  };

  // 🗺️ UPDATED: Function to find coordinates by location name (memoized)
  const findCoordinatesByName = useCallback((locationName) => {
    if (!locationName) {
      console.log('No location name provided');
      return null;
    }

    console.log('🔍 Searching for location:', locationName);

    // Clean the location name
    const cleanName = locationName.trim().toLowerCase();

    // Search in locations
    const foundLocation = locations.find(loc => {
      const locName = loc.name.toLowerCase();
      return (
        locName === cleanName ||
        locName.includes(cleanName) ||
        cleanName.includes(locName) ||
        locName.replace(/\s+/g, ' ') === cleanName.replace(/\s+/g, ' ')
      );
    });

    if (foundLocation) {
      console.log('✅ Found location:', foundLocation.name);
      return foundLocation.coordinates;
    }

    console.log('❌ Location not found:', locationName);
    return null;
  }, [locations]);

  // 🛣️ UPDATED: findShortestPath method using campus roads
  const findShortestPath = async () => {
    if (!fromLocation || !toLocation) {
      alert('Please select both starting point and destination');
      return;
    }

    if (fromLocation === toLocation) {
      alert('Starting point and destination cannot be the same');
      return;
    }

    setIsLoadingPath(true);
    try {
      console.log('📍 Finding path from:', fromLocation, 'to:', toLocation);

      // Find coordinates for both locations
      const startCoords = findCoordinatesByName(fromLocation);
      const endCoords = findCoordinatesByName(toLocation);

      console.log('📍 Coordinates found - Start:', startCoords, 'End:', endCoords);

      if (!startCoords || !endCoords) {
        const missing = !startCoords ? fromLocation : toLocation;
        alert(`Coordinates not found for: ${missing}`);
        return;
      }

      // 🛣️ USE CAMPUS ROAD NETWORK FOR ROUTING
      console.log('🛣️ Using campus road network for routing');
      const roadPath = findRoadPath(startCoords, endCoords);
      
      // Calculate road sequence for steps
      const startRoadInfo = findNearestRoadPoint(startCoords.lat, startCoords.lng);
      const endRoadInfo = findNearestRoadPoint(endCoords.lat, endCoords.lng);
      const roadSequence = findConnectingRoads(startRoadInfo.road, endRoadInfo.road);
      
      // Calculate distance and generate steps
      const totalDistance = calculatePathDistance(roadPath);
      const routeSteps = generateRouteSteps(fromLocation, toLocation, roadPath, roadSequence);

      // Create path result with ROAD COORDINATES
      const pathResult = {
        path: [fromLocation, toLocation],
        distance: (totalDistance / 1000).toFixed(1) + ' km',
        duration: Math.round(totalDistance / 80) + ' min', // Walking time
        steps: routeSteps,
        routeCoordinates: roadPath, // 🛣️ THIS IS THE KEY - actual road coordinates
        roadSequence: roadSequence.map(road => road.replace(/_/g, ' ')),
        startLocation: locations.find(loc => loc.name === fromLocation),
        endLocation: locations.find(loc => loc.name === toLocation),
        isCampusRoad: true
      };

      setPathResult(pathResult);
      
      // Set destination and start navigation
      const destLocation = locations.find(loc => loc.name === toLocation);
      if (destLocation) {
        setDestination(destLocation);
        setIsNavigating(true);
        setShowNavigationPanel(true);
        console.log('✅ Navigation started with road-based routing');
      }
        
    } catch (error) {
      console.error('Error finding path:', error);
      alert('Error finding path. Please try again.');
    } finally {
      setIsLoadingPath(false);
    }
  };

  const clearNavigation = () => {
    setFromLocation('');
    setToLocation('');
    setPathResult(null);
    setIsNavigating(false);
    setDestination(null);
    setAutoNavigationStarted(false);
  };

  const handleSearch = (query, type) => {
    const filtered = locations.filter(location => {
      const matchesQuery = !query || 
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.description.toLowerCase().includes(query.toLowerCase()) ||
        location.type.toLowerCase().includes(query.toLowerCase());
      const matchesType = !type || type === 'all' || location.type === type;
      return matchesQuery && matchesType;
    });
    setFilteredLocations(filtered);
    setActiveFilter(type || 'all');
  };

  const handleFilter = (type) => {
    setActiveFilter(type);
    if (type === 'all') {
      setFilteredLocations(locations);
    } else {
      const filtered = locations.filter(location => location.type === type);
      setFilteredLocations(filtered);
    }
  };

  const startNavigationFromLocation = (location) => {
    if (!location) return;
    
    setToLocation(location.name);
    
    // Auto-set from location to user's current nearest location
    if (locations.length > 0 && userLocation) {
      const nearest = findNearestLocation(userLocation);
      if (nearest) {
        setFromLocation(nearest.name);
      }
    }
    
    setDestination(location);
    setIsNavigating(true);
    setSelectedLocation(null);
    setShowNavigationPanel(true);
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setDestination(null);
    setPathResult(null);
    setAutoNavigationStarted(false);
  };

  const refreshLocation = () => {
    getUserLocation();
  };

  const findNearestLocation = (userCoords) => {
    if (!userCoords || locations.length === 0) return null;
    
    let nearest = null;
    let minDistance = Infinity;
    
    locations.forEach(location => {
      const distance = calculateDistance(
        userCoords.lat, 
        userCoords.lng, 
        location.coordinates.lat, 
        location.coordinates.lng
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearest = location;
      }
    });
    
    return nearest;
  };

  // Get welcome message based on navigation source
  const getWelcomeMessage = () => {
    if (location.state && location.state.destination) {
      return `Navigating to ${location.state.destination.name}`;
    }
    return 'RGUKT RK Valley Campus Navigator';
  };

  if (!userLocation) {
    return (
      <div className="map-loading">
        <div className="loading-content">
          <div className="campus-logo">
            <i className="fas fa-map-marked-alt"></i>
          </div>
          <h2>RGUKT RK Valley Campus Navigator</h2>
          <p>Loading campus map...</p>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="campus-map-page">
        <CampusHeader 
          onRefreshLocation={refreshLocation} 
          welcomeMessage={getWelcomeMessage()}
        />
        
        <div className="map-layout">
          <CampusSidebar
            locations={filteredLocations}
            activeFilter={activeFilter}
            onFilter={handleFilter}
            onSearch={handleSearch}
            onLocationSelect={setSelectedLocation}
            selectedLocation={selectedLocation}
            onStartNavigation={startNavigationFromLocation}
          />
          
          <div className="map-container">
            <RealMap
              locations={filteredLocations}
              center={userLocation}
              zoom={16}
              bounds={CAMPUS_BOUNDS}
              onLocationClick={setSelectedLocation}
              userLocation={userLocation}
              isNavigating={isNavigating}
              destination={destination}
              pathData={pathResult}
              onMapLoad={() => setMapLoaded(true)}
            />
            
            {/* Navigation Input Panel */}
            {showNavigationPanel && (
              <div className="navigation-input-panel">
                <div className="navigation-header">
                  <h3>🚀 Campus Navigation</h3>
                  <div className="header-actions">
                    <button 
                      className="toggle-panel-btn"
                      onClick={() => setShowNavigationPanel(false)}
                      title="Minimize"
                    >
                      −
                    </button>
                    <button 
                      className="clear-btn"
                      onClick={clearNavigation}
                      title="Clear Navigation"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                <div className="input-group">
                  <label htmlFor="from-location">
                    <i className="fas fa-arrow-right-from-bracket"></i>
                    From:
                  </label>
                  <select
                    id="from-location"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    className="location-select"
                  >
                    <option value="">Select starting point</option>
                    {locationOptions.map((location, index) => (
                      <option key={index} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="to-location">
                    <i className="fas fa-location-dot"></i>
                    To:
                  </label>
                  <select
                    id="to-location"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    className="location-select"
                  >
                    <option value="">Select destination</option>
                    {locationOptions.map((location, index) => (
                      <option key={index} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={findShortestPath}
                  disabled={!fromLocation || !toLocation || isLoadingPath}
                  className={`find-path-btn ${isLoadingPath ? 'loading' : ''}`}
                >
                  {isLoadingPath ? (
                    <>
                      <div className="btn-spinner"></div>
                      Finding Route...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-route"></i>
                      Find Route
                    </>
                  )}
                </button>

                

                {pathResult && (!pathResult.routeCoordinates || pathResult.routeCoordinates.length === 0) && (
                  <div className="path-error">
                    <i className="fas fa-exclamation-triangle"></i>
                    No route found between these locations
                  </div>
                )}
              </div>
            )}

            {/* Show Navigation Panel Button when minimized */}
            {!showNavigationPanel && (
              <button 
                className="show-navigation-btn"
                onClick={() => setShowNavigationPanel(true)}
                title="Show Navigation Panel"
              >
                <i className="fas fa-route"></i>
              </button>
            )}
            
            <div className="map-overlay-controls">
              <button className="control-btn" onClick={refreshLocation} title="Refresh Location">
                <i className="fas fa-location-arrow"></i>
              </button>
              <button className="control-btn" onClick={() => handleFilter('all')} title="Show All Buildings">
                <i className="fas fa-layer-group"></i>
              </button>
              <button 
                className="control-btn" 
                onClick={() => setShowNavigationPanel(!showNavigationPanel)} 
                title="Toggle Navigation"
              >
                <i className="fas fa-route"></i>
              </button>
            </div>
          </div>

          {selectedLocation && !isNavigating && (
            <LocationPanel
              location={selectedLocation}
              onStartNavigation={startNavigationFromLocation}
              onClose={() => setSelectedLocation(null)}
              userLocation={userLocation}
            />
          )}

          {isNavigating && destination && (
            <NavigationPanel
              destination={destination}
              userLocation={userLocation}
              pathData={pathResult}
              onStopNavigation={stopNavigation}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MapPage;