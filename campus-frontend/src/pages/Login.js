import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Fixed: Make getCurrentLocation return a Promise
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      setLocationLoading(true);
      setLocationError(null);

      if (!navigator.geolocation) {
        const error = 'Geolocation is not supported by this browser.';
        setLocationError(error);
        setLocationLoading(false);
        reject(error);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationData = { latitude, longitude };
          setLocation(locationData);
          setLocationLoading(false);
          resolve(locationData); // Resolve with location data
        },
        (error) => {
          const errorMsg = getErrorMessage(error);
          setLocationError(errorMsg);
          setLocationLoading(false);
          reject(errorMsg); // Reject with error
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  };

  const getErrorMessage = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location access denied. Please enable location permissions.';
      case error.POSITION_UNAVAILABLE:
        return 'Location information unavailable.';
      case error.TIMEOUT:
        return 'Location request timed out.';
      default:
        return 'An unknown error occurred.';
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setLoginError('');
    setLocationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    setLocationError('');

    try {
      // Step 1: Try to get location (but don't block login if it fails)
      let userLocation = null;
      try {
        userLocation = await getCurrentLocation();
        console.log('Location fetched:', userLocation);
      } catch (locationErr) {
        console.log('Location not available, continuing without it:', locationErr);
        // Don't block login if location fails
      }

      // Step 2: Proceed with login
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Store location in localStorage if available
        if (userLocation) {
          localStorage.setItem('userLocation', JSON.stringify(userLocation));
          localStorage.setItem('locationTimestamp', new Date().toISOString());
        }
        
        navigate('/');
      } else {
        setLoginError(result.message);
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Optional: Add a button to manually trigger location
  const handleManualLocation = async () => {
    try {
      await getCurrentLocation();
    } catch (error) {
      // Error is already set in state
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-section">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <span className="logo-icon">🏠</span>
              Way2Valley
            </Link>
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue</p>
          </div>

          {/* Location Status Display */}
          <div className="location-status">
            {locationLoading && (
              <div className="location-loading">
                <span>📍 Getting your location...</span>
              </div>
            )}
            
            {location && (
              <div className="location-success">
                <span>✅ Location detected</span>
                <small>Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}</small>
              </div>
            )}
            
            {locationError && (
              <div className="location-error">
                <span>❌ {locationError}</span>
                <button 
                  type="button" 
                  onClick={handleManualLocation}
                  className="retry-location-btn"
                >
                  Try Again
                </button>
              </div>
            )}

            {!location && !locationLoading && !locationError && (
              <div className="location-prompt">
                <span>📍 Location access helps with navigation</span>
                <button 
                  type="button" 
                  onClick={handleManualLocation}
                  className="enable-location-btn"
                >
                  Enable Location
                </button>
              </div>
            )}
          </div>

          {loginError && (
            <div className="error-message">
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                required
              />
            </div>

            <button 
              type="submit" 
              className={`auth-btn btn-primary ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="auth-link">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-hero-section">
          <div className="auth-hero-content">
            <div className="hero-illustration">
              <div className="campus-illustration">
                <div className="building">🏛️</div>
                <div className="building">🏫</div>
                <div className="building">📚</div>
              </div>
            </div>
            <h2>Navigate Your Campus with Ease</h2>
            <p>
              Find your way around campus, discover new places, and never get lost again. 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;