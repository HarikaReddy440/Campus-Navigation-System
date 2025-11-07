// campusLocations.js
const campusLocations = [
  {
    id: '1',
    name: 'Main Gate - Entry',
    lat: 14.334000,
    lng: 78.538500,
    description: 'Main campus entrance gate',
    type: 'entrance'
  },
  {
    id: '2',
    name: 'ACADEMIC BLOCK 1',
    lat: 14.334968,
    lng: 78.536993,
    description: 'Main academic building - Block 1',
    type: 'academic'
  },
  {
    id: '3',
    name: 'ACADEMIC BLOCK 2',
    lat: 14.335212,
    lng: 78.539975,
    description: 'Main academic building - Block 2',
    type: 'academic'
  },
  {
    id: '4',
    name: 'CENTRAL LIBRARY',
    lat: 14.335734,
    lng: 78.538381,
    description: 'Main library with study areas',
    type: 'academic'
  },
  {
    id: '5',
    name: 'Computer Center',
    lat: 14.336280,
    lng: 78.539276,
    description: 'Computer center and IT department',
    type: 'academic'
  },
  {
    id: '6',
    name: 'LAB COMPLEX',
    lat: 14.336225,
    lng: 78.538080,
    description: 'Central laboratory complex',
    type: 'academic'
  },
  {
    id: '7',
    name: 'MECHANICAL WORKSHOP',
    lat: 14.336195,
    lng: 78.538857,
    description: 'Mechanical engineering workshops',
    type: 'academic'
  },
  {
    id: '8',
    name: 'CSE BLOCK',
    lat: 14.336055,
    lng: 78.541580,
    description: 'Computer Science and Engineering Department',
    type: 'academic'
  },
  {
    id: '9',
    name: 'EEE BLOCK',
    lat: 14.336897,
    lng: 78.542637,
    description: 'Electrical and Electronics Engineering',
    type: 'academic'
  },
  {
    id: '10',
    name: 'Chemical Block',
    lat: 14.335252,
    lng: 78.542771,
    description: 'Chemical Engineering Department',
    type: 'academic'
  },
  {
    id: '11',
    name: 'Civil Block',
    lat: 14.335202,
    lng: 78.543589,
    description: 'Civil Engineering Department',
    type: 'academic'
  },
  {
    id: '12',
    name: 'Mechanical Block',
    lat: 14.336426,
    lng: 78.543423,
    description: 'Mechanical Engineering Department',
    type: 'academic'
  },
  {
    id: '13',
    name: 'ECE BLOCK',
    lat: 14.334339,
    lng: 78.541674,
    description: 'Electronics and Communication Engineering',
    type: 'academic'
  },
  {
    id: '14',
    name: 'MME BLOCK',
    lat: 14.337449,
    lng: 78.541580,
    description: 'Metallurgical and Materials Engineering',
    type: 'academic'
  },
  {
    id: '15',
    name: 'Boys Hostel 1',
    lat: 14.334201,
    lng: 78.536894,
    description: 'Primary boys accommodation block',
    type: 'hostel'
  },
  {
    id: '16',
    name: 'Boys Hostel 2',
    lat: 14.334578,
    lng: 78.540433,
    description: 'Secondary boys accommodation block',
    type: 'hostel'
  },
  {
    id: '17',
    name: 'Girls Hostel 1',
    lat: 14.334410,
    lng: 78.538021,
    description: 'Primary girls accommodation block',
    type: 'hostel'
  },
  {
    id: '18',
    name: 'Girls Hostel 2',
    lat: 14.334626,
    lng: 78.538733,
    description: 'Secondary girls accommodation block',
    type: 'hostel'
  },
  {
    id: '19',
    name: 'MESS(1,2,3,4)',
    lat: 14.333798,
    lng: 78.538112,
    description: 'Mess blocks 1-4 for students',
    type: 'facility'
  },
  {
    id: '20',
    name: 'MESS(5,6,7,8)',
    lat: 14.333778,
    lng: 78.538997,
    description: 'Mess blocks 5-8 for students',
    type: 'facility'
  },
  {
    id: '21',
    name: 'IQAC',
    lat: 14.336845,
    lng: 78.540403,
    description: 'Internal Quality Assurance Cell',
    type: 'administrative'
  },
  {
    id: '22',
    name: 'Student Activity Center',
    lat: 14.338162,
    lng: 78.540100,
    description: 'Student clubs and activities',
    type: 'facility'
  },
  {
    id: '23',
    name: 'RKV GROUND',
    lat: 14.337277,
    lng: 78.537297,
    description: 'Sports ground',
    type: 'sports'
  },
  {
    id: '24',
    name: 'RKV POLICE STATION',
    lat: 14.337865,
    lng: 78.536239,
    description: 'Local police station',
    type: 'external'
  },
  {
    id: '25',
    name: 'Old Hostel Girls Hostel 1',
    lat: 14.338501,
    lng: 78.538719,
    description: 'Original girls hostel building',
    type: 'hostel'
  },
  {
    id: '26',
    name: 'Old Campus Girls Hostel 2',
    lat: 14.338269,
    lng: 78.536889,
    description: 'Older accommodation for female students',
    type: 'hostel'
  },
  {
    id: '27',
    name: 'DIRECTOR HOUSE',
    lat: 14.337864,
    lng: 78.531434,
    description: 'Director\'s residence',
    type: 'administrative'
  },
  {
    id: '28',
    name: 'CHANCELLOR HOUSE',
    lat: 14.338134,
    lng: 78.531455,
    description: 'Chancellor\'s residence',
    type: 'administrative'
  },
  {
    id: '29',
    name: 'RKV HOSPITAL',
    lat: 14.337230,
    lng: 78.532539,
    description: 'Local hospital',
    type: 'external'
  },
  {
    id: '30',
    name: 'MALLELAMA TEMPLE',
    lat: 14.337122,
    lng: 78.533270,
    description: 'Campus temple',
    type: 'religious'
  },
  {
    id: '31',
    name: 'POST OFFICE',
    lat: 14.337199,
    lng: 78.533624,
    description: 'Campus post office',
    type: 'commercial'
  },
  {
    id: '32',
    name: 'SBH bank',
    lat: 14.337307,
    lng: 78.534577,
    description: 'State Bank of Hyderabad branch',
    type: 'commercial'
  },
  {
    id: '33',
    name: 'RGUKT RKV Supermarket',
    lat: 14.337313,
    lng: 78.534002,
    description: 'Campus Mart',
    type: 'commercial'
  },
  {
    id: '34',
    name: 'POWER HOUSE',
    lat: 14.335130,
    lng: 78.536508,
    description: 'Campus power station',
    type: 'facility'
  },
  {
    id: '35',
    name: 'GUEST HOUSE',
    lat: 14.332184,
    lng: 78.537342,
    description: 'Campus guest accommodation',
    type: 'administrative'
  }
];

module.exports = { campusLocations };