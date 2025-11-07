import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery, selectedType);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedType('');
    onSearch('', '');
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Search for classrooms, libraries, buildings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        
        <div className="filter-group">
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="type-filter"
          >
            <option value="">All Types</option>
            <option value="classroom">Classrooms</option>
            <option value="library">Libraries</option>
            <option value="cafeteria">Food Courts</option>
            <option value="administration">Administration</option>
            <option value="sports">Sports</option>
            <option value="dormitory">Dormitories</option>
            <option value="parking">Parking</option>
          </select>
          
          {(searchQuery || selectedType) && (
            <button 
              type="button" 
              onClick={handleClear}
              className="clear-button"
            >
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;