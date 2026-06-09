import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useRootNavigationState } from 'expo-router';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-splash-screen';
import { getToken } from '../src/lib/auth';
import { useAuthStore } from '../src/stores/authStore';

// Keep splash screen visible while we load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const [isLoaded, setIsLoaded] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

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

    if (fontsLoaded) {
      checkAuth();
    }
  }, [fontsLoaded, setAuthenticated]);

  useEffect(() => {
    if (isLoaded && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded, fontsLoaded]);

  if (!isLoaded || !fontsLoaded || !rootNavigationState?.key) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
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
