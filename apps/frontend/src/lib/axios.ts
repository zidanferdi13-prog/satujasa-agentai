import axios from 'axios';
import { getToken, handleUnauthorizedRedirect } from '@/lib/auth';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:4000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const isAuth = error?.config?.url?.startsWith?.('/auth/');

    if (status === 401 && !isAuth && typeof window !== 'undefined') {
      handleUnauthorizedRedirect();
    }

    const message =
      error?.response?.data?.message ??
      error?.response?.data?.error ??
      error?.message ??
      'Terjadi kesalahan. Silakan coba lagi.';

    error.message = message;
    return Promise.reject(error);
  },
);

export default apiClient;
