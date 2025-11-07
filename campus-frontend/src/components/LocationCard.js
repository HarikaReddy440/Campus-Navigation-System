import React from 'react';
import './LocationCard.css';

const LocationCard = ({ location, onStartNavigation, onClose }) => {
  const getLocationIcon = (type) => {
    const icons = {
      classroom: 'chalkboard-teacher',
      library: 'book',
      cafeteria: 'utensils',
      administration: 'building',
      sports: 'running',
      dormitory: 'home',
      parking: 'parking'
    };
    return icons[type] || 'map-marker-alt';
  };

  const getTypeName = (type) => {
    const names = {
      classroom: 'Classroom',
      library: 'Library',
      cafeteria: 'Food Court',
      administration: 'Administration',
      sports: 'Sports Facility',
      dormitory: 'Dormitory',
      parking: 'Parking'
    };
    return names[type] || 'Location';
  };

  return (
    <div className="location-card">
      <div className="card-header">
        <button className="close-button" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        <div className="location-icon-large">
          <i className={`fas fa-${getLocationIcon(location.type)}`}></i>
        </div>
        <div className="location-title">
          <h3>{location.name}</h3>
          <span className="location-type">{getTypeName(location.type)}</span>
        </div>
      </div>

      <div className="card-content">
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
        
        {location.contact?.phone && (
          <div className="detail-item">
            <i className="fas fa-phone"></i>
            <span>{location.contact.phone}</span>
          </div>
        )}
        
        {location.description && (
          <div className="description">
            <p>{location.description}</p>
          </div>
        )}
        
        {location.amenities && location.amenities.length > 0 && (
          <div className="amenities">
            <h4>Amenities:</h4>
            <div className="amenities-list">
              {location.amenities.map((amenity, index) => (
                <span key={index} className="amenity-tag">{amenity}</span>
              ))}
            </div>
          </div>
        )}
        
        {location.isAccessible && (
          <div className="accessibility">
            <i className="fas fa-wheelchair"></i>
            <span>Wheelchair Accessible</span>
          </div>
        )}
      </div>

      <div className="card-actions">
        <button 
          className="navigate-button"
          onClick={() => onStartNavigation(location)}
        >
          <i className="fas fa-route"></i>
          Start Navigation
        </button>
        <button className="favorite-button">
          <i className="far fa-star"></i>
          Save
        </button>
      </div>
    </div>
  );
};

export default LocationCard;