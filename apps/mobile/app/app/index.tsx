import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import { SkeletonCard } from '@/components/SkeletonCard';
import { AdminUserDashboard } from '@/contracts';
import { colors, spacing, radius, cardShadow, typography, themeStyles } from '@/theme/designTokens';

export default function DashboardScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [data, setData] = useState<AdminUserDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      setError(null);
      const response = await api.get<AdminUserDashboard>(
        '/admin-user/dashboard'
      );
      setData(response.data);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  if (loading && !data) {
    return <LoadingSpinner />;
  }

  if (error && !data) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState message={error} onRetry={fetchDashboard} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Greeting */}
        <View style={styles.greetingSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>
              {(user?.email?.[0] || 'U').toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.greeting}>Selamat datang,</Text>
            <Text style={styles.userEmail}>{user?.email || 'User'}</Text>
          </View>
        </View>

        {loading && !data ? (
          <>
            <SkeletonCard lines={2} height={80} />
            <SkeletonCard lines={3} height={120} />
          </>
        ) : data ? (
          <>
            {/* Revenue Card */}
            <View style={styles.revenueCard}>
              <View style={styles.revenueTop}>
                <Text style={styles.revenueLabel}>Pendapatan Bulan Ini</Text>
                <View style={styles.revenuePill}>
                  <Text style={styles.revenuePillText}>Total</Text>
                </View>
              </View>
              <Text style={styles.revenueAmount}>
                Rp {parseInt(data.total_revenue).toLocaleString('id-ID')}
              </Text>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={[styles.statBox, { backgroundColor: colors.periwinkle }]}>
                <Text style={styles.statNumber}>{data.active_transactions}</Text>
                <Text style={styles.statLabel}>Berkas Aktif</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: colors.mint }]}>
                <Text style={styles.statNumber}>{data.done_transactions}</Text>
                <Text style={styles.statLabel}>Selesai</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: colors.sky }]}>
                <Text style={styles.statNumber}>{data.total_transactions}</Text>
                <Text style={styles.statLabel}>Total Berkas</Text>
              </View>
            </View>

            {/* Quick Actions */}
            <Text style={themeStyles.sectionTitle}>Aksi Cepat</Text>
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: colors.lavender }]}
                onPress={() => router.push('/transactions/new')}
              >
                <Text style={styles.actionEmoji}>➕</Text>
                <Text style={styles.actionLabel}>Input Berkas</Text>
                <Text style={styles.actionDesc}>Tambah berkas baru</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: colors.aqua }]}
                onPress={() => router.push('/transactions')}
              >
                <Text style={styles.actionEmoji}>📋</Text>
                <Text style={styles.actionLabel}>Lihat Berkas</Text>
                <Text style={styles.actionDesc}>Daftar semua berkas</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cloud },
  content: { padding: spacing[16], paddingBottom: spacing[32] },
  greetingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[24],
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.mondayViolet,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[16],
  },
  avatarLetter: {
    fontSize: typography.sizes.subheading,
    fontWeight: typography.weights.bold,
    color: colors.snow,
  },
  greeting: {
    fontSize: typography.sizes.bodySm,
    color: colors.slate,
  },
  userEmail: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
    color: colors.ink,
    marginTop: 2,
  },
  revenueCard: {
    backgroundColor: colors.snow,
    borderRadius: radius.cards,
    padding: spacing[24],
    marginBottom: spacing[16],
    ...cardShadow('default'),
  },
  revenueTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[12] ?? 12,
  },
  revenueLabel: {
    fontSize: typography.sizes.bodySm,
    color: colors.slate,
    fontWeight: typography.weights.medium,
  },
  revenuePill: {
    backgroundColor: colors.mint,
    borderRadius: radius.badges,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  revenuePillText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
    color: colors.forest,
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: typography.weights.bold,
    color: colors.ink,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing[12] ?? 12,
    marginBottom: spacing[24],
  },
  statBox: {
    flex: 1,
    borderRadius: radius.cards,
    padding: spacing[16],
    ...cardShadow('default'),
  },
  statNumber: {
    fontSize: 24,
    fontWeight: typography.weights.bold,
    color: colors.ink,
    marginBottom: spacing[8],
  },
  statLabel: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
    color: colors.slate,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing[16],
  },
  actionCard: {
    flex: 1,
    borderRadius: radius.cards,
    padding: spacing[20] ?? 20,
    ...cardShadow('default'),
  },
  actionEmoji: {
    fontSize: 28,
    marginBottom: spacing[12] ?? 12,
  },
  actionLabel: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
    color: colors.ink,
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: typography.sizes.caption,
    color: colors.slate,
  },
});
