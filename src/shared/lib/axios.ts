import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/features/auth/store/auth-store';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add Auth Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // In a real app, you might get the token from the store or cookies
    const token = localStorage.getItem('auth-storage'); // Zustand persist default
    if (token) {
      try {
        const parsed = JSON.parse(token);
        const accessToken = parsed.state?.user?.token; // Assuming token exists in user object
        if (accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (e) {
        console.error('Failed to parse auth token', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout on 401
      useAuthStore.getState().logout();
    }

    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);
