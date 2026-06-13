import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { SkeletonCard } from '@/components/SkeletonCard';
import { TransactionStatus } from '@/contracts';
import { colors, spacing, radius, cardShadow, typography } from '@/theme/designTokens';

interface AdminUserTransaction {
  id: string;
  customer_name: string;
  customer_phone: string;
  vehicle_plate: string;
  service_id: string;
  service_name: string;
  status: TransactionStatus;
  total_cost: string;
  additional_cost: string;
  notes: string | null;
  monitoring_token: string;
  created_at: string;
  updated_at: string;
}

type TabType = 'active' | 'done' | 'cancelled';

const tabs: { key: TabType; label: string }[] = [
  { key: 'active', label: 'Aktif' },
  { key: 'done', label: 'Selesai' },
  { key: 'cancelled', label: 'Dibatalkan' },
];

function formatDateID(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
}

function formatCurrencyID(amount: string): string {
  return `Rp ${parseInt(amount).toLocaleString('id-ID')}`;
}

export default function TransactionsListScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [transactions, setTransactions] = useState<AdminUserTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const statusMap: Record<TabType, TransactionStatus[]> = {
    active: ['DRAFT', 'DOKUMEN_DITERIMA', 'PROSES_SAMSAT', 'MENUNGGU_PEMBAYARAN'],
    done: ['SELESAI'],
    cancelled: ['DIBATALKAN'],
  };

  const fetchTransactions = async (tabType: TabType, searchQuery: string = '') => {
    try {
      setError(null);
      const statusList = statusMap[tabType];
      const statusParam = statusList.join(',');

      const response = await api.get<{ data: AdminUserTransaction[] }>(
        '/admin-user/transactions',
        {
          params: {
            status: statusParam,
            search: searchQuery,
            page: 1,
            limit: 50,
          },
        }
      );
      setTransactions(response.data.data);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat berkas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions(activeTab, search);
  }, [activeTab]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions(activeTab, search);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    setLoading(true);
    fetchTransactions(activeTab, text);
  };

  const renderTransaction = ({ item }: { item: AdminUserTransaction }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/transactions/${item.id}`)}
    >
      <View style={styles.cardTop}>
        <Text style={styles.customerName}>{item.customer_name}</Text>
        <StatusBadge status={item.status} size="small" />
      </View>
      <View style={styles.cardMeta}>
        <Text style={styles.metaText}>{item.vehicle_plate}</Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaText}>{item.service_name}</Text>
      </View>
      <View style={styles.cardBottom}>
        <Text style={styles.cost}>{formatCurrencyID(item.total_cost)}</Text>
        <Text style={styles.date}>{formatDateID(item.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && transactions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (error && transactions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState message={error} onRetry={() => fetchTransactions(activeTab, search)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Search */}
      <View style={styles.searchSection}>
        <View style={styles.searchInputWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama atau plat..."
            placeholderTextColor={colors.iron}
            value={search}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Pill Tabs */}
      <View style={styles.tabRow}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabPill, activeTab === t.key && styles.tabPillActive]}
            onPress={() => setActiveTab(t.key)}
          >
            <Text
              style={[
                styles.tabPillText,
                activeTab === t.key && styles.tabPillTextActive,
              ]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {transactions.length === 0 ? (
        <EmptyState
          icon="📋"
          title="Tidak ada berkas"
          message={`Belum ada berkas ${activeTab === 'active' ? 'aktif' : activeTab === 'done' ? 'selesai' : 'dibatalkan'}`}
        />
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cloud },
  searchSection: {
    paddingHorizontal: spacing[16],
    paddingTop: spacing[12] ?? 12,
    paddingBottom: spacing[8],
  },
  searchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.snow,
    borderRadius: radius.inputs,
    borderWidth: 1,
    borderColor: colors.pebble,
    paddingHorizontal: spacing[12] ?? 12,
  },
  searchIcon: { fontSize: 16, marginRight: spacing[8] },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: typography.sizes.bodySm,
    color: colors.ink,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[8],
    gap: spacing[8],
  },
  tabPill: {
    borderRadius: radius.full,
    paddingHorizontal: spacing[16],
    paddingVertical: 8,
    backgroundColor: colors.snow,
    borderWidth: 1,
    borderColor: colors.pebble,
  },
  tabPillActive: {
    backgroundColor: colors.mondayViolet,
    borderColor: colors.mondayViolet,
  },
  tabPillText: {
    fontSize: typography.sizes.bodySm,
    fontWeight: typography.weights.medium,
    color: colors.slate,
  },
  tabPillTextActive: {
    color: colors.snow,
  },
  listContent: {
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[8],
    paddingBottom: spacing[32],
  },
  card: {
    backgroundColor: colors.snow,
    borderRadius: radius.cards,
    padding: spacing[16],
    marginBottom: spacing[12] ?? 12,
    ...cardShadow('default'),
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  customerName: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
    color: colors.ink,
    flex: 1,
    marginRight: spacing[8],
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[12] ?? 12,
  },
  metaText: {
    fontSize: typography.sizes.caption,
    color: colors.slate,
  },
  metaDot: {
    fontSize: typography.sizes.caption,
    color: colors.iron,
    marginHorizontal: 6,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing[8],
    borderTopWidth: 1,
    borderTopColor: colors.fog,
  },
  cost: {
    fontSize: typography.sizes.bodySm,
    fontWeight: typography.weights.bold,
    color: colors.mondayViolet,
  },
  date: {
    fontSize: typography.sizes.caption,
    color: colors.slate,
  },
});
