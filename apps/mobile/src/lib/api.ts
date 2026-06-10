import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_URL, API_TIMEOUT } from '../env';
import { getToken, clearTokens } from './auth';

/**
 * Axios instance configured for STNK mobile app
 * - Base URL from environment
 * - Auto-attach auth token to requests
 * - Handle 401 → redirect to login
 */
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor: attach auth token
 */
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor: handle errors
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear and let app redirect to login
      await clearTokens();
      // TODO: Emit event to redirect to login (implement via event bus or store)
    }

    if (!error.response) {
      // Network error
      return Promise.reject({
        code: 'NETWORK_ERROR',
        message: 'Network connection failed',
      });
    }

    // API error
    const apiError = error.response.data as any;
    return Promise.reject({
      code: apiError?.error?.code || 'API_ERROR',
      message: apiError?.error?.message || error.message,
      details: apiError?.error?.details,
      status: error.response.status,
    });
  }
);

export default api;
