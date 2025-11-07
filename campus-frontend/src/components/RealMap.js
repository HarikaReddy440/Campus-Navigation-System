import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './RealMap.css';

// Fix for default markers
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.divIcon({
  html: `<img src="${icon}" style="width: 25px; height: 41px;" />`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const RealMap = () => {
  // ✅ CORRECT COORDINATES from your Google Maps link
  const campusPosition = [14.3353797, 78.5398846];
  
  // RGUKT Campus specific locations - adjusted around the correct coordinates
  const campusLocations = [
    {
      id: 1,
      name: "Main Academic Block",
      position: [14.3358, 78.5402],
      description: "Central teaching building with classrooms and laboratories"
    },
    {
      id: 2, 
      name: "Central Library",
      position: [14.3350, 78.5395],
      description: "Digital library with study areas and computer lab"
    },
    {
      id: 3,
      name: "Student Hostels",
      position: [14.3365, 78.5388],
      description: "Student accommodation blocks A, B, C, D"
    },
    {
      id: 4,
      name: "Administration Building",
      position: [14.3348, 78.5400],
      description: "Principal office and administrative departments"
    },
    {
      id: 5,
      name: "Main Auditorium",
      position: [14.3352, 78.5408],
      description: "Main auditorium for events and conferences"
    },
    {
      id: 6,
      name: "Sports Complex",
      position: [14.3370, 78.5395],
      description: "Sports ground and gymnasium"
    },
    {
      id: 7,
      name: "Cafeteria & Food Court",
      position: [14.3355, 78.5385],
      description: "Student dining area and food court"
    }
  ];

  return (
    <div className="map-container">
      <MapContainer 
        center={campusPosition} 
        zoom={17} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Main campus marker */}
        <Marker position={campusPosition}>
          <Popup>
            <div className="popup-content">
              <strong>🏫 IIIT RGUKT RK Valley Campus</strong><br />
              <hr style={{margin: '5px 0'}} />
              <strong>Location:</strong> R K Valley, Idupulapaya<br />
              <strong>District:</strong> YSR Kadapa, Andhra Pradesh<br />
              <strong>Type:</strong> Indian Institute of Information Technology<br />
              <em>Welcome to Campus Navigation System</em>
            </div>
          </Popup>
        </Marker>

        {/* Additional campus building markers */}
        {campusLocations.map(location => (
          <Marker key={location.id} position={location.position}>
            <Popup>
              <div className="popup-content">
                <strong>📍 {location.name}</strong><br />
                <hr style={{margin: '5px 0'}} />
                {location.description}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RealMap;