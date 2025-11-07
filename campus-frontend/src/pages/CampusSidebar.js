import React from 'react';
import './LocationPanel.css';

const LocationPanel = ({ location, onStartNavigation, onClose, userLocation }) => {
  
  const getLocationIcon = (type) => {
    const icons = {
      academic: 'building',
      library: 'book',
      administration: 'users',
      hostel: 'home',
      food: 'utensils',
      sports: 'running',
      auditorium: 'theater-masks',
      medical: 'first-aid',
      workshop: 'tools'
    };
    return icons[type] || 'map-marker-alt';
  };

  const getLocationTypeName = (type) => {
    const names = {
      academic: 'Academic Building',
      library: 'Library',
      administration: 'Administration',
      hostel: 'Student Hostel',
      food: 'Food Court',
      sports: 'Sports Complex',
      auditorium: 'Auditorium',
      medical: 'Medical Center',
      workshop: 'Workshop'
    };
    return names[type] || 'Campus Location';
  };

  const calculateDistance = (point1, point2) => {
    if (!point1 || !point2) return 'Calculating...';
    
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance < 0.1 ? `${(distance * 1000).toFixed(0)}m away` : `${distance.toFixed(1)}km away`;
  };

  const calculateWalkingTime = (point1, point2) => {
    if (!point1 || !point2) return 'Calculating...';
    
    const R = 6371;
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    const minutes = Math.ceil(distance * 12); // 12 minutes per km walking
    return `${minutes} min walk`;
  };

  if (!location) return null;

  return (
    <div className="location-panel">
      <div className="panel-header">
        <button className="close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        <div className="location-icon-header">
          <i className={`fas fa-${getLocationIcon(location.type)}`}></i>
        </div>
        <div className="location-title">
          <h3>{location.name}</h3>
          <span className="location-type">{getLocationTypeName(location.type)}</span>
        </div>
      </div>

      <div className="panel-content">
        <div className="detail-item">
          <i className="fas fa-building"></i>
          <span>{location.building}</span>
        </div>
        
        {location.roomNumber && (
          <div className="detail-item">
            <i className="fas fa-door-open"></i>
            <span>Room {location.roomNumber}</span>
          </div>
        )}
        
        {location.floor && (
          <div className="detail-item">
            <i className="fas fa-layer-group"></i>
            <span>Floor {location.floor}</span>
          </div>
        )}
        
        {location.hours && (
          <div className="detail-item">
            <i className="fas fa-clock"></i>
            <span>{location.hours}</span>
          </div>
        )}

        <div className="detail-item">
          <i className="fas fa-walking"></i>
          <span>
            {calculateDistance(userLocation, location.coordinates)} • 
            {' '}{calculateWalkingTime(userLocation, location.coordinates)}
          </span>
        </div>
        
        {location.contact && (
          <div className="detail-item">
            <i className="fas fa-phone"></i>
            <span>{location.contact}</span>
          </div>
        )}
        
        {location.description && (
          <div className="description">
            <p>{location.description}</p>
          </div>
        )}
        
        {location.departments && location.departments.length > 0 && (
          <div className="detail-item">
            <i className="fas fa-graduation-cap"></i>
            <span>Departments: {location.departments.join(', ')}</span>
          </div>
        )}
        
        {location.amenities && location.amenities.length > 0 && (
          <div className="amenities-section">
            <h4>Facilities & Amenities</h4>
            <div className="amenities-grid">
              {location.amenities.map((amenity, index) => (
                <span key={index} className="amenity-tag">{amenity}</span>
              ))}
            </div>
          </div>
        )}
        
        {location.isAccessible && (
          <div className="accessibility-badge">
            <i className="fas fa-wheelchair"></i>
            <span>Wheelchair Accessible</span>
          </div>
        )}

        {location.capacity && (
          <div className="detail-item">
            <i className="fas fa-users"></i>
            <span>Capacity: {location.capacity}</span>
          </div>
        )}
      </div>

      <div className="panel-actions">
        <button 
          className="nav-btn"
          onClick={() => onStartNavigation(location)}
        >
          <i className="fas fa-route"></i>
          Start Navigation
        </button>
        <button className="save-btn">
          <i className="far fa-star"></i>
          Save
        </button>
      </div>
    </div>
  );
};

export default LocationPanel;