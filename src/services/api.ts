
import axios from 'axios';

// Get the API URL from environment variable or use a fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://38.9.119.167:3000';

// Create axios instance with improved configuration
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
  // Retry configuration
  retries: 3,
  retryDelay: 1000,
});

// Add a request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('financeNewsAuthToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // If the error is a network error or timeout, retry
    if ((error.message === 'Network Error' || error.code === 'ECONNABORTED') && 
        originalRequest._retry !== true && 
        originalRequest.retries > 0) {
      
      originalRequest._retry = true;
      originalRequest.retries -= 1;
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, originalRequest.retryDelay));
      
      return api(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

export default api;
