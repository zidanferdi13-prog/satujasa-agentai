import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../../../src/lib/api';
import { LoadingSpinner } from '../../../src/components/LoadingSpinner';
import { ErrorState } from '../../../src/components/ErrorState';
import { StatusBadge } from '../../../src/components/StatusBadge';
import {
  TransactionDTO,
  TransactionStatus,
  VALID_TRANSITIONS,
} from '@stnk/contracts';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [transaction, setTransaction] = useState<TransactionDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchTransaction = async () => {
    if (!id) return;
    try {
      setError(null);
      const response = await api.get<{ data: TransactionDTO }>(
        `/admin-user/transactions/${id}`
      );
      setTransaction(response.data.data);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat detail berkas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const validNextStatuses = transaction
    ? VALID_TRANSITIONS[transaction.status]
    : [];

  const handleStatusUpdate = (newStatus: TransactionStatus) => {
    Alert.prompt(
      'Update Status',
      'Tambahkan catatan (opsional):',
      [
        { text: 'Batal', onPress: () => {}, style: 'cancel' },
        {
          text: 'Simpan',
          onPress: (notes = '') => updateStatus(newStatus, notes),
        },
      ],
      'plain-text'
    );
  };

  const updateStatus = async (newStatus: TransactionStatus, notes: string) => {
    if (!transaction) return;
    setUpdatingStatus(true);
    try {
      const response = await api.patch<{ data: TransactionDTO }>(
        `/admin-user/transactions/${transaction.id}/status`,
        {
          status: newStatus,
          notes: notes || undefined,
        }
      );
      setTransaction(response.data.data);
      Alert.alert('Sukses', 'Status berhasil diperbarui');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Gagal update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleOpenWA = () => {
    if (!transaction) return;
    const phone = transaction.customer_id; // Should be customer phone from API
    const waLink = `https://wa.me/${phone}?text=Assalamu%27alaikum%20Pak/Bu%2C%20Berkas%20STNK%20Anda%20sudah%20kami%20terima.`;
    Linking.openURL(waLink);
  };

  const handleCopyLink = () => {
    if (!transaction) return;
    const monitoringLink = `https://stnk-jasa.app/monitoring/${transaction.monitoring_token}`;
    Share.share({
      message: `Pantau status berkas STNK Anda di sini: ${monitoringLink}`,
      title: 'Link Monitoring Berkas',
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState message={error || 'Berkas tidak ditemukan'} onRetry={fetchTransaction} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <StatusBadge status={transaction.status} />
          <Text style={styles.transactionId}>ID: {transaction.id.slice(0, 12)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Berkas</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <StatusBadge status={transaction.status} size="small" />
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tanggal Dibuat</Text>
            <Text style={styles.infoValue}>
              {new Date(transaction.created_at).toLocaleDateString('id-ID')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Terakhir Diperbarui</Text>
            <Text style={styles.infoValue}>
              {new Date(transaction.updated_at).toLocaleDateString('id-ID')}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Biaya</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Biaya Utama</Text>
            <Text style={styles.infoValue}>
              Rp {parseInt(transaction.total_cost).toLocaleString('id-ID')}
            </Text>
          </View>
          {parseInt(transaction.additional_cost) > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Biaya Tambahan</Text>
              <Text style={styles.infoValue}>
                Rp {parseInt(transaction.additional_cost).toLocaleString('id-ID')}
              </Text>
            </View>
          )}
        </View>

        {transaction.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Catatan</Text>
            <Text style={styles.notes}>{transaction.notes}</Text>
          </View>
        )}

        {validNextStatuses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Update Status</Text>
            {validNextStatuses.map((status) => (
              <TouchableOpacity
                key={status}
                style={styles.statusButton}
                onPress={() => handleStatusUpdate(status)}
                disabled={updatingStatus}
              >
                <Text style={styles.statusButtonText}>→ {getStatusLabel(status)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aksi</Text>
          <TouchableOpacity style={styles.actionButton} onPress={handleOpenWA}>
            <Text style={styles.actionButtonIcon}>💬</Text>
            <Text style={styles.actionButtonText}>Kirim WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleCopyLink}>
            <Text style={styles.actionButtonIcon}>🔗</Text>
            <Text style={styles.actionButtonText}>Bagikan Link Monitoring</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getStatusLabel(status: TransactionStatus): string {
  const labels: Record<TransactionStatus, string> = {
    received: 'Diterima',
    document_check: 'Cek Dokumen',
    payment_pending: 'Menunggu Bayar',
    processing: 'Proses',
    at_samsat: 'Di Samsat',
    needs_revision: 'Revisi Dokumen',
    done: 'Selesai',
    cancelled: 'Dibatalkan',
  };
  return labels[status];
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F1E9' },
  content: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 24 },
  transactionId: { color: '#65706B', fontSize: 12, marginTop: 8 },
  section: { marginBottom: 24, backgroundColor: '#FFFFFF', borderRadius: 8, padding: 16 },
  sectionTitle: { color: '#16201D', fontSize: 14, fontWeight: '700', marginBottom: 12 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F1E9',
  },
  infoLabel: { color: '#65706B', fontSize: 13 },
  infoValue: { color: '#16201D', fontWeight: '600', fontSize: 13 },
  notes: { color: '#16201D', fontSize: 13, lineHeight: 20 },
  statusButton: {
    backgroundColor: '#F4F1E9',
    borderWidth: 1,
    borderColor: '#D5CDBF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  statusButtonText: { color: '#174B3B', fontWeight: '600', fontSize: 13 },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#F4F1E9',
    borderWidth: 1,
    borderColor: '#D5CDBF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  actionButtonIcon: { fontSize: 18, marginRight: 12 },
  actionButtonText: { color: '#16201D', fontWeight: '600', fontSize: 13 },
});
