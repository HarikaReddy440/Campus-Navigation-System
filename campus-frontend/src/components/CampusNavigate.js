import React, { useState } from 'react';
import './CampusNavigation.css';

const CampusNavigation = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    // Buildings with exact coordinates
    const knownLocations = [
        { name: "ECE BLOCK", position: [14.334392194449622, 78.54201963834119] },
        { name: "CSE BLOCK", position: [14.336003385475463, 78.54196599416507] },
        { name: "MME BLOCK", position: [14.337572986243002, 78.54214838437512] },
        { name: "Mechanical Block", position: [14.336502332606262, 78.54416540552158] },
        { name: "Civil Block", position: [14.334922329549403, 78.54373625208616] },
        { name: "RKV Ground", position: [14.337275342920154, 78.53767537163152] },
        { name: "OLD Campus Girls Hostel 1", position: [14.338501641019192, 78.53871969868588] }
    ];

    // Building aliases for better Google Maps search
    const buildingAliases = {
        "IQAC": "Internal Quality Assurance Cell R K Valley College",
        "SBH BANK": "State Bank of Hyderabad R K Valley College", 
        "MECHANICAL WORKSHOP": "Mechanical Workshop R K Valley College",
        "LAB COMPLEX": "Laboratory Complex R K Valley College",
        "POWER HOUSE": "Power Station R K Valley College",
        "STUDENT ACTIVITY CENTER": "Student Center R K Valley College",
        "DIRECTOR HOUSE": "Director Residence R K Valley College",
        "CHANCELLOR HOUSE": "Chancellor Residence R K Valley College",
        "MALLELAMA TEMPLE": "Temple R K Valley College",
        "POST OFFICE": "Post Office R K Valley College",
        "RKV HOSPITAL": "Hospital R K Valley College",
        "RKV POLICE STATION": "Police Station R K Valley College"
    };

    // All campus buildings
    const allBuildings = [
        "CSE BLOCK", "ECE BLOCK", "MME BLOCK", "Mechanical Block", "Civil Block",
        "Chemical Block", "EEE BLOCK", "ACADEMIC BLOCK 1", "ACADEMIC BLOCK 2",
        "CENTRAL LIBRARY", "MECHANICAL WORKSHOP", "LAB COMPLEX", "GUEST HOUSE",
        "POWER HOUSE", "IQAC", "SBH BANK", "STUDENT ACTIVITY CENTER", 
        "MESS 1", "MESS 2", "MESS 3", "MESS 4", "MESS 5", "MESS 6", "MESS 7", "MESS 8",
        "MALLELAMA TEMPLE", "DIRECTOR HOUSE", "CHANCELLOR HOUSE", "SPORTS COMPLEX", 
        "POST OFFICE", "RKV HOSPITAL", "RKV POLICE STATION", "RKV GROUND", 
        "BOYS HOSTEL 1", "BOYS HOSTEL 2", "GIRLS HOSTEL 1", "GIRLS HOSTEL 2", 
        "OLD Campus Girls Hostel 1", "OLD Campus Girls Hostel 2"
    ];

    const handleSearch = (query) => {
        setSearchQuery(query);
        
        if (query.length > 1) {
            const filtered = allBuildings.filter(building =>
                building.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 8));
        } else {
            setSuggestions([]);
        }
    };

    const navigateToBuilding = (buildingName) => {
        if (!buildingName || buildingName.trim() === '') {
            alert('Please enter a building name');
            return;
        }

        // Check if we have exact coordinates
        const knownBuilding = knownLocations.find(b => 
            b.name.toLowerCase() === buildingName.toLowerCase()
        );
        
        if (knownBuilding) {
            // Use exact coordinates for precise navigation
            const [lat, lng] = knownBuilding.position;
            const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
            window.open(url, '_blank');
        } else {
            // Use alias if available, otherwise use building name with college
            const alias = buildingAliases[buildingName.toUpperCase()];
            const searchQuery = alias || `${buildingName}, R K Valley College`;
            const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(searchQuery)}&travelmode=walking`;
            window.open(url, '_blank');
        }
        
        setSearchQuery('');
        setSuggestions([]);
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim() === '') {
            alert('Please enter a building name to search');
            return;
        }
        navigateToBuilding(searchQuery);
    };

    return (
        <div className="campus-navigation">
            <h2>🎓 Campus Navigation</h2>
            <p className="subtitle">Search any building - uses college name for better results</p>
            
            <div className="search-container">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                        placeholder="Try: IQAC, Library, Hostel..."
                        className="search-input"
                    />
                    <button onClick={handleSearchSubmit} className="search-button">
                        🚀 Navigate
                    </button>
                </div>
                
                {suggestions.length > 0 && (
                    <div className="suggestions">
                        {suggestions.map((building, index) => (
                            <div
                                key={index}
                                className="suggestion-item"
                                onClick={() => navigateToBuilding(building)}
                            >
                                <span className="building-name">{building}</span>
                                {knownLocations.find(b => b.name === building) && (
                                    <span className="precision-badge">📍 Precise</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="instructions">
                <h4>💡 Tip: If a building is not found</h4>
                <p>Try searching for the main areas first:</p>
                <div className="tip-buttons">
                    <button onClick={() => navigateToBuilding('Academic Block 1')}>Academic Blocks</button>
                    <button onClick={() => navigateToBuilding('Central Library')}>Library</button>
                    <button onClick={() => navigateToBuilding('Sports Complex')}>Sports Area</button>
                    <button onClick={() => navigateToBuilding('Hostel')}>Hostel Zone</button>
                </div>
            </div>
        </div>
    );
};

export default CampusNavigation;