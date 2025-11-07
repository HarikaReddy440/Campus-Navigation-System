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

// Map controller component
function MapController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom, {
      animate: true,
      duration: 1.5
    });
  }, [center, zoom, map]);
  
  return null;
}

const RealMap = ({ searchLocation, userLocation, onLocationSelect }) => {
  const [route, setRoute] = useState([]);
  const [destination, setDestination] = useState(null);
  const mapRef = useRef();

  // RGUKT RK Valley coordinates
  const campusPosition = [14.3353797, 78.5398846];
  
  // Campus locations
  const campusLocations = [
  {
    id: 1,
    name: "Old Campus Girls Hostel 2",
    position: [14.338269621763377, 78.53688918115373],
    description: "Older accommodation for female students",
    type: "residential"
  },
  {
    id: 2,
    name: "Old Hostel Girls Hostel 1", 
    position: [14.338501641019192, 78.53871969868588],
    description: "Original girls hostel building",
    type: "residential"
  },
  {
    id: 3,
    name: "Girls Hostel 1",
    position: [14.33441091739434, 78.53802180480704],
    description: "Primary girls accommodation block",
    type: "residential"
  },
  {
    id: 4,
    name: "Girls Hostel 2",
    position: [14.334626029045074, 78.53873303416631],
    description: "Secondary girls accommodation block",
    type: "residential"
  },
  {
    id: 5,
    name: "Boys Hostel 1",
    position: [14.334201736559502, 78.53689410474732],
    description: "Primary boys accommodation block",
    type: "residential"
  },
  {
    id: 6,
    name: "Boys Hostel 2",
    position: [14.33457843114412, 78.5404337784146],
    description: "Secondary boys accommodation block",
    type: "residential"
  },

  // Academic Blocks
  {
    id: 7,
    name: "CSE BLOCK",
    position: [14.336055035340083, 78.54158083692525],
    description: "Computer Science and Engineering Department",
    type: "academic"
  },
  {
    id: 8,
    name: "ECE BLOCK",
    position: [14.334339521893725, 78.54167402874367],
    description: "Electronics and Communication Engineering",
    type: "academic"
  },
  {
    id: 9,
    name: "MME BLOCK",
    position: [14.337449507358329, 78.54158083692525],
    description: "Metallurgical and Materials Engineering",
    type: "academic"
  },
  {
    id: 10,
    name: "Mechanical Block",
    position: [14.336426226580581, 78.54342396400071],
    description: "Mechanical Engineering Department",
    type: "academic"
  },
  {
    id: 11,
    name: "Civil Block",
    position: [14.335202296378826, 78.54358963834459],
    description: "Civil Engineering Department",
    type: "academic"
  },
  {
    id: 12,
    name: "Chemical Block",
    position: [14.335252457583975, 78.54277162127175],
    description: "Chemical Engineering Department",
    type: "academic"
  },
  {
    id: 13,
    name: "EEE BLOCK",
    position: [14.336897738891775, 78.54263701086737],
    description: "Electrical and Electronics Engineering",
    type: "academic"
  },
  {
    id: 14,
    name: "ACADEMIC BLOCK 1",
    position: [14.334968803119954, 78.53699310868649],
    description: "Main academic building - Block 1",
    type: "academic"
  },
  {
    id: 15,
    name: "ACADEMIC BLOCK 2",
    position: [14.33521232862076, 78.53997586671906],
    description: "Main academic building - Block 2",
    type: "academic"
  },

  // Facilities
  {
    id: 16,
    name: "CENTRAL LIBRARY",
    position: [14.335734004582404, 78.5383812511594],
    description: "Main library with study areas",
    type: "academic"
  },
  {
    id: 17,
    name: "MECHANICAL WORKSHOP",
    position: [14.336195486151997, 78.538857564898],
    description: "Mechanical engineering workshops",
    type: "academic"
  },
  {
    id: 18,
    name: "LAB COMPLEX",
    position: [14.336225582743108, 78.53808096641116],
    description: "Central laboratory complex",
    type: "academic"
  },
  {
    id: 19,
    name: "Student Activity Center",
    position: [14.338162545648489, 78.54010066907027],
    description: "Student clubs and activities",
    type: "facility"
  },

  // Administrative
  {
    id: 20,
    name: "GUEST HOUSE",
    position: [14.332184678623689, 78.53734284404298],
    description: "Campus guest accommodation",
    type: "administrative"
  },
  {
    id: 21,
    name: "DIRECTOR HOUSE",
    position: [14.337864317150792, 78.53143406574937],
    description: "Director's residence",
    type: "administrative"
  },
  {
    id: 22,
    name: "CHANCELLOR HOUSE",
    position: [14.338134578074284, 78.53145552342113],
    description: "Chancellor's residence",
    type: "administrative"
  },
  {
    id: 23,
    name: "IQAC",
    position: [14.336845638433509, 78.54040337254955],
    description: "Internal Quality Assurance Cell",
    type: "administrative"
  },
  

  // Services
  {
    id: 24,
    name: "POWER HOUSE",
    position: [14.335130505645743, 78.53650880512313],
    description: "Campus power station",
    type: "facility"
  },
  {
    id: 25,
    name: "SBH bank",
    position: [14.33730779939238, 78.53457785212983],
    description: "State Bank of Hyderabad branch",
    type: "commercial"
  },
  {
    id: 26,
    name: "POST OFFICE",
    position: [14.337199152316602, 78.53362466489871],
    description: "Campus post office",
    type: "commercial"
  },

  // Mess
  {
    id: 27,
    name: "MESS(1,2,3,4)",
    position: [14.333798394953321, 78.53811211964633],
    description: "Mess blocks 1-4 for students",
    type: "facility"
  },
  {
    id: 28,
    name: "MESS(5,6,7,8)",
    position: [14.333778753858851, 78.53899795941643],
    description: "Mess blocks 5-8 for students",
    type: "facility"
  },

  // External but related
  {
    id: 29,
    name: "RKV POLICE STATION",
    position: [14.337865524714912, 78.53623953536967],
    description: "Local police station",
    type: "external"
  },
  {
    id: 30,
    name: "RKV GROUND",
    position: [14.337277470230717, 78.53729782303964],
    description: "Sports ground",
    type: "sports"
  },
  {
    id: 31,
    name: "RKV HOSPITAL",
    position: [14.33723024216662, 78.53253913584555],
    description: "Local hospital",
    type: "external"
  },
  
  {
    id: 33,
    name: "MALLELAMA TEMPLE",
    position: [14.337122786793245, 78.53327056671382],
    description: "Campus temple",
    type: "religious"
  },
  {
    id: 34,
    name: "RGUKT RKV Supermarket",
    position: [14.337313206228803, 78.53400255814049],
    description: "Campus Mart",
    type: "Food"
  },
  {
    id: 35,
    name: "Computer Center",
    position: [14.336280806990011, 78.53927630240211],
    description: "Computer center",
    type: "administrative"
  }
];

  // Calculate route between two points (simplified)
  const calculateRoute = (from, to) => {
    // Simple straight line route for demo
    // In real app, you'd use a routing service like OSRM, Mapbox Directions, etc.
    const routePoints = [
      from,
      [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2], // Midpoint
      to
    ];
    setRoute(routePoints);
  };

  // Handle location selection
  const handleLocationClick = (location) => {
    setDestination(location);
    if (onLocationSelect) {
      onLocationSelect(location);
    }
    
    // Calculate route from user location to destination
    if (userLocation) {
      calculateRoute(userLocation, location.position);
    } else {
      // If no user location, use campus center as start
      calculateRoute(campusPosition, location.position);
    }
  };

  // Effect for search location
  useEffect(() => {
    if (searchLocation) {
      const foundLocation = campusLocations.find(
        loc => loc.name.toLowerCase().includes(searchLocation.toLowerCase())
      );
      if (foundLocation) {
        handleLocationClick(foundLocation);
      }
    }
  }, [searchLocation]);

  const getLocationIcon = (type) => {
    const icons = {
      academic: '📚',
      residential: '🏠', 
      administrative: '🏛️',
      sports: '⚽',
      facility: '🏢'
    };
    return icons[type] || '📍';
  };

  return (
    <div className="map-container">
      <MapContainer 
        center={campusPosition} 
        zoom={17} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <MapController center={destination ? destination.position : campusPosition} zoom={17} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div className="popup-content">
                <strong>📍 Your Location</strong>
                <br />
                <em>You are here</em>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {destination && (
          <Marker position={destination.position} icon={destinationIcon}>
            <Popup>
              <div className="popup-content">
                <strong>🎯 {destination.name}</strong>
                <br />
                {destination.description}
                <br />
                <br />
                <small>Destination</small>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Polyline */}
        {route.length > 0 && (
          <Polyline
            positions={route}
            color="#800020"
            weight={6}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}

        {/* Campus Building Markers */}
        {campusLocations.map(location => (
          <Marker 
            key={location.id} 
            position={location.position}
            eventHandlers={{
              click: () => handleLocationClick(location)
            }}
          >
            <Popup>
              <div className="popup-content">
                <strong>
                  {getLocationIcon(location.type)} {location.name}
                </strong>
                <br />
                {location.description}
                <br />
                <br />
                <button 
                  className="btn-get-directions"
                  onClick={() => handleLocationClick(location)}
                >
                  🚗 Get Directions
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Directions Panel */}
      {destination && (
        <div className="directions-panel">
          <h3>🚗 Directions to {destination.name}</h3>
          <div className="route-steps">
            <div className="route-step">
              <span className="step-number">1</span>
              <span className="step-text">
                {userLocation ? 'Start from your current location' : 'Start from campus center'}
              </span>
            </div>
            <div className="route-step">
              <span className="step-number">2</span>
              <span className="step-text">
                Head towards {destination.name}
              </span>
            </div>
            <div className="route-step">
              <span className="step-number">3</span>
              <span className="step-text">
                Arrive at {destination.name}
              </span>
            </div>
          </div>
          <button 
            className="btn-close-directions"
            onClick={() => {
              setDestination(null);
              setRoute([]);
            }}
          >
            Close Directions
          </button>
        </div>
      )}
    </div>
  );
};

export default RealMap;