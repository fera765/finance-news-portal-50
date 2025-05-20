
import axios from 'axios';

// Extend the axios request config type to include our custom properties
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
    _retryCount?: number;
  }
}

// Get the API URL from environment variable or use a fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance with improved configuration
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Increased timeout to 15 seconds
});

// Custom retry configuration (stored outside axios config)
const maxRetries = 3;
const retryDelay = 1500; // Increased delay between retries

// Add a request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('financeNewsAuthToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
    
    // Check if the response is from login or user data and contains a banned status
    if (
      (response.config.url?.includes('/login') || 
       response.config.url?.includes('/users')) && 
      response.data?.status === 'banned'
    ) {
      const error = new Error('Esta conta foi suspensa. Entre em contato com o suporte.');
      error.name = 'AccountBannedError';
      return Promise.reject(error);
    }
    
    return response;
  },
  async error => {
    const originalRequest = error.config;
    
    // Log detailed error information
    console.error('API Error:', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      message: error.message,
      responseData: error.response?.data,
      retryCount: originalRequest?._retryCount || 0
    });
    
    // If the error is a network error or timeout, retry
    if ((error.message === 'Network Error' || error.code === 'ECONNABORTED') && 
        originalRequest._retry !== true && 
        (originalRequest._retryCount || 0) < maxRetries) {
      
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      console.log(`Retrying request (${originalRequest._retryCount}/${maxRetries}): ${originalRequest.url}`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      
      return api(originalRequest);
    }
    
    // User friendly error message based on error type
    if (error.message === 'Network Error') {
      error.userMessage = 'Não foi possível conectar ao servidor. Verifique se o JSON Server está em execução.';
    } else if (error.code === 'ECONNABORTED') {
      error.userMessage = 'A requisição demorou muito tempo. Por favor, tente novamente.';
    } else if (error.response?.status === 401) {
      error.userMessage = 'Credenciais inválidas ou sessão expirada.';
    } else if (error.response?.status === 403) {
      error.userMessage = 'Você não tem permissão para acessar este recurso.';
    } else if (error.response?.status === 404) {
      error.userMessage = 'O recurso solicitado não foi encontrado.';
    } else if (error.response?.status >= 500) {
      error.userMessage = 'Erro no servidor. Por favor, tente novamente mais tarde.';
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
