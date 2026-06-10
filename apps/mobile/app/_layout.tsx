import React, { useEffect, useState } from 'react';
import { Stack, useRootNavigationState } from 'expo-router';
import { getToken } from '../src/lib/auth';
import { useAuthStore } from '../src/stores/authStore';

export default function RootLayout() {
  const rootNavigationState = useRootNavigationState();
  const [isLoaded, setIsLoaded] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        if (token) {
          setAuthenticated(true);
        }
      } catch (err) {
        console.error('[RootLayout] Auth check failed:', err);
      } finally {
        setIsLoaded(true);
      }
    };

    checkAuth();
  }, [setAuthenticated]);

  useEffect(() => {
    if (isLoaded) {
      // Expo Router handles splash screen automatically in v56
    }
  }, [isLoaded]);

  if (!isLoaded || !rootNavigationState?.key) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen name="(app)" options={{ gestureEnabled: false }} />
      ) : (
        <Stack.Screen name="auth" options={{ gestureEnabled: false }} />
      )}
    </Stack>
  );
}
