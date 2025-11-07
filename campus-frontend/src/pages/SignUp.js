import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    
    if (!agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  const userTypes = [
    { value: 'student', label: 'Student', icon: '🎓' },
    { value: 'faculty', label: 'Faculty', icon: '👨‍🏫' },
    { value: 'staff', label: 'Staff', icon: '💼' },
    { value: 'visitor', label: 'Visitor', icon: '👋' }
  ];

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-section">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <span className="logo-icon">🏠</span>
              Way2Valley
            </Link>
            <h1>Create Account</h1>
            <p>Join Way2Valley to navigate campus with ease</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your full name"
                required
              />
            </div>

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
              <label className="form-label">I am a</label>
              <div className="user-type-grid">
                {userTypes.map((type) => (
                  <label key={type.value} className="user-type-label">
                    <input
                      type="radio"
                      name="role"
                      value={type.value}
                      checked={formData.role === type.value}
                      onChange={handleChange}
                      className="user-type-input"
                    />
                    <div className="user-type-card">
                      <span className="user-type-icon">{type.icon}</span>
                      <span className="user-type-name">{type.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-row">
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
                  placeholder="Create password"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label terms-label">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            <button 
              type="submit" 
              className={`auth-btn btn-primary ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-hero-section">
          <div className="auth-hero-content">
            <div className="hero-illustration">
              <div className="signup-illustration">
                <div className="map-view">🗺️</div>
                <div className="location-pin">📍</div>
              </div>
            </div>
            <h2>Start Your Campus Journey</h2>
            <p>
              Join thousands of students and faculty who use Way2Valley to 
              navigate campus effortlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;