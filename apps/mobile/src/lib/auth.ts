import * as SecureStore from 'expo-secure-store';
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '../env';

/**
 * Store access token in SecureStore
 */
export async function storeToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (err) {
    console.error('[Auth] Failed to store token:', err);
    throw new Error('Failed to store authentication token');
  }
}

/**
 * Retrieve access token from SecureStore
 */
export async function getToken(): Promise<string | null> {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    return token || null;
  } catch (err) {
    console.error('[Auth] Failed to retrieve token:', err);
    return null;
  }
}

/**
 * Store refresh token in SecureStore
 */
export async function storeRefreshToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (err) {
    console.error('[Auth] Failed to store refresh token:', err);
    throw new Error('Failed to store refresh token');
  }
}

/**
 * Retrieve refresh token from SecureStore
 */
export async function getRefreshToken(): Promise<string | null> {
  try {
    const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    return token || null;
  } catch (err) {
    console.error('[Auth] Failed to retrieve refresh token:', err);
    return null;
  }
}

/**
 * Clear all auth tokens from SecureStore
 */
export async function clearTokens(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (err) {
    console.error('[Auth] Failed to clear tokens:', err);
    // Don't throw — clearing is best-effort
  }
}
