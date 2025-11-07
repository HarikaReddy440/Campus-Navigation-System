import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Sample campus locations data
  const campusLocations = [
    {
      id: 1,
      name: "Main Academic Block",
      type: "academic",
      description: "Central teaching building with classrooms and laboratories",
      position: [14.3358, 78.5402]
    },
    {
      id: 2, 
      name: "Central Library",
      type: "academic",
      description: "Digital library with study areas and computer lab",
      position: [14.3350, 78.5395]
    },
    {
      id: 3,
      name: "Student Hostels",
      type: "residential",
      description: "Student accommodation blocks A, B, C, D",
      position: [14.3365, 78.5388]
    },
    {
      id: 4,
      name: "Administration Building",
      type: "administrative",
      description: "Principal office and administrative departments",
      position: [14.3348, 78.5400]
    },
    {
      id: 5,
      name: "Main Auditorium",
      type: "facility",
      description: "Main auditorium for events and conferences",
      position: [14.3352, 78.5408]
    },
    {
      id: 6,
      name: "Sports Complex",
      type: "sports",
      description: "Sports ground and gymnasium",
      position: [14.3370, 78.5395]
    },
    {
      id: 7,
      name: "Cafeteria & Food Court",
      type: "facility",
      description: "Student dining area and food court",
      position: [14.3355, 78.5385]
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

      navigate(`/search?q=${encodeURIComponent(searchQuery)}`, {
        state: {
          results: filteredResults, // Pass the filtered results
          isLoading: false
        }
      });
    }
  };

  const quickAccessItems = [
    { icon: '🏛️', label: 'Academic Block', path: '/map?location=academic' },
    { icon: '📚', label: 'Library', path: '/map?location=library' },
    { icon: '🏠', label: 'Hostels', path: '/map?location=hostels' },
    { icon: '🏢', label: 'Admin Block', path: '/map?location=admin' },
    { icon: '🏟️', label: 'Auditorium', path: '/map?location=auditorium' },
    { icon: '⚽', label: 'Sports Complex', path: '/map?location=sports' },
    { icon: '🍽️', label: 'Cafeteria', path: '/map?location=cafeteria' },
    { icon: '🛒', label: 'Stores', path: '/map?location=stores' }
  ];

  const suggestions = [
    'Academic Block A',
    'Central Library',
    'Boys Hostel 1',
    'Girls Hostel 2',
    'Administration Building',
    'Main Auditorium',
    'Sports Ground',
    'Food Court'
  ];

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    
    // Filter locations for the clicked suggestion
    const filteredResults = campusLocations.filter(location =>
      location.name.toLowerCase().includes(suggestion.toLowerCase()) ||
      location.type.toLowerCase().includes(suggestion.toLowerCase()) ||
      location.description.toLowerCase().includes(suggestion.toLowerCase())
    );

    navigate(`/search?q=${encodeURIComponent(suggestion)}`, {
      state: {
        results: filteredResults,
        isLoading: false
      }
    });
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
                placeholder="Search for buildings, rooms, facilities..."
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
                <a
                  key={index}
                  href={item.path}
                  className="quick-access-item"
                  onClick={(e) => {
                    e.preventDefault();
                    // Pass the corresponding location data when clicking quick access
                    const locationData = campusLocations.find(
                      loc => loc.name.toLowerCase().includes(item.label.toLowerCase())
                    );
                    
                    if (locationData) {
                      navigate(item.path, {
                        state: {
                          selectedLocation: locationData
                        }
                      });
                    } else {
                      navigate(item.path);
                    }
                  }}
                >
                  <span className="quick-access-icon">{item.icon}</span>
                  <span className="quick-access-label">{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;