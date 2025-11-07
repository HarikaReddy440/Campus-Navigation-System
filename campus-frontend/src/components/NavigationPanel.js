import React, { useState, useEffect } from 'react';
import './NavigationPanel.css';

const NavigationPanel = ({ destination, userLocation, onStopNavigation }) => {
  const [navigationStats, setNavigationStats] = useState({
    distance: 'Calculating...',
    time: 'Calculating...',
    eta: 'Calculating...'
  });

  const [steps, setSteps] = useState([]);

  useEffect(() => {
    if (destination && userLocation) {
      calculateNavigationStats();
      generateNavigationSteps();
    }
  }, [destination, userLocation]);

  const calculateNavigationStats = () => {
    if (!destination || !userLocation) return;

    const distance = calculateDistance(userLocation, destination.coordinates);
    const walkingTime = calculateWalkingTime(distance);
    const eta = calculateETA(walkingTime);

    setNavigationStats({
      distance: distance,
      time: walkingTime,
      eta: eta
    });
  };

  const calculateDistance = (point1, point2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    if (distance < 0.1) {
      return `${(distance * 1000).toFixed(0)}m`;
    } else {
      return `${distance.toFixed(1)}km`;
    }
  };

  const calculateWalkingTime = (distanceStr) => {
    if (distanceStr === 'Calculating...') return 'Calculating...';
    
    const distance = distanceStr.includes('m') ? 
      parseFloat(distanceStr) / 1000 : parseFloat(distanceStr);
    
    // Average walking speed: 5 km/h = 12 min per km
    const minutes = Math.ceil(distance * 12);
    
    if (minutes < 1) {
      return 'Less than 1 min';
    } else if (minutes === 1) {
      return '1 min';
    } else {
      return `${minutes} min`;
    }
  };

  const calculateETA = (timeStr) => {
    if (timeStr === 'Calculating...') return 'Calculating...';
    
    const now = new Date();
    let minutesToAdd = 0;
    
    if (timeStr.includes('Less than')) {
      minutesToAdd = 1;
    } else {
      minutesToAdd = parseInt(timeStr);
    }
    
    now.setMinutes(now.getMinutes() + minutesToAdd);
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const generateNavigationSteps = () => {
    if (!destination) return;

    const mockSteps = [
      { instruction: 'Head towards the main pathway from your current location', distance: '50m' },
      { instruction: 'Continue straight along the central campus road', distance: '200m' },
      { instruction: 'Pass the administration building on your right', distance: '150m' },
      { instruction: destination.type === 'academic' ? 'Enter the academic block through the main entrance' : 
                   destination.type === 'library' ? 'The library will be on your left side' :
                   destination.type === 'hostel' ? 'Follow the signs to student residences' :
                   destination.type === 'food' ? 'The food court entrance is straight ahead' :
                   'Your destination is ahead', 
        distance: '100m' },
      { instruction: `You have arrived at ${destination.name}`, distance: 'Arrived' }
    ];

    setSteps(mockSteps);
  };

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

  if (!destination) return null;

  return (
    <div className="navigation-panel">
      <div className="nav-header">
        <h3>
          <i className="fas fa-route"></i>
          Navigating to {destination.name}
        </h3>
        <p>Follow the blue route on the map</p>
      </div>

      <div className="destination-info">
        <div className="destination-icon">
          <i className={`fas fa-${getLocationIcon(destination.type)}`}></i>
        </div>
        <div className="destination-details">
          <h4>{destination.name}</h4>
          <p>{destination.building}</p>
          {destination.roomNumber && <span>Room {destination.roomNumber}</span>}
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#34a853' }}>
            <i className="fas fa-walking"></i> {getLocationTypeName(destination.type)}
          </div>
        </div>
      </div>

      <div className="nav-stats">
        <div className="stat-item">
          <div className="stat-value">{navigationStats.distance}</div>
          <div className="stat-label">Distance</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{navigationStats.time}</div>
          <div className="stat-label">Walking Time</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{navigationStats.eta}</div>
          <div className="stat-label">ETA</div>
        </div>
      </div>

      <div className="nav-instructions">
        <h4>Directions</h4>
        <div className="instruction-list">
          {steps.map((step, index) => (
            <div key={index} className="instruction-item">
              <div className="instruction-step">
                {index === steps.length - 1 ? (
                  <i className="fas fa-flag-checkered" style={{ fontSize: '0.7rem' }}></i>
                ) : (
                  index + 1
                )}
              </div>
              <div className="instruction-content">
                <div className="instruction-text">{step.instruction}</div>
                {step.distance !== 'Arrived' && (
                  <div className="instruction-distance">{step.distance}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="nav-tips">
        <div className="tip-item">
          <i className="fas fa-info-circle"></i>
          <span>Stay on marked pathways for best route</span>
        </div>
        <div className="tip-item">
          <i className="fas fa-exclamation-triangle"></i>
          <span>Be aware of campus vehicles and bicycles</span>
        </div>
      </div>

      <div className="nav-actions">
        <button className="stop-nav-btn" onClick={onStopNavigation}>
          <i className="fas fa-stop"></i>
          End Navigation
        </button>
      </div>
    </div>
  );
};

export default NavigationPanel;