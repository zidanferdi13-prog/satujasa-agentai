import React from 'react';
import { ColorValue, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { colors, typography } from '@/theme/designTokens';

export default function AppLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.snow },
        headerTitleStyle: {
          color: colors.ink,
          fontWeight: typography.weights.medium,
          fontSize: typography.sizes.subheading,
        },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.mondayViolet,
        tabBarInactiveTintColor: colors.slate,
        tabBarStyle: {
          backgroundColor: colors.snow,
          borderTopColor: colors.fog,
          borderTopWidth: 1,
          paddingBottom: 4,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: typography.sizes.caption,
          fontWeight: typography.weights.medium,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }: { color: ColorValue }) => <Text style={{ color, fontSize: 22 }}>📊</Text>,
        }}
      />
      <Tabs.Screen
        name="transactions/index"
        options={{
          title: 'Berkas',
          tabBarLabel: 'Berkas',
          tabBarIcon: ({ color }: { color: ColorValue }) => <Text style={{ color, fontSize: 22 }}>📋</Text>,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Harga',
          tabBarLabel: 'Harga',
          tabBarIcon: ({ color }: { color: ColorValue }) => <Text style={{ color, fontSize: 22 }}>💰</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Pengaturan',
          tabBarLabel: 'Pengaturan',
          tabBarIcon: ({ color }: { color: ColorValue }) => <Text style={{ color, fontSize: 22 }}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}
