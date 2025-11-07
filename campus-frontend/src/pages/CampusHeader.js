import React from 'react';
import './CampusHeader.css';

const CampusHeader = ({ onRefreshLocation }) => {
  return (
    <header className="campus-header">
      <div className="header-content">
        <div className="college-brand">
          <div className="college-logo">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div className="college-info">
            <h1>RGUKT RK Valley Campus Navigator</h1>
            <p>IIIT RGUKT RK Valley, Idupulapaya, Andhra Pradesh</p>
          </div>
        </div>
        
        <div className="header-actions">
          <div className="campus-status">
            <span className="status-indicator active"></span>
            <span>RK Valley Campus</span>
          </div>
          <button className="location-btn" onClick={onRefreshLocation}>
            <i className="fas fa-satellite-dish"></i>
            Update Location
          </button>
        </div>
      </div>
    </header>
  );
};

export default CampusHeader;