import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import { SkeletonCard } from '@/components/SkeletonCard';
import { AdminUserDashboard } from '@stnk/contracts';

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
      const response = await api.get<{ data: AdminUserDashboard }>(
        '/admin-user/dashboard'
      );
      setData(response.data.data);
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
        <View style={styles.header}>
          <Text style={styles.greeting}>Halo, {user?.email}</Text>
          <Text style={styles.subtitle}>Tenant Dashboard</Text>
        </View>

        {loading && !data ? (
          <>
            <SkeletonCard lines={2} height={80} />
            <SkeletonCard lines={3} height={120} />
          </>
        ) : data ? (
          <>
            <View style={styles.revenueCard}>
              <Text style={styles.revenueLabel}>Total Revenue (bulan ini)</Text>
              <Text style={styles.revenueAmount}>
                Rp {parseInt(data.total_revenue).toLocaleString('id-ID')}
              </Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>
                  {data.active_transactions}
                </Text>
                <Text style={styles.statLabel}>Berkas Aktif</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{data.done_transactions}</Text>
                <Text style={styles.statLabel}>Berkas Selesai</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>
                  {data.total_transactions}
                </Text>
                <Text style={styles.statLabel}>Total Berkas</Text>
              </View>
            </View>

            <View style={styles.actionsSection}>
              <Text style={styles.sectionTitle}>Aksi Cepat</Text>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('/transactions/new')}
              >
                <Text style={styles.actionIcon}>➕</Text>
                <View style={styles.actionContent}>
                  <Text style={styles.actionLabel}>Input Transaksi</Text>
                  <Text style={styles.actionDesc}>Tambah berkas baru</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('/transactions')}
              >
                <Text style={styles.actionIcon}>👁️</Text>
                <View style={styles.actionContent}>
                  <Text style={styles.actionLabel}>Lihat Berkas</Text>
                  <Text style={styles.actionDesc}>Daftar semua berkas</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F1E9' },
  content: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 24 },
  greeting: { color: '#16201D', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#8B572A', fontSize: 14, marginTop: 4 },
  revenueCard: {
    backgroundColor: '#174B3B',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  revenueLabel: { color: '#BED0CA', fontSize: 13, fontWeight: '600' },
  revenueAmount: { color: '#FFFFFF', fontSize: 28, fontWeight: '700', marginTop: 8 },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D5CDBF',
  },
  statNumber: { color: '#174B3B', fontSize: 20, fontWeight: '700' },
  statLabel: { color: '#65706B', fontSize: 12, marginTop: 4 },
  actionsSection: { marginTop: 20 },
  sectionTitle: {
    color: '#16201D',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D5CDBF',
    alignItems: 'center',
  },
  actionIcon: { fontSize: 24, marginRight: 12 },
  actionContent: { flex: 1 },
  actionLabel: { color: '#16201D', fontWeight: '600', fontSize: 15 },
  actionDesc: { color: '#65706B', fontSize: 13, marginTop: 2 },
});
