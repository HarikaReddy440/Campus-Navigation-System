import React from 'react';
import './UserProfile.css';

const UserProfile = ({ user, onClose }) => {
  return (
    <div className="user-profile-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>User Profile</h2>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="profile-content">
          <div className="avatar-section">
            <div className="user-avatar">
              <i className="fas fa-user"></i>
            </div>
            <h3>{user?.name || 'User'}</h3>
            <p className="user-role">{user?.role || 'Student'}</p>
          </div>

          <div className="profile-details">
            <div className="detail-row">
              <label>Email:</label>
              <span>{user?.email || 'user@campus.edu'}</span>
            </div>
            <div className="detail-row">
              <label>Member Since:</label>
              <span>January 2024</span>
            </div>
            <div className="detail-row">
              <label>Saved Locations:</label>
              <span>12 places</span>
            </div>
          </div>

          <div className="profile-actions">
            <button className="profile-btn primary">
              <i className="fas fa-edit"></i>
              Edit Profile
            </button>
            <button className="profile-btn">
              <i className="fas fa-cog"></i>
              Settings
            </button>
            <button className="profile-btn">
              <i className="fas fa-history"></i>
              Navigation History
            </button>
            <button className="profile-btn logout">
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;