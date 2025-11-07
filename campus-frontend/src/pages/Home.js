import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Enhanced campus locations data matching your MapPage
  const campusLocations = [
    {
      id: '1',
      name: "Main Gate - Entry",
      type: "entrance",
      description: "Main campus entrance gate",
      coordinates: { lat: 14.334000, lng: 78.538500 },
      position: [14.334000, 78.538500]
    },
    {
      id: '2',
      name: "ACADEMIC BLOCK 1",
      type: "academic",
      description: "Main academic building - Block 1",
      coordinates: { lat: 14.334968, lng: 78.536993 },
      position: [14.334968, 78.536993]
    },
    {
      id: '3',
      name: "ACADEMIC BLOCK 2", 
      type: "academic",
      description: "Main academic building - Block 2",
      coordinates: { lat: 14.335212, lng: 78.539975 },
      position: [14.335212, 78.539975]
    },
    {
      id: '4',
      name: "CENTRAL LIBRARY",
      type: "academic",
      description: "Main library with study areas",
      coordinates: { lat: 14.335734, lng: 78.538381 },
      position: [14.335734, 78.538381]
    },
    {
      id: '5',
      name: "Computer Center",
      type: "academic",
      description: "Computer center and IT department",
      coordinates: { lat: 14.336280, lng: 78.539276 },
      position: [14.336280, 78.539276]
    },
    {
      id: '6',
      name: "CSE BLOCK",
      type: "academic",
      description: "Computer Science and Engineering Department",
      coordinates: { lat: 14.336055, lng: 78.541580 },
      position: [14.336055, 78.541580]
    },
    {
      id: '7',
      name: "Boys Hostel 1",
      type: "hostel",
      description: "Primary boys accommodation block",
      coordinates: { lat: 14.334201, lng: 78.536894 },
      position: [14.334201, 78.536894]
    },
    {
      id: '8',
      name: "Boys Hostel 2",
      type: "hostel", 
      description: "Secondary boys accommodation block",
      coordinates: { lat: 14.334578, lng: 78.540433 },
      position: [14.334578, 78.540433]
    },
    {
      id: '9',
      name: "Girls Hostel 1",
      type: "hostel",
      description: "Primary girls accommodation block",
      coordinates: { lat: 14.334410, lng: 78.538021 },
      position: [14.334410, 78.538021]
    },
    {
      id: '10',
      name: "Girls Hostel 2",
      type: "hostel",
      description: "Secondary girls accommodation block", 
      coordinates: { lat: 14.334626, lng: 78.538733 },
      position: [14.334626, 78.538733]
    },
    {
      id: '11',
      name: "MESS(1,2,3,4)",
      type: "facility",
      description: "Mess blocks 1-4 for students",
      coordinates: { lat: 14.333798, lng: 78.538112 },
      position: [14.333798, 78.538112]
    },
    {
      id: '12',
      name: "Student Activity Center",
      type: "facility",
      description: "Student clubs and activities",
      coordinates: { lat: 14.338162, lng: 78.540100 },
      position: [14.338162, 78.540100]
    },
    {
      id: '13',
      name: "RKV GROUND",
      type: "sports", 
      description: "Sports ground",
      coordinates: { lat: 14.337277, lng: 78.537297 },
      position: [14.337277, 78.537297]
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Filter locations based on search query
      const filteredResults = campusLocations.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // If we have results, navigate to map with the first result as destination
      if (filteredResults.length > 0) {
        navigate('/map', {
          state: {
            destination: filteredResults[0], // Set first result as destination
            searchResults: filteredResults,
            searchQuery: searchQuery
          }
        });
      } else {
        // If no results found, still navigate to map but show all locations
        navigate('/map', {
          state: {
            searchQuery: searchQuery,
            showAllLocations: true
          }
        });
      }
    }
  };

  const quickAccessItems = [
    { 
      icon: '🏛️', 
      label: 'Academic Block 1', 
      locationName: 'ACADEMIC BLOCK 1'
    },
    { 
      icon: '📚', 
      label: 'Central Library', 
      locationName: 'CENTRAL LIBRARY'
    },
    { 
      icon: '🏠', 
      label: 'Boys Hostel 1', 
      locationName: 'Boys Hostel 1'
    },
    { 
      icon: '🏠', 
      label: 'Girls Hostel 1', 
      locationName: 'Girls Hostel 1'
    },
    { 
      icon: '💻', 
      label: 'CSE Block', 
      locationName: 'CSE BLOCK'
    },
    { 
      icon: '⚽', 
      label: 'Sports Ground', 
      locationName: 'RKV GROUND'
    },
    { 
      icon: '🍽️', 
      label: 'Mess', 
      locationName: 'MESS(1,2,3,4)'
    },
    { 
      icon: '🎭', 
      label: 'Activity Center', 
      locationName: 'Student Activity Center'
    }
  ];

  const suggestions = [
    'ACADEMIC BLOCK 1',
    'ACADEMIC BLOCK 2',
    'CENTRAL LIBRARY',
    'Computer Center',
    'CSE BLOCK',
    'Boys Hostel 1',
    'Boys Hostel 2', 
    'Girls Hostel 1',
    'Girls Hostel 2',
    'MESS(1,2,3,4)',
    'Student Activity Center',
    'RKV GROUND',
    'Main Gate - Entry'
  ];

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    
    // Find the exact location for the suggestion
    const locationData = campusLocations.find(location =>
      location.name.toLowerCase() === suggestion.toLowerCase()
    );

    if (locationData) {
      navigate('/map', {
        state: {
          destination: locationData,
          searchQuery: suggestion
        }
      });
    }
  };

  // Handle quick access click
  const handleQuickAccessClick = (locationName) => {
    const locationData = campusLocations.find(location =>
      location.name.toLowerCase() === locationName.toLowerCase()
    );

    if (locationData) {
      navigate('/map', {
        state: {
          destination: locationData,
          fromHome: true
        }
      });
    } else {
      // Fallback: navigate to map without specific destination
      navigate('/map');
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <h1 className="hero-title">Welcome to Way2Valley</h1>
          <p className="hero-subtitle">Your Campus Navigation Companion</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="content-section">
        <div className="container">
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search for ACADEMIC BLOCK 1, CSE BLOCK, Hostels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              <button type="submit" className="search-btn">
                Search
              </button>

              {/* Search Suggestions */}
              {showSuggestions && searchQuery && filteredSuggestions.length > 0 && (
                <div className="search-suggestions active">
                  {filteredSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onMouseDown={() => handleSuggestionClick(suggestion)}
                    >
                      <span className="suggestion-icon">📍</span>
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Quick Access Section */}
          <div className="quick-access">
            <h2 className="quick-access-title">Quick Access</h2>
            <div className="quick-access-grid">
              {quickAccessItems.map((item, index) => (
                <button
                  key={index}
                  className="quick-access-item"
                  onClick={() => handleQuickAccessClick(item.locationName)}
                >
                  <span className="quick-access-icon">{item.icon}</span>
                  <span className="quick-access-label">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;