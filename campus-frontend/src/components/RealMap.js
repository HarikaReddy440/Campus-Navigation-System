import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './RealMap.css';

// Fix for default markers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.divIcon({
  html: `<img src="${icon}" style="width: 25px; height: 41px;" />`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icon for user location
const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMzQjgxRkYiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTAiIHI9IjMiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTEyIDIxQzE2IDIxIDE5IDE4IDE5IDE0QzE5IDEwIDE2IDcgMTIgN0M4IDcgNSAxMCA1IDE0QzUgMTggOCAyMSAxMiAyMVoiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

// Custom icon for destination
const destinationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRjZCNkIiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

// Custom icon for path waypoints
const waypointIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIgZmlsbD0iIzNCODlGRiIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Map controller component
function MapController({ center, zoom, bounds }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds([
        [bounds.south, bounds.west],
        [bounds.north, bounds.east]
      ], { padding: [20, 20] });
    } else if (center) {
      map.setView(center, zoom, {
        animate: true,
        duration: 1.5
      });
    }
  }, [center, zoom, bounds, map]);
  
  return null;
}

const RealMap = ({ 
  locations = [], 
  center, 
  zoom = 17, 
  bounds,
  onLocationClick,
  userLocation,
  isNavigating = false,
  destination,
  pathData,
  onMapLoad 
}) => {
  const [routePath, setRoutePath] = useState([]);
  const [waypoints, setWaypoints] = useState([]);
  const mapRef = useRef();

  // RGUKT RK Valley coordinates
  const campusPosition = [14.3353797, 78.5398846];
  
  // Enhanced campus locations data matching your RealMap component
  const campusLocations = [
    {
      id: '1',
      name: 'Old Campus Girls Hostel 2',
      coordinates: { lat: 14.338269, lng: 78.536889 },
      position: [14.338269, 78.536889],
      description: 'Older accommodation for female students',
      type: 'hostel'
    },
    {
      id: '2',
      name: 'Old Hostel Girls Hostel 1',
      coordinates: { lat: 14.338501, lng: 78.538719 },
      position: [14.338501, 78.538719],
      description: 'Original girls hostel building',
      type: 'hostel'
    },
    {
      id: '3',
      name: 'Girls Hostel 1',
      coordinates: { lat: 14.334410, lng: 78.538021 },
      position: [14.334410, 78.538021],
      description: 'Primary girls accommodation block',
      type: 'hostel'
    },
    {
      id: '4',
      name: 'Girls Hostel 2',
      coordinates: { lat: 14.334626, lng: 78.538733 },
      position: [14.334626, 78.538733],
      description: 'Secondary girls accommodation block',
      type: 'hostel'
    },
    {
      id: '5',
      name: 'Boys Hostel 1',
      coordinates: { lat: 14.334201, lng: 78.536894 },
      position: [14.334201, 78.536894],
      description: 'Primary boys accommodation block',
      type: 'hostel'
    },
    {
      id: '6',
      name: 'Boys Hostel 2',
      coordinates: { lat: 14.334578, lng: 78.540433 },
      position: [14.334578, 78.540433],
      description: 'Secondary boys accommodation block',
      type: 'hostel'
    },
    {
      id: '7',
      name: 'CSE BLOCK',
      coordinates: { lat: 14.336055, lng: 78.541580 },
      position: [14.336055, 78.541580],
      description: 'Computer Science and Engineering Department',
      type: 'academic'
    },
    {
      id: '8',
      name: 'ECE BLOCK',
      coordinates: { lat: 14.334339, lng: 78.541674 },
      position: [14.334339, 78.541674],
      description: 'Electronics and Communication Engineering',
      type: 'academic'
    },
    {
      id: '9',
      name: 'MME BLOCK',
      coordinates: { lat: 14.337449, lng: 78.541580 },
      position: [14.337449, 78.541580],
      description: 'Metallurgical and Materials Engineering',
      type: 'academic'
    },
    {
      id: '10',
      name: 'Mechanical Block',
      coordinates: { lat: 14.336426, lng: 78.543423 },
      position: [14.336426, 78.543423],
      description: 'Mechanical Engineering Department',
      type: 'academic'
    },
    {
      id: '11',
      name: 'Civil Block',
      coordinates: { lat: 14.335202, lng: 78.543589 },
      position: [14.335202, 78.543589],
      description: 'Civil Engineering Department',
      type: 'academic'
    },
    {
      id: '12',
      name: 'Chemical Block',
      coordinates: { lat: 14.335252, lng: 78.542771 },
      position: [14.335252, 78.542771],
      description: 'Chemical Engineering Department',
      type: 'academic'
    },
    {
      id: '13',
      name: 'EEE BLOCK',
      coordinates: { lat: 14.336897, lng: 78.542637 },
      position: [14.336897, 78.542637],
      description: 'Electrical and Electronics Engineering',
      type: 'academic'
    },
    {
      id: '14',
      name: 'ACADEMIC BLOCK 1',
      coordinates: { lat: 14.334968, lng: 78.536993 },
      position: [14.334968, 78.536993],
      description: 'Main academic building - Block 1',
      type: 'academic'
    },
    {
      id: '15',
      name: 'ACADEMIC BLOCK 2',
      coordinates: { lat: 14.335212, lng: 78.539975 },
      position: [14.335212, 78.539975],
      description: 'Main academic building - Block 2',
      type: 'academic'
    },
    {
      id: '16',
      name: 'CENTRAL LIBRARY',
      coordinates: { lat: 14.335734, lng: 78.538381 },
      position: [14.335734, 78.538381],
      description: 'Main library with study areas',
      type: 'academic'
    },
    {
      id: '17',
      name: 'MECHANICAL WORKSHOP',
      coordinates: { lat: 14.336195, lng: 78.538857 },
      position: [14.336195, 78.538857],
      description: 'Mechanical engineering workshops',
      type: 'academic'
    },
    {
      id: '18',
      name: 'LAB COMPLEX',
      coordinates: { lat: 14.336225, lng: 78.538080 },
      position: [14.336225, 78.538080],
      description: 'Central laboratory complex',
      type: 'academic'
    },
    {
      id: '19',
      name: 'Student Activity Center',
      coordinates: { lat: 14.338162, lng: 78.540100 },
      position: [14.338162, 78.540100],
      description: 'Student clubs and activities',
      type: 'facility'
    },
    {
      id: '20',
      name: 'GUEST HOUSE',
      coordinates: { lat: 14.332184, lng: 78.537342 },
      position: [14.332184, 78.537342],
      description: 'Campus guest accommodation',
      type: 'administrative'
    },
    {
      id: '21',
      name: 'DIRECTOR HOUSE',
      coordinates: { lat: 14.337864, lng: 78.531434 },
      position: [14.337864, 78.531434],
      description: "Director's residence",
      type: 'administrative'
    },
    {
      id: '22',
      name: 'CHANCELLOR HOUSE',
      coordinates: { lat: 14.338134, lng: 78.531455 },
      position: [14.338134, 78.531455],
      description: "Chancellor's residence",
      type: 'administrative'
    },
    {
      id: '23',
      name: 'IQAC',
      coordinates: { lat: 14.336845, lng: 78.540403 },
      position: [14.336845, 78.540403],
      description: 'Internal Quality Assurance Cell',
      type: 'administrative'
    },
    {
      id: '24',
      name: 'POWER HOUSE',
      coordinates: { lat: 14.335130, lng: 78.536508 },
      position: [14.335130, 78.536508],
      description: 'Campus power station',
      type: 'facility'
    },
    {
      id: '25',
      name: 'SBH bank',
      coordinates: { lat: 14.337307, lng: 78.534577 },
      position: [14.337307, 78.534577],
      description: 'State Bank of Hyderabad branch',
      type: 'commercial'
    },
    {
      id: '26',
      name: 'POST OFFICE',
      coordinates: { lat: 14.337199, lng: 78.533624 },
      position: [14.337199, 78.533624],
      description: 'Campus post office',
      type: 'commercial'
    },
    {
      id: '27',
      name: 'MESS(1,2,3,4)',
      coordinates: { lat: 14.333798, lng: 78.538112 },
      position: [14.333798, 78.538112],
      description: 'Mess blocks 1-4 for students',
      type: 'facility'
    },
    {
      id: '28',
      name: 'MESS(5,6,7,8)',
      coordinates: { lat: 14.333778, lng: 78.538997 },
      position: [14.333778, 78.538997],
      description: 'Mess blocks 5-8 for students',
      type: 'facility'
    },
    {
      id: '29',
      name: 'RKV POLICE STATION',
      coordinates: { lat: 14.337865, lng: 78.536239 },
      position: [14.337865, 78.536239],
      description: 'Local police station',
      type: 'external'
    },
    {
      id: '30',
      name: 'RKV GROUND',
      coordinates: { lat: 14.337277, lng: 78.537297 },
      position: [14.337277, 78.537297],
      description: 'Sports ground',
      type: 'sports'
    },
    {
      id: '31',
      name: 'RKV HOSPITAL',
      coordinates: { lat: 14.337230, lng: 78.532539 },
      position: [14.337230, 78.532539],
      description: 'Local hospital',
      type: 'external'
    },
    {
      id: '32',
      name: 'MALLELAMA TEMPLE',
      coordinates: { lat: 14.337122, lng: 78.533270 },
      position: [14.337122, 78.533270],
      description: 'Campus temple',
      type: 'religious'
    },
    {
      id: '33',
      name: 'RGUKT RKV Supermarket',
      coordinates: { lat: 14.337313, lng: 78.534002 },
      position: [14.337313, 78.534002],
      description: 'Campus Mart',
      type: 'commercial'
    },
    {
      id: '34',
      name: 'Computer Center',
      coordinates: { lat: 14.336280, lng: 78.539276 },
      position: [14.336280, 78.539276],
      description: 'Computer center',
      type: 'academic'
    },
    {
      id: '35',
      name: 'Main Gate - Entry',
      coordinates: { lat: 14.334000, lng: 78.538500 },
      position: [14.334000, 78.538500],
      description: 'Main campus entrance',
      type: 'entrance'
    }
  ];

  // Function to find coordinates by location name
  const findCoordinatesByName = (locationName) => {
    if (!locationName) return null;

    // First check in the provided locations prop
    const fromLocations = locations.find(loc => 
      loc && loc.name && (
        loc.name.toLowerCase().includes(locationName.toLowerCase()) ||
        locationName.toLowerCase().includes(loc.name.toLowerCase())
      )
    );
    
    if (fromLocations && fromLocations.coordinates) {
      return [fromLocations.coordinates.lat, fromLocations.coordinates.lng];
    }
    
    // Then check in campusLocations
    const fromCampus = campusLocations.find(loc => 
      loc.name.toLowerCase().includes(locationName.toLowerCase()) ||
      locationName.toLowerCase().includes(loc.name.toLowerCase())
    );
    
    if (fromCampus) {
      return fromCampus.position;
    }
    
    return null;
  };

  // Process path data and convert to coordinates
  useEffect(() => {
    if (pathData && pathData.path && Array.isArray(pathData.path) && pathData.path.length > 0) {
      const pathCoordinates = [];
      const waypointMarkers = [];
      
      // Convert each location name in the path to coordinates
      pathData.path.forEach((locationName, index) => {
        const coords = findCoordinatesByName(locationName);
        if (coords) {
          pathCoordinates.push(coords);
          
          // Add waypoint markers for intermediate points (not start and end)
          if (index > 0 && index < pathData.path.length - 1) {
            waypointMarkers.push({
              position: coords,
              name: locationName,
              step: index
            });
          }
        }
      });
      
      setRoutePath(pathCoordinates);
      setWaypoints(waypointMarkers);
      
      // Fit map to show the entire route if we have enough points
      if (pathCoordinates.length >= 2 && mapRef.current) {
        const map = mapRef.current;
        const latLngs = pathCoordinates.map(coord => L.latLng(coord[0], coord[1]));
        const routeBounds = L.latLngBounds(latLngs);
        map.fitBounds(routeBounds, { padding: [50, 50] });
      }
    } else {
      setRoutePath([]);
      setWaypoints([]);
    }
  }, [pathData, locations]);

  // Handle map load
  useEffect(() => {
    if (onMapLoad) {
      onMapLoad();
    }
  }, [onMapLoad]);

  // Safe function to get location icon
  const getLocationIcon = (location) => {
    if (!location) return '📍';
    
    const type = location.type || 'default';
    const icons = {
      academic: '📚',
      library: '📖',
      administration: '🏛️',
      hostel: '🏠',
      food: '🍽️',
      sports: '⚽',
      auditorium: '🎭',
      medical: '🏥',
      workshop: '⚒️',
      entrance: '🚪',
      facility: '🏢',
      commercial: '🏪',
      external: '🏢',
      religious: '🛕',
      default: '📍'
    };
    return icons[type] || icons.default;
  };

  // Safe function to handle marker click
  const handleMarkerClick = (location) => {
    if (onLocationClick && location) {
      onLocationClick(location);
    }
  };

  // Safe function to get position for a location
  const getLocationPosition = (location) => {
    if (!location) return null;
    
    // If location has position array, use it
    if (location.position && Array.isArray(location.position)) {
      return location.position;
    }
    
    // If location has coordinates object, convert to array
    if (location.coordinates && typeof location.coordinates === 'object') {
      return [location.coordinates.lat, location.coordinates.lng];
    }
    
    return null;
  };

  // Combine provided locations with campus locations for display, filtering out invalid ones
  const displayLocations = React.useMemo(() => {
    const allLocations = locations.length > 0 ? locations : campusLocations;
    
    return allLocations
      .filter(location => location && getLocationPosition(location))
      .map(location => ({
        ...location,
        position: getLocationPosition(location)
      }));
  }, [locations]);

  return (
    <div className="map-container">
      <MapContainer 
        center={center || campusPosition} 
        zoom={zoom} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        whenCreated={(map) => {
          mapRef.current = map;
        }}
      >
        <MapController 
          center={center || campusPosition} 
          zoom={zoom} 
          bounds={bounds}
        />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User Location Marker */}
        {userLocation && userLocation.lat && userLocation.lng && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]} 
            icon={userIcon}
          >
            <Popup>
              <div className="popup-content">
                <strong>📍 Your Current Location</strong>
                <br />
                <em>You are here</em>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {isNavigating && destination && destination.coordinates && (
          <Marker 
            position={[destination.coordinates.lat, destination.coordinates.lng]} 
            icon={destinationIcon}
          >
            <Popup>
              <div className="popup-content">
                <strong>🎯 {destination.name}</strong>
                <br />
                {destination.description || destination.building}
                <br />
                <br />
                <small>Navigation Destination</small>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Waypoint Markers for Path */}
        {waypoints.map((waypoint, index) => (
          <Marker 
            key={`waypoint-${index}`}
            position={waypoint.position} 
            icon={waypointIcon}
          >
            <Popup>
              <div className="popup-content">
                <strong>Step {waypoint.step}</strong>
                <br />
                {waypoint.name}
                <br />
                <small>Route Waypoint</small>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Navigation Route Polyline */}
{routePath && routePath.length > 0 && (
  <Polyline
    positions={routePath}
    color="#800020"
    weight={6}
    opacity={0.8}
    dashArray="10, 5"
  />
)}

        {/* Campus Building Markers - Only render valid locations */}
        {displayLocations.map(location => (
          <Marker 
            key={location.id} 
            position={location.position}
            eventHandlers={{
              click: () => handleMarkerClick(location)
            }}
          >
            <Popup>
              <div className="popup-content">
                <strong>
                  {getLocationIcon(location)} {location.name}
                </strong>
                <br />
                {location.description || location.building}
                <br />
                {location.type && (
                  <small>Type: {location.type}</small>
                )}
                <br />
                <br />
                <button 
                  className="btn-get-directions"
                  onClick={() => handleMarkerClick(location)}
                >
                  🚗 View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      
    </div>
  );
};

export default RealMap;