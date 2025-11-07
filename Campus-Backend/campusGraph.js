// campusGraph.js
const campusGraph = {
  // Main Gate connections (Road 1)
  "Main Gate - Entry": {
    "ACADEMIC BLOCK 1": 120,
    "ACADEMIC BLOCK 2": 150,
    "CENTRAL LIBRARY": 180,
    "Boys Hostel 1": 200,
    "Girls Hostel 1": 220
  },

  // Academic Area (Central Road)
  "ACADEMIC BLOCK 1": {
    "Main Gate - Entry": 120,
    "ACADEMIC BLOCK 2": 80,
    "CENTRAL LIBRARY": 100,
    "POWER HOUSE": 60,
    "Boys Hostel 1": 150
  },
  "ACADEMIC BLOCK 2": {
    "Main Gate - Entry": 150,
    "ACADEMIC BLOCK 1": 80,
    "CENTRAL LIBRARY": 50,
    "Computer Center": 70,
    "LAB COMPLEX": 90
  },
  "CENTRAL LIBRARY": {
    "Main Gate - Entry": 180,
    "ACADEMIC BLOCK 1": 100,
    "ACADEMIC BLOCK 2": 50,
    "Computer Center": 40,
    "LAB COMPLEX": 60,
    "MECHANICAL WORKSHOP": 80
  },

  // Technical Blocks Road
  "Computer Center": {
    "ACADEMIC BLOCK 2": 70,
    "CENTRAL LIBRARY": 40,
    "LAB COMPLEX": 30,
    "MECHANICAL WORKSHOP": 50,
    "CSE BLOCK": 120
  },
  "LAB COMPLEX": {
    "ACADEMIC BLOCK 2": 90,
    "CENTRAL LIBRARY": 60,
    "Computer Center": 30,
    "MECHANICAL WORKSHOP": 40,
    "CSE BLOCK": 100
  },
  "MECHANICAL WORKSHOP": {
    "CENTRAL LIBRARY": 80,
    "Computer Center": 50,
    "LAB COMPLEX": 40,
    "CSE BLOCK": 90,
    "EEE BLOCK": 110
  },

  // Engineering Blocks Road
  "CSE BLOCK": {
    "Computer Center": 120,
    "LAB COMPLEX": 100,
    "MECHANICAL WORKSHOP": 90,
    "EEE BLOCK": 60,
    "Chemical Block": 80
  },
  "EEE BLOCK": {
    "MECHANICAL WORKSHOP": 110,
    "CSE BLOCK": 60,
    "Chemical Block": 50,
    "Civil Block": 70
  },
  "Chemical Block": {
    "CSE BLOCK": 80,
    "EEE BLOCK": 50,
    "Civil Block": 40,
    "Mechanical Block": 90
  },
  "Civil Block": {
    "EEE BLOCK": 70,
    "Chemical Block": 40,
    "Mechanical Block": 60,
    "ECE BLOCK": 120
  },
  "Mechanical Block": {
    "Chemical Block": 90,
    "Civil Block": 60,
    "ECE BLOCK": 100
  },
  "ECE BLOCK": {
    "Civil Block": 120,
    "Mechanical Block": 100,
    "Boys Hostel 2": 150,
    "IQAC": 80
  },

  // Hostel Area Road
  "Boys Hostel 1": {
    "Main Gate - Entry": 200,
    "ACADEMIC BLOCK 1": 150,
    "Girls Hostel 1": 80,
    "MESS(1,2,3,4)": 60
  },
  "Girls Hostel 1": {
    "Main Gate - Entry": 220,
    "ACADEMIC BLOCK 1": 180,
    "Boys Hostel 1": 80,
    "Girls Hostel 2": 50,
    "MESS(1,2,3,4)": 90
  },
  "Girls Hostel 2": {
    "Girls Hostel 1": 50,
    "MESS(1,2,3,4)": 70,
    "MESS(5,6,7,8)": 100
  },
  "Boys Hostel 2": {
    "ECE BLOCK": 150,
    "MESS(5,6,7,8)": 70,
    "IQAC": 120
  },

  // Mess Road
  "MESS(1,2,3,4)": {
    "Boys Hostel 1": 60,
    "Girls Hostel 1": 90,
    "Girls Hostel 2": 70,
    "MESS(5,6,7,8)": 120
  },
  "MESS(5,6,7,8)": {
    "Boys Hostel 2": 70,
    "Girls Hostel 2": 100,
    "MESS(1,2,3,4)": 120,
    "IQAC": 80
  },

  // Administrative Road
  "IQAC": {
    "Boys Hostel 2": 120,
    "MESS(5,6,7,8)": 80,
    "Student Activity Center": 150,
    "ECE BLOCK": 80
  },
  "Student Activity Center": {
    "IQAC": 150,
    "RKV GROUND": 100,
    "Old Hostel Girls Hostel 1": 120,
    "Old Campus Girls Hostel 2": 140
  },

  // Sports and Old Campus Road
  "RKV GROUND": {
    "Student Activity Center": 100,
    "RKV POLICE STATION": 60,
    "Old Hostel Girls Hostel 1": 80
  },
  "RKV POLICE STATION": {
    "RKV GROUND": 60,
    "Old Hostel Girls Hostel 1": 50,
    "Old Campus Girls Hostel 2": 70
  },
  "Old Hostel Girls Hostel 1": {
    "Student Activity Center": 120,
    "RKV GROUND": 80,
    "RKV POLICE STATION": 50,
    "Old Campus Girls Hostel 2": 40
  },
  "Old Campus Girls Hostel 2": {
    "Student Activity Center": 140,
    "RKV POLICE STATION": 70,
    "Old Hostel Girls Hostel 1": 40,
    "MME BLOCK": 200
  },

  // Outer Campus Road
  "MME BLOCK": {
    "Old Campus Girls Hostel 2": 200,
    "DIRECTOR HOUSE": 180,
    "CHANCELLOR HOUSE": 190
  },
  "DIRECTOR HOUSE": {
    "MME BLOCK": 180,
    "CHANCELLOR HOUSE": 30,
    "RKV HOSPITAL": 120,
    "MALLELAMA TEMPLE": 100
  },
  "CHANCELLOR HOUSE": {
    "MME BLOCK": 190,
    "DIRECTOR HOUSE": 30,
    "RKV HOSPITAL": 130,
    "MALLELAMA TEMPLE": 110
  },

  // Services Road
  "RKV HOSPITAL": {
    "DIRECTOR HOUSE": 120,
    "CHANCELLOR HOUSE": 130,
    "MALLELAMA TEMPLE": 50,
    "POST OFFICE": 70
  },
  "MALLELAMA TEMPLE": {
    "DIRECTOR HOUSE": 100,
    "CHANCELLOR HOUSE": 110,
    "RKV HOSPITAL": 50,
    "POST OFFICE": 40,
    "SBH bank": 60
  },
  "POST OFFICE": {
    "RKV HOSPITAL": 70,
    "MALLELAMA TEMPLE": 40,
    "SBH bank": 30
  },
  "SBH bank": {
    "MALLELAMA TEMPLE": 60,
    "POST OFFICE": 30,
    "RGUKT RKV Supermarket": 20
  },
  "RGUKT RKV Supermarket": {
    "SBH bank": 20,
    "POST OFFICE": 50
  },

  // Utility Road
  "POWER HOUSE": {
    "ACADEMIC BLOCK 1": 60,
    "GUEST HOUSE": 250
  },
  "GUEST HOUSE": {
    "POWER HOUSE": 250
  }
};

module.exports = { campusGraph };