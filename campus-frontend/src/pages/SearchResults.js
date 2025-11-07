import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { locationsAPI } from '../services/api';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    sort: 'relevance'
  });

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await locationsAPI.search(searchQuery);
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    }
    setLoading(false);
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'academic', label: 'Academic' },
    { value: 'library', label: 'Library' },
    { value: 'cafeteria', label: 'Food & Dining' },
    { value: 'sports', label: 'Sports' }
  ];

  return (
    <div className="search-results-page">
      <div className="search-header">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search locations..."
            defaultValue={query}
            className="search-input"
          />
        </div>
      </div>

      <div className="results-info">
        <p>Showing {results.length} results for "{query}"</p>
      </div>

      {loading ? (
        <div className="results-loading">
          <div className="loading-spinner"></div>
          <p>Searching campus locations...</p>
        </div>
      ) : (
        <div className="results-container">
          {results.map(location => (
            <div key={location._id} className="result-card">
              <div className="result-icon">{getLocationIcon(location.type)}</div>
              
              <div className="result-content">
                <h3 className="result-name">{location.name}</h3>
                <p className="result-location">
                  📍 {location.building}
                </p>
                <p className="result-description">{location.description}</p>
                <div className="result-amenities">
                  {location.amenities?.slice(0, 3).map((amenity, index) => (
                    <span key={index} className="amenity-tag">{amenity}</span>
                  ))}
                </div>
              </div>
              
              <div className="result-actions">
                <Link to={`/map?location=${location._id}`} className="btn btn-primary">
                  View on Map
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to get icons based on location type
const getLocationIcon = (type) => {
  const icons = {
    academic: '🏫',
    library: '📚',
    cafeteria: '🍽️',
    sports: '⚽',
    administrative: '🏛️'
  };
  return icons[type] || '📍';
};

export default SearchResults;