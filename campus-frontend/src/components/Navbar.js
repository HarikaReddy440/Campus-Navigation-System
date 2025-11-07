import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand - Not a link, changed to Way2Valley with RGUKT logo */}
        <div className="nav-brand">
          <span className="logo-icon">🏛️</span>
          <span>Way2Valley</span>
        </div>

        {/* Navigation Menu */}
        <div className="nav-menu">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/map" 
            className={`nav-link ${location.pathname === '/map' ? 'active' : ''}`}
          >
            Map
          </Link>
          <Link 
            to="/search" 
            className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}
          >
            Search
          </Link>
        </div>

        {/* User Actions */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-greeting">
                Hello, <span className="user-name">{user?.name}</span>
              </span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">
                Login
              </Link>
              <Link to="/signup" className="btn-signup">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;