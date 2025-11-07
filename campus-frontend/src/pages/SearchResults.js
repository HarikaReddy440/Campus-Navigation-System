import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Safely get search results from location state
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  
  // Get results from location state, ensure it's an array
  const results = location.state?.results || [];
  const isLoading = location.state?.isLoading || false;
  const error = location.state?.error || null;

  // Sample campus locations for fallback
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
    }
  ];

  // Filter results based on search query
  const filteredResults = query ? 
    campusLocations.filter(location =>
      location.name.toLowerCase().includes(query.toLowerCase()) ||
      location.type.toLowerCase().includes(query.toLowerCase()) ||
      location.description.toLowerCase().includes(query.toLowerCase())
    ) : [];

  // Use actual results if available, otherwise use filtered results
  const displayResults = Array.isArray(results) && results.length > 0 ? results : filteredResults;

  const handleLocationClick = (location) => {
    navigate('/map', { 
      state: { 
        selectedLocation: location,
        searchLocation: location.name
      }
    });
  };

  const getLocationIcon = (type) => {
    const icons = {
      academic: '📚',
      residential: '🏠', 
      administrative: '🏛️',
      sports: '⚽',
      facility: '🏢'
    };
    return icons[type] || '📍';
  };

  if (isLoading) {
    return (
      <div className="search-results-container">
        <div className="container">
          <h1>Searching for "{query}"...</h1>
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-results-container">
        <div className="container">
          <h1>Search Results</h1>
          <div className="error-message">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="container">
        <h1>Search Results</h1>
        
        {query && (
          <p className="search-query">Showing results for: "<strong>{query}</strong>"</p>
        )}

        {displayResults.length === 0 ? (
          <div className="no-results">
            <h3>No results found for "{query}"</h3>
            <p>Try searching for:</p>
            <ul className="suggestions">
              <li>Academic Block</li>
              <li>Library</li>
              <li>Hostels</li>
              <li>Auditorium</li>
              <li>Sports Complex</li>
            </ul>
          </div>
        ) : (
          <div className="results-grid">
            {displayResults.map((result) => (
              <div 
                key={result.id} 
                className="result-card"
                onClick={() => handleLocationClick(result)}
              >
                <div className="result-icon">
                  {getLocationIcon(result.type)}
                </div>
                <div className="result-content">
                  <h3 className="result-name">{result.name}</h3>
                  <p className="result-type">{result.type}</p>
                  <p className="result-description">{result.description}</p>
                </div>
                <button className="view-on-map-btn">
                  View on Map →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;