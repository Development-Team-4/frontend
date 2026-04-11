import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { normalizeApiError } from './errors';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ticketsystem.braverto.com';
let isAuthRedirectInProgress = false;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('API Request Interceptor Error:', error);
    return Promise.reject(normalizeApiError(error));
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.error('API Error:', error.response?.data);

    const isUnauthorized =
      error.response?.status === 401 || error.response?.status === 403;

    if (
      isUnauthorized &&
      typeof window !== 'undefined' &&
      !isAuthRedirectInProgress
    ) {
      isAuthRedirectInProgress = true;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }

    return Promise.reject(normalizeApiError(error));
  },
);

export default api;
