import React, { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';

export default function AppLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#F4F1E9' },
        headerTitleStyle: { color: '#16201D', fontWeight: '600' },
        tabBarActiveTintColor: '#174B3B',
        tabBarInactiveTintColor: '#8B572A',
        tabBarStyle: { backgroundColor: '#F4F1E9', borderTopColor: '#D5CDBF' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>📊</Text>,
        }}
      />
      <Tabs.Screen
        name="transactions/index"
        options={{
          title: 'Berkas',
          tabBarLabel: 'Berkas',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>📋</Text>,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Harga',
          tabBarLabel: 'Harga',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>💰</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Pengaturan',
          tabBarLabel: 'Pengaturan',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}
