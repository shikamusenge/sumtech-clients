import axios from "axios";
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Create basic Axios instance without auth headers
export const SERVER = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // For cookie-based auth
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  
  // Add request interceptor to dynamically add token if needed
  SERVER.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `${token}`;
    }
    return config;
  });

