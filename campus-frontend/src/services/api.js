import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
};

export const locationsAPI = {
  getAll: () => API.get('/locations'),
  search: (query) => API.get(`/locations/search?q=${query}`),
};

export const seedAPI = {
  addSampleData: () => API.post('/seed'),
};

export default API;