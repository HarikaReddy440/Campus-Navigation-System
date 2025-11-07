// campusRoads.js
const campusRoads = {
  // Main Road from Gate to Academic Area
  "main_road_1": [
    [14.334000, 78.538500], // Main Gate
    [14.334200, 78.538400],
    [14.334500, 78.538200],
    [14.334800, 78.538000],
    [14.334968, 78.536993]  // ACADEMIC BLOCK 1
  ],
  
  "main_road_2": [
    [14.334000, 78.538500], // Main Gate
    [14.334300, 78.538700],
    [14.334600, 78.538900],
    [14.335000, 78.539200],
    [14.335212, 78.539975]  // ACADEMIC BLOCK 2
  ],

  // Academic Complex Roads
  "academic_road_1": [
    [14.334968, 78.536993], // ACADEMIC BLOCK 1
    [14.335100, 78.537500],
    [14.335300, 78.538000],
    [14.335500, 78.538500],
    [14.335734, 78.538381]  // CENTRAL LIBRARY
  ],

  "academic_road_2": [
    [14.335212, 78.539975], // ACADEMIC BLOCK 2
    [14.335400, 78.539600],
    [14.335600, 78.539300],
    [14.335734, 78.538381]  // CENTRAL LIBRARY
  ],

  "tech_road_1": [
    [14.335734, 78.538381], // CENTRAL LIBRARY
    [14.335900, 78.538600],
    [14.336100, 78.538800],
    [14.336280, 78.539276]  // Computer Center
  ],

  "tech_road_2": [
    [14.336280, 78.539276], // Computer Center
    [14.336200, 78.538500],
    [14.336225, 78.538080]  // LAB COMPLEX
  ],

  "tech_road_3": [
    [14.336280, 78.539276], // Computer Center
    [14.336150, 78.539800],
    [14.336195, 78.538857]  // MECHANICAL WORKSHOP
  ],

  // Engineering Blocks Road
  "engineering_road": [
    [14.336195, 78.538857], // MECHANICAL WORKSHOP
    [14.336300, 78.540000],
    [14.336400, 78.540500],
    [14.336500, 78.541000],
    [14.336055, 78.541580]  // CSE BLOCK
  ],

  "engineering_road_2": [
    [14.336055, 78.541580], // CSE BLOCK
    [14.336300, 78.541800],
    [14.336500, 78.542000],
    [14.336700, 78.542200],
    [14.336897, 78.542637]  // EEE BLOCK
  ],

  "engineering_road_3": [
    [14.336897, 78.542637], // EEE BLOCK
    [14.336000, 78.542800],
    [14.335500, 78.543000],
    [14.335252, 78.542771], // Chemical Block
    [14.335202, 78.543589], // Civil Block
    [14.336426, 78.543423]  // Mechanical Block
  ],

  // Hostel Area Roads
  "hostel_road_1": [
    [14.334968, 78.536993], // ACADEMIC BLOCK 1
    [14.334600, 78.537000],
    [14.334400, 78.537200],
    [14.334201, 78.536894]  // Boys Hostel 1
  ],

  "hostel_road_2": [
    [14.334201, 78.536894], // Boys Hostel 1
    [14.334300, 78.537500],
    [14.334410, 78.538021]  // Girls Hostel 1
  ],

  "hostel_road_3": [
    [14.334410, 78.538021], // Girls Hostel 1
    [14.334500, 78.538400],
    [14.334626, 78.538733]  // Girls Hostel 2
  ],

  "hostel_road_4": [
    [14.334626, 78.538733], // Girls Hostel 2
    [14.334400, 78.539000],
    [14.334339, 78.541674]  // ECE BLOCK
  ],

  // Mess Roads
  "mess_road_1": [
    [14.334201, 78.536894], // Boys Hostel 1
    [14.333900, 78.537500],
    [14.333798, 78.538112]  // MESS(1,2,3,4)
  ],

  "mess_road_2": [
    [14.334410, 78.538021], // Girls Hostel 1
    [14.334000, 78.538200],
    [14.333798, 78.538112]  // MESS(1,2,3,4)
  ],

  "mess_road_3": [
    [14.333798, 78.538112], // MESS(1,2,3,4)
    [14.333800, 78.538500],
    [14.333778, 78.538997]  // MESS(5,6,7,8)
  ],

  // Outer Campus Roads
  "outer_road_1": [
    [14.336897, 78.542637], // EEE BLOCK
    [14.337200, 78.542400],
    [14.337449, 78.541580]  // MME BLOCK
  ],

  "outer_road_2": [
    [14.337449, 78.541580], // MME BLOCK
    [14.337600, 78.540500],
    [14.337700, 78.539500],
    [14.337800, 78.538500],
    [14.338162, 78.540100]  // Student Activity Center
  ],

  "sports_road": [
    [14.338162, 78.540100], // Student Activity Center
    [14.337800, 78.539000],
    [14.337600, 78.538000],
    [14.337400, 78.537500],
    [14.337277, 78.537297]  // RKV GROUND
  ],

  // Administrative Area Roads
  "admin_road": [
    [14.337277, 78.537297], // RKV GROUND
    [14.337500, 78.536800],
    [14.337700, 78.536400],
    [14.337865, 78.536239]  // RKV POLICE STATION
  ],

  "old_hostel_road": [
    [14.337865, 78.536239], // RKV POLICE STATION
    [14.338000, 78.536500],
    [14.338200, 78.537000],
    [14.338300, 78.537500],
    [14.338400, 78.538000],
    [14.338501, 78.538719]  // Old Hostel Girls Hostel 1
  ],

  // Services Area Roads
  "services_road": [
    [14.338501, 78.538719], // Old Hostel Girls Hostel 1
    [14.338400, 78.538000],
    [14.338300, 78.537200],
    [14.338269, 78.536889]  // Old Campus Girls Hostel 2
  ],

  "director_road": [
    [14.338269, 78.536889], // Old Campus Girls Hostel 2
    [14.338000, 78.535000],
    [14.337800, 78.533500],
    [14.337700, 78.532500],
    [14.337864, 78.531434]  // DIRECTOR HOUSE
  ],

  "chancellor_road": [
    [14.337864, 78.531434], // DIRECTOR HOUSE
    [14.338000, 78.531500],
    [14.338134, 78.531455]  // CHANCELLOR HOUSE
  ],

  "hospital_road": [
    [14.337864, 78.531434], // DIRECTOR HOUSE
    [14.337500, 78.531800],
    [14.337300, 78.532200],
    [14.337230, 78.532539]  // RKV HOSPITAL
  ],

  "temple_road": [
    [14.337230, 78.532539], // RKV HOSPITAL
    [14.337200, 78.532800],
    [14.337150, 78.533100],
    [14.337122, 78.533270]  // MALLELAMA TEMPLE
  ],

  "commercial_road": [
    [14.337122, 78.533270], // MALLELAMA TEMPLE
    [14.337250, 78.533500],
    [14.337199, 78.533624], // POST OFFICE
    [14.337300, 78.534000],
    [14.337307, 78.534577], // SBH bank
    [14.337313, 78.534002]  // RGUKT RKV Supermarket
  ],

  // Utility Road
  "utility_road": [
    [14.334968, 78.536993], // ACADEMIC BLOCK 1
    [14.335000, 78.536700],
    [14.335130, 78.536508]  // POWER HOUSE
  ],

  "guest_road": [
    [14.335130, 78.536508], // POWER HOUSE
    [14.334500, 78.536800],
    [14.333800, 78.537000],
    [14.333000, 78.537200],
    [14.332184, 78.537342]  // GUEST HOUSE
  ]
};

// Road connections between locations
const roadConnections = {
  "Main Gate - Entry": ["main_road_1", "main_road_2"],
  "ACADEMIC BLOCK 1": ["main_road_1", "academic_road_1", "hostel_road_1", "utility_road"],
  "ACADEMIC BLOCK 2": ["main_road_2", "academic_road_2"],
  "CENTRAL LIBRARY": ["academic_road_1", "academic_road_2", "tech_road_1"],
  "Computer Center": ["tech_road_1", "tech_road_2", "tech_road_3"],
  "LAB COMPLEX": ["tech_road_2"],
  "MECHANICAL WORKSHOP": ["tech_road_3", "engineering_road"],
  "CSE BLOCK": ["engineering_road", "engineering_road_2"],
  "EEE BLOCK": ["engineering_road_2", "engineering_road_3", "outer_road_1"],
  "Chemical Block": ["engineering_road_3"],
  "Civil Block": ["engineering_road_3"],
  "Mechanical Block": ["engineering_road_3"],
  "ECE BLOCK": ["hostel_road_4"],
  "MME BLOCK": ["outer_road_1", "outer_road_2"],
  "Boys Hostel 1": ["hostel_road_1", "hostel_road_2", "mess_road_1"],
  "Girls Hostel 1": ["hostel_road_2", "hostel_road_3", "mess_road_2"],
  "Girls Hostel 2": ["hostel_road_3", "hostel_road_4"],
  "MESS(1,2,3,4)": ["mess_road_1", "mess_road_2", "mess_road_3"],
  "MESS(5,6,7,8)": ["mess_road_3"],
  "Student Activity Center": ["outer_road_2", "sports_road"],
  "RKV GROUND": ["sports_road", "admin_road"],
  "RKV POLICE STATION": ["admin_road", "old_hostel_road"],
  "Old Hostel Girls Hostel 1": ["old_hostel_road", "services_road"],
  "Old Campus Girls Hostel 2": ["services_road", "director_road"],
  "DIRECTOR HOUSE": ["director_road", "chancellor_road", "hospital_road"],
  "CHANCELLOR HOUSE": ["chancellor_road"],
  "RKV HOSPITAL": ["hospital_road", "temple_road"],
  "MALLELAMA TEMPLE": ["temple_road", "commercial_road"],
  "POST OFFICE": ["commercial_road"],
  "SBH bank": ["commercial_road"],
  "RGUKT RKV Supermarket": ["commercial_road"],
  "POWER HOUSE": ["utility_road", "guest_road"],
  "GUEST HOUSE": ["guest_road"]
};

module.exports = { campusRoads, roadConnections };