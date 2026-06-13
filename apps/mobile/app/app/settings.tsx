import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { clearTokens } from '@/lib/auth';
import { colors, spacing, radius, cardShadow, typography, themeStyles } from '@/theme/designTokens';

export default function SettingsScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Anda yakin ingin logout?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          try {
            await clearTokens();
            logout();
            router.replace('/auth/login');
          } catch (err) {
            Alert.alert('Error', 'Gagal logout');
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Pengaturan</Text>
          <Text style={styles.subtitle}>Akun & preferensi</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profil Pengguna</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || '-'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>No. HP</Text>
              <Text style={styles.infoValue}>{user?.phone || '-'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Role</Text>
              <Text style={styles.infoValue}>{user?.role || '-'}</Text>
            </View>
            {user?.tenant_id && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tenant ID</Text>
                <Text style={styles.infoValue}>{user.tenant_id.slice(0, 12)}...</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tentang Aplikasi</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Versi</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Platform</Text>
              <Text style={styles.infoValue}>Admin User</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.logoutButton, loggingOut && styles.buttonDisabled]}
            onPress={handleLogout}
            disabled={loggingOut}
          >
            <Text style={styles.logoutButtonText}>
              {loggingOut ? 'Sedang logout...' : 'Logout'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cloud },
  content: { padding: spacing[16], paddingBottom: spacing[32] },
  header: { marginBottom: spacing[24] },
  title: { color: colors.ink, fontSize: typography.sizes.subheading, fontWeight: typography.weights.bold },
  subtitle: { color: colors.slate, fontSize: typography.sizes.bodySm, marginTop: spacing[4] ?? 4 },
  section: { marginBottom: spacing[24] },
  sectionTitle: themeStyles.sectionTitle,
  infoCard: {
    backgroundColor: colors.snow,
    borderRadius: radius.cards,
    padding: spacing[16],
    ...cardShadow('default'),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[12] ?? 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.fog,
  },
  infoLabel: { color: colors.slate, fontSize: typography.sizes.bodySm },
  infoValue: { color: colors.ink, fontWeight: typography.weights.medium, fontSize: typography.sizes.bodySm },
  logoutButton: {
    backgroundColor: colors.error,
    paddingVertical: 14,
    borderRadius: radius.buttons,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  logoutButtonText: { color: colors.snow, fontWeight: typography.weights.bold, fontSize: typography.sizes.body },
});
