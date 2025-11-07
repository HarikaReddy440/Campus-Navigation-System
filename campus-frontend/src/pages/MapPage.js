import React, { useState, useEffect } from 'react';
import RealMap from '../components/RealMap';
import CampusSidebar from './CampusSidebar';
import LocationPanel from './LocationPanel';
import NavigationPanel from '../components/NavigationPanel';
import CampusHeader from './CampusHeader';
import './MapPage.css';

const MapPage = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [destination, setDestination] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // RK VALLEY EXACT COORDINATES from your screenshot
  const CAMPUS_CENTER = { lat: 14.33549, lng: 78.53987 };
  const CAMPUS_BOUNDS = {
    north: 14.3370,  // Campus northern boundary
    south: 14.3340,  // Campus southern boundary  
    east: 78.5415,   // Campus eastern boundary
    west: 78.5380    // Campus western boundary
  };

  useEffect(() => {
    initializeCampusData();
    getUserLocation();
  }, []);

  const initializeCampusData = () => {
    // RK VALLEY CAMPUS BUILDINGS - based on actual layout
    const campusLocations = [
      {
        id: '1',
        name: 'Academic Block 1',
        building: 'Main Academic Building',
        type: 'academic',
        coordinates: { lat: 14.33549, lng: 78.53987 }, // Exact center from screenshot
        description: 'Primary academic building with classrooms and department offices',
        hours: '8:00 AM - 6:00 PM',
        floors: 4,
        departments: ['CSE', 'ECE', 'First Year'],
        amenities: ['Smart Classrooms', 'Faculty Rooms', 'Department Offices'],
        contact: '08559-123456'
      },
      {
        id: '2',
        name: 'Academic Block 2',
        building: 'Advanced Studies Block',
        type: 'academic',
        coordinates: { lat: 14.33580, lng: 78.54020 },
        description: 'Advanced engineering departments and research centers',
        hours: '8:00 AM - 8:00 PM',
        floors: 3,
        departments: ['Mechanical', 'Civil', 'Chemical', 'Research Labs'],
        amenities: ['Research Labs', 'Project Rooms', 'Conference Hall'],
        contact: '08559-123457'
      },
      {
        id: '3',
        name: 'Central Library',
        building: 'Digital Learning Resource Center',
        type: 'library',
        coordinates: { lat: 14.33520, lng: 78.53950 },
        description: 'Central library with digital resources and study spaces',
        hours: '8:00 AM - 10:00 PM',
        floors: 2,
        amenities: ['Digital Section', 'Reading Hall', 'Group Study Rooms', 'Computer Lab'],
        contact: '08559-123458'
      },
      {
        id: '4',
        name: 'Administration Block',
        building: 'Main Administration Building',
        type: 'administration',
        coordinates: { lat: 14.33480, lng: 78.54000 },
        description: 'Central administration and student services',
        hours: '9:00 AM - 5:00 PM',
        floors: 2,
        departments: ['Registrar', 'Accounts', 'Examination Cell', 'Student Affairs'],
        amenities: ['Student Help Desk', 'Documentation Center', 'Administrative Offices'],
        contact: '08559-123459'
      },
      {
        id: '5',
        name: 'Boys Hostel Complex',
        building: 'Student Residence A',
        type: 'hostel',
        coordinates: { lat: 14.33620, lng: 78.53920 },
        description: 'Boys residential accommodation blocks',
        hours: '24/7',
        floors: 3,
        amenities: ['Mess Hall', 'Common Room', 'Sports Facilities', 'WiFi'],
        contact: '08559-123460'
      },
      {
        id: '6',
        name: 'Girls Hostel Complex',
        building: 'Student Residence B',
        type: 'hostel',
        coordinates: { lat: 14.33650, lng: 78.53980 },
        description: 'Girls residential accommodation with security',
        hours: '24/7',
        floors: 3,
        amenities: ['Mess Hall', 'Common Room', 'Study Hall', 'Security'],
        contact: '08559-123461'
      },
      {
        id: '7',
        name: 'Food Court & Cafe',
        building: 'Student Center',
        type: 'food',
        coordinates: { lat: 14.33510, lng: 78.53920 },
        description: 'Multi-cuisine food court and refreshment center',
        hours: '7:00 AM - 11:00 PM',
        amenities: ['Cafe', 'Food Stalls', 'Seating Area', 'Snack Bar'],
        contact: '08559-123462'
      },
      {
        id: '8',
        name: 'Sports Complex',
        building: 'Athletics Center',
        type: 'sports',
        coordinates: { lat: 14.33680, lng: 78.54050 },
        description: 'Comprehensive sports and fitness facilities',
        hours: '6:00 AM - 9:00 PM',
        amenities: ['Gymnasium', 'Basketball Court', 'Cricket Ground', 'Swimming Pool'],
        contact: '08559-123463'
      },
      {
        id: '9',
        name: 'Main Auditorium',
        building: 'Convention Center',
        type: 'auditorium',
        coordinates: { lat: 14.33460, lng: 78.53900 },
        description: 'Main auditorium for events, seminars and conferences',
        hours: '9:00 AM - 6:00 PM',
        capacity: '1200+',
        amenities: ['Main Stage', 'Sound System', 'Projection Facilities', 'Green Rooms'],
        contact: '08559-123464'
      },
      {
        id: '10',
        name: 'Medical Center',
        building: 'Campus Health Unit',
        type: 'medical',
        coordinates: { lat: 14.33560, lng: 78.54080 },
        description: 'Campus medical facility and emergency care',
        hours: '24/7 Emergency',
        amenities: ['Emergency Care', 'Pharmacy', 'Consultation Rooms', 'Ambulance'],
        contact: '08559-123465'
      },
      {
        id: '11',
        name: 'Computer Center',
        building: 'IT Infrastructure Building',
        type: 'academic',
        coordinates: { lat: 14.33530, lng: 78.54040 },
        description: 'Advanced computing and IT infrastructure facilities',
        hours: '8:00 AM - 8:00 PM',
        floors: 2,
        departments: ['CSE Labs', 'Server Room', 'Network Center', 'IT Support'],
        amenities: ['High-Speed Internet', 'Computer Labs', 'Server Facilities'],
        contact: '08559-123466'
      },
      {
        id: '12',
        name: 'Workshop Complex',
        building: 'Engineering Workshop',
        type: 'workshop',
        coordinates: { lat: 14.33600, lng: 78.54100 },
        description: 'Engineering workshops and practical training facilities',
        hours: '8:00 AM - 5:00 PM',
        amenities: ['Mechanical Workshop', 'Electrical Lab', 'CAD Center', 'Prototyping'],
        contact: '08559-123467'
      }
    ];

    setLocations(campusLocations);
    setFilteredLocations(campusLocations);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Check if user is within campus bounds
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
          // Use campus center if location access denied
          setUserLocation(CAMPUS_CENTER);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setUserLocation(CAMPUS_CENTER);
    }
  };

  const handleSearch = (query, type) => {
    const filtered = locations.filter(location => {
      const matchesQuery = !query || 
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.building.toLowerCase().includes(query.toLowerCase()) ||
        (location.departments && location.departments.some(dept => 
          dept.toLowerCase().includes(query.toLowerCase())
        ));
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

  const startNavigation = (location) => {
    if (!location) return;
    setDestination(location);
    setIsNavigating(true);
    setSelectedLocation(null);
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setDestination(null);
  };

  const refreshLocation = () => {
    getUserLocation();
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
    <div className="campus-map-page">
      <CampusHeader onRefreshLocation={refreshLocation} />
      
      <div className="map-layout">
        <CampusSidebar
          locations={filteredLocations}
          activeFilter={activeFilter}
          onFilter={handleFilter}
          onSearch={handleSearch}
          onLocationSelect={setSelectedLocation}
          selectedLocation={selectedLocation}
        />
        
        <div className="map-container">
          <RealMap
            locations={filteredLocations}
            center={userLocation}
            zoom={17}
            bounds={CAMPUS_BOUNDS}
            onLocationClick={setSelectedLocation}
            userLocation={userLocation}
            isNavigating={isNavigating}
            destination={destination}
            onMapLoad={() => setMapLoaded(true)}
          />
          
          <div className="map-overlay-controls">
            <button className="control-btn" onClick={refreshLocation} title="Refresh Location">
              <i className="fas fa-location-arrow"></i>
            </button>
            <button className="control-btn" onClick={() => handleFilter('all')} title="Show All Buildings">
              <i className="fas fa-layer-group"></i>
            </button>
          </div>
        </div>

        {selectedLocation && !isNavigating && (
          <LocationPanel
            location={selectedLocation}
            onStartNavigation={startNavigation}
            onClose={() => setSelectedLocation(null)}
            userLocation={userLocation}
          />
        )}

        {isNavigating && destination && (
          <NavigationPanel
            destination={destination}
            userLocation={userLocation}
            onStopNavigation={stopNavigation}
          />
        )}
      </div>
    </div>
  );
};

export default MapPage;