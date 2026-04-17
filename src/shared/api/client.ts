import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { normalizeApiError } from './errors';
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from '../lib/auth-tokens';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ticketsystem.braverto.com';
let isAuthRedirectInProgress = false;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

const refreshApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
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
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    console.error('API Error:', error.response?.data);

    const status = error.response?.status;
    const isUnauthorized = status === 401;

    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh');

    if (
      isUnauthorized &&
      originalRequest &&
      !isRefreshRequest &&
      originalRequest._retry !== true
    ) {
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        originalRequest._retry = true;

        try {
          const refreshResponse = await refreshApi.post<{
            accessToken: string;
            refreshToken: string;
          }>('/auth/refresh', { refreshToken });

          if (
            refreshResponse.data.accessToken &&
            refreshResponse.data.refreshToken
          ) {
            setAuthTokens({
              accessToken: refreshResponse.data.accessToken,
              refreshToken: refreshResponse.data.refreshToken,
            });

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
            }

            return api.request(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }
    }

    if (
      isUnauthorized &&
      typeof window !== 'undefined' &&
      !isAuthRedirectInProgress
    ) {
      isAuthRedirectInProgress = true;
      clearAuthTokens();

      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }

    return Promise.reject(normalizeApiError(error));
  },
);

export default api;
