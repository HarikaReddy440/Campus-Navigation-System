import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
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
                      onMouseDown={() => {
                        setSearchQuery(suggestion);
                        navigate(`/search?q=${encodeURIComponent(suggestion)}`);
                      }}
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
                    navigate(item.path);
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