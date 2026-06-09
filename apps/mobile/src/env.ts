// Environment variables
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:4000/api/v1';
export const API_TIMEOUT = 30000; // 30 seconds

// SecureStore keys
export const TOKEN_KEY = 'stnk_access_token';
export const REFRESH_TOKEN_KEY = 'stnk_refresh_token';
