// Environment variables
// Expo does not have process.env at runtime — use globalThis for EXPO_PUBLIC_ prefixed variables
const EXPO_PUBLIC_API_URL = (globalThis as { EXPO_PUBLIC_API_URL?: string }).EXPO_PUBLIC_API_URL;
export const API_URL = EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:4000/api/v1';
export const API_TIMEOUT = 30000; // 30 seconds

// SecureStore keys
export const TOKEN_KEY = 'stnk_access_token';
export const REFRESH_TOKEN_KEY = 'stnk_refresh_token';
