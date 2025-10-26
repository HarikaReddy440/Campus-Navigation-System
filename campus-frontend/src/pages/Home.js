// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  AppBar,
  Toolbar,
  Chip
} from '@mui/material';
import {
  Search,
  LocationOn,
  LibraryBooks,
  Restaurant,
  SportsBasketball,
  Business
} from '@mui/icons-material';
import { locationsAPI } from '../services/api';

const Home = () => {
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await locationsAPI.getAll();
      setLocations(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'library': return <LibraryBooks />;
      case 'cafeteria': return <Restaurant />;
      case 'sports': return <SportsBasketball />;
      case 'administrative': return <Business />;
      default: return <LocationOn />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'library': return 'primary';
      case 'cafeteria': return 'secondary';
      case 'sports': return 'error';
      case 'administrative': return 'success';
      default: return 'default';
    }
  };

  return (
    <div>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#2E7D32' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🗺️ Way2Valley
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Way2Valley
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            Your Smart Campus Navigation Companion
          </Typography>
          
          {/* Search Bar */}
          <Box sx={{ mt: 4, maxWidth: 600, mx: 'auto' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for buildings, departments, facilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{
                backgroundColor: 'white',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Quick Access */}
      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Quick Access
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {['Library', 'Cafeteria', 'Sports', 'Admin', 'Classes', 'Parking'].map((item) => (
            <Grid item xs={6} sm={4} md={2} key={item}>
              <Button
                variant="outlined"
                fullWidth
                sx={{ height: 80 }}
                onClick={() => setSearchQuery(item)}
              >
                {item}
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* Locations Grid */}
        <Typography variant="h4" component="h2" gutterBottom>
          Campus Locations
        </Typography>
        {loading ? (
          <Typography>Loading locations...</Typography>
        ) : (
          <Grid container spacing={3}>
            {locations.map((location) => (
              <Grid item xs={12} sm={6} md={4} key={location._id}>
                <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {getIcon(location.type)}
                      <Typography variant="h6" component="h3" sx={{ ml: 1 }}>
                        {location.name}
                      </Typography>
                    </Box>
                    
                    <Chip
                      label={location.type}
                      color={getColor(location.type)}
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    
                    <Typography color="text.secondary" gutterBottom>
                      {location.building}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {location.description}
                    </Typography>
                    
                    <Typography variant="caption" color="text.secondary">
                      📍 {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
                    </Typography>
                    
                    <Typography variant="caption" display="block" color="text.secondary">
                      🕒 {location.hours}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default Home;