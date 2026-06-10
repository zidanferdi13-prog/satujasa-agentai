import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
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

export default function TransactionsListScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [transactions, setTransactions] = useState<AdminUserTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const statusMap: Record<TabType, TransactionStatus[]> = {
    active: ['received', 'document_check', 'payment_pending', 'processing', 'at_samsat', 'needs_revision'],
    done: ['done'],
    cancelled: ['cancelled'],
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
      setPage(1);
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

  const renderTab = (tab: TabType, label: string) => (
    <TouchableOpacity
      key={tab}
      style={[styles.tab, activeTab === tab && styles.tabActive]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderTransaction = ({ item }: { item: AdminUserTransaction }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/transactions/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitle}>
          <Text style={styles.customerName}>{item.customer_name}</Text>
          <Text style={styles.platNumber}>Plate: {item.vehicle_plate}</Text>
        </View>
        <StatusBadge status={item.status} size="small" />
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.cost}>Rp {parseInt(item.total_cost).toLocaleString('id-ID')}</Text>
        <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString('id-ID')}</Text>
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
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama / plat"
          placeholderTextColor="#A0A0A0"
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.tabsContainer}>
        {renderTab('active', 'Aktif')}
        {renderTab('done', 'Selesai')}
        {renderTab('cancelled', 'Dibatalkan')}
      </View>

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
  container: { flex: 1, backgroundColor: '#F4F1E9' },
  header: { paddingHorizontal: 16, paddingVertical: 12 },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5CDBF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#16201D',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D5CDBF',
  },
  tab: { flex: 1, paddingVertical: 8, marginHorizontal: 4, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#174B3B' },
  tabText: { color: '#65706B', fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#174B3B' },
  listContent: { paddingHorizontal: 16, paddingVertical: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D5CDBF',
    padding: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: { flex: 1 },
  customerName: { color: '#16201D', fontWeight: '600', fontSize: 14 },
  platNumber: { color: '#65706B', fontSize: 12, marginTop: 2 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cost: { color: '#174B3B', fontWeight: '700', fontSize: 13 },
  date: { color: '#8B572A', fontSize: 12 },
});
