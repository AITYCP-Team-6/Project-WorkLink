import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Connects to Spring Boot
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the Token if logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;