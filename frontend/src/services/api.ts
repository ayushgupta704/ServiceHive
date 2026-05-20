import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

export const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // important for cookies (refresh token)
});

// Request interceptor: attach access token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 and silent refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is canceled (from AbortController)
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // Network error (Server down, CORS, etc.)
    if (!error.response) {
      toast.error('Network Error: Please check your connection.');
      return Promise.reject(error);
    }
    
    // If it's a 401, not a retry, and not an auth endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/')
    ) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token using the httpOnly cookie
        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        const { user, accessToken } = refreshResponse.data.data;
        
        // Update store
        useAuthStore.getState().setAuth(user, accessToken);
        
        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, user must log in again
        useAuthStore.getState().logout();
        toast.error('Session expired. Please log in again.');
        return Promise.reject(refreshError);
      }
    }
    
    // Handle 500 Server Errors globally
    if (error.response?.status >= 500) {
      toast.error('A server error occurred. Please try again later.');
    }

    return Promise.reject(error);
  }
);
