
import axios, { InternalAxiosRequestConfig } from 'axios';

// Extend the axios request config type to include our custom properties
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
    _retryCount?: number;
  }
}

// Get the API URL from environment variable or use a fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://38.9.119.167:3000';

// Create axios instance with improved configuration
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Custom retry configuration (stored outside axios config)
const maxRetries = 3;
const retryDelay = 1000;

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
        originalRequest._retryCount < maxRetries) {
      
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      
      return api(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

// Initialize the retry count for all requests
api.interceptors.request.use((config) => {
  config._retryCount = 0;
  return config;
});

export default api;
