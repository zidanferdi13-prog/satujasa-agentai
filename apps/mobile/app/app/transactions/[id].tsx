import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import { StatusBadge } from '@/components/StatusBadge';
import {
  TransactionDocumentChecklistSnapshot,
  TransactionFeeSnapshot,
  TransactionStatus,
  UpdateFeeDetailsRequest,
  VALID_TRANSITIONS,
} from '@/contracts';

interface AdminUserTransaction {
  id: string;
  customer_name: string;
  customer_phone: string;
  vehicle_plate: string;
  service_id: string;
  service_name: string;
  service_code?: string;
  status: TransactionStatus;
  total_cost: string;
  additional_cost: string;
  notes: string | null;
  monitoring_token: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  fee_details?: TransactionFeeSnapshot[];
  document_checklists?: TransactionDocumentChecklistSnapshot[];
}

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [transaction, setTransaction] = useState<AdminUserTransaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [editingFees, setEditingFees] = useState(false);
  const [feeEdits, setFeeEdits] = useState<FeeEditItem[]>([]);
  const [savingFees, setSavingFees] = useState(false);

  const fetchTransaction = async () => {
    if (!id) return;
    try {
      setError(null);
      const response = await api.get<AdminUserTransaction>(
        `/admin-user/transactions/${id}`
      );
      setTransaction(response.data);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat detail berkas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  interface FeeEditItem {
    componentCode: string;
    componentName: string;
    amount: string;
  }

  const openFeeEditor = () => {
    if (!transaction?.fee_details) return;
    setFeeEdits(
      transaction.fee_details
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((fee) => ({
          componentCode: fee.component_code,
          componentName: fee.component_name,
          amount: fee.amount,
        }))
    );
    setEditingFees(true);
  };

  const handleFeeEditChange = (componentCode: string, text: string) => {
    const num = text.replace(/[^0-9]/g, '');
    setFeeEdits((prev) =>
      prev.map((f) => (f.componentCode === componentCode ? { ...f, amount: num } : f))
    );
  };

  const handleFeeSave = async () => {
    if (!transaction) return;
    setSavingFees(true);
    try {
      const payload: UpdateFeeDetailsRequest = {
        feeDetails: feeEdits.map((f) => ({
          componentCode: f.componentCode,
          amount: parseInt(f.amount || '0', 10),
        })),
      };
      await api.patch(`/admin-user/transactions/${transaction.id}/fees`, payload);
      setEditingFees(false);
      await fetchTransaction();
      Alert.alert('Sukses', 'Biaya berhasil diperbarui');
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.error || err?.message || 'Gagal memperbarui biaya');
    } finally {
      setSavingFees(false);
    }
  };

  const feeTotalPreview = feeEdits.reduce((sum, fee) => sum + parseInt(fee.amount || '0', 10), 0);

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
      const response = await api.patch<Partial<AdminUserTransaction>>(
        `/admin-user/transactions/${transaction.id}/status`,
        {
          status: newStatus,
          notes: notes || undefined,
        }
      );
      setTransaction({ ...transaction, ...response.data });
      Alert.alert('Sukses', 'Status berhasil diperbarui');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Gagal update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleOpenWA = () => {
    if (!transaction) return;
    api
      .get<{ wa_link: string }>(`/admin-user/transactions/${transaction.id}/wa-link`)
      .then((response) => Linking.openURL(response.data.wa_link))
      .catch((err: any) => Alert.alert('Error', err?.message || 'Gagal membuka WhatsApp'));
  };

  const handleCopyLink = () => {
    if (!transaction) return;
    const monitoringLink = `https://satujasa.my.id/monitoring/${transaction.monitoring_token}`;
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

        {transaction.fee_details && transaction.fee_details.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Rincian Biaya Tersimpan</Text>
              <TouchableOpacity style={styles.editFeeButton} onPress={openFeeEditor}>
                <Text style={styles.editFeeButtonText}>✏️ Edit</Text>
              </TouchableOpacity>
            </View>
            {transaction.fee_details
              .slice()
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((fee) => (
                <View key={fee.id} style={styles.snapshotRow}>
                  <View style={styles.snapshotInfo}>
                    <Text style={styles.snapshotTitle}>{fee.component_name}</Text>
                    <Text style={styles.snapshotMeta}>
                      {fee.source === 'tenant_pricing' ? 'Biaya sistem' : fee.component_code}
                    </Text>
                  </View>
                  <Text style={styles.snapshotAmount}>
                    Rp {parseInt(fee.amount).toLocaleString('id-ID')}
                  </Text>
                </View>
              ))}
          </View>
        )}

        {transaction.document_checklists && transaction.document_checklists.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Checklist Dokumen</Text>
            {transaction.document_checklists
              .slice()
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((doc) => (
                <View key={doc.id} style={styles.checklistRow}>
                  <Text style={styles.checklistIcon}>{doc.is_checked ? '☑' : '☐'}</Text>
                  <View style={styles.snapshotInfo}>
                    <Text style={styles.snapshotTitle}>{doc.document_name}</Text>
                    <Text style={styles.snapshotMeta}>{doc.is_required ? 'Wajib' : 'Opsional'}</Text>
                  </View>
                </View>
              ))}
          </View>
        )}

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

        <Modal visible={editingFees} animationType="slide" transparent onRequestClose={() => setEditingFees(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Biaya</Text>
              <ScrollView style={styles.modalScroll}>
                {feeEdits.map((fee) => (
                  <View key={fee.componentCode} style={styles.modalRow}>
                    <View style={styles.modalInfo}>
                      <Text style={styles.modalFeeName}>{fee.componentName}</Text>
                      <Text style={styles.modalFeeCode}>{fee.componentCode}</Text>
                    </View>
                    <TextInput
                      style={styles.modalInput}
                      value={fee.amount}
                      onChangeText={(text) => handleFeeEditChange(fee.componentCode, text)}
                      keyboardType="number-pad"
                      editable={!savingFees}
                    />
                  </View>
                ))}
                <View style={styles.modalTotalRow}>
                  <Text style={styles.modalTotalLabel}>Preview Total</Text>
                  <Text style={styles.modalTotalValue}>Rp {feeTotalPreview.toLocaleString('id-ID')}</Text>
                </View>
              </ScrollView>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalCancelButton} onPress={() => setEditingFees(false)} disabled={savingFees}>
                  <Text style={styles.modalCancelText}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSaveButton} onPress={handleFeeSave} disabled={savingFees}>
                  {savingFees ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.modalSaveText}>Simpan</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

function getStatusLabel(status: TransactionStatus): string {
  const labels: Record<TransactionStatus, string> = {
    DRAFT: 'Terima Dokumen',
    DOKUMEN_DITERIMA: 'Proses Samsat',
    PROSES_SAMSAT: 'Menunggu Pembayaran',
    MENUNGGU_PEMBAYARAN: 'Selesai',
    SELESAI: 'Selesai',
    DIBATALKAN: 'Dibatalkan',
  };
  return labels[status];
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F1E9' },
  content: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 24 },
  transactionId: { color: '#65706B', fontSize: 12, marginTop: 8 },
  section: { marginBottom: 24, backgroundColor: '#FFFFFF', borderRadius: 8, padding: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: '#16201D', fontSize: 14, fontWeight: '700' },
  editFeeButton: { backgroundColor: '#F4F1E9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#D5CDBF' },
  editFeeButtonText: { color: '#174B3B', fontSize: 12, fontWeight: '600' },
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
  snapshotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F1E9',
  },
  snapshotInfo: { flex: 1, paddingRight: 12 },
  snapshotTitle: { color: '#16201D', fontWeight: '700', fontSize: 13 },
  snapshotMeta: { color: '#65706B', fontSize: 12, marginTop: 2 },
  snapshotAmount: { color: '#174B3B', fontWeight: '800', fontSize: 13 },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F1E9',
  },
  checklistIcon: { color: '#174B3B', fontSize: 18, marginRight: 12 },
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 12, width: '100%', maxHeight: '80%', padding: 20 },
  modalTitle: { color: '#16201D', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  modalScroll: { maxHeight: 400 },
  modalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F4F1E9' },
  modalInfo: { flex: 1, paddingRight: 12 },
  modalFeeName: { color: '#16201D', fontWeight: '700', fontSize: 13 },
  modalFeeCode: { color: '#65706B', fontSize: 12, marginTop: 2 },
  modalInput: { backgroundColor: '#F9F7F2', borderWidth: 1, borderColor: '#D5CDBF', borderRadius: 8, padding: 10, width: 120, textAlign: 'right', color: '#16201D', fontWeight: '700' },
  modalTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#D5CDBF' },
  modalTotalLabel: { color: '#16201D', fontWeight: '700' },
  modalTotalValue: { color: '#174B3B', fontWeight: '800', fontSize: 14 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 12 },
  modalCancelButton: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1, borderColor: '#D5CDBF' },
  modalCancelText: { color: '#65706B', fontWeight: '600' },
  modalSaveButton: { backgroundColor: '#174B3B', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, minWidth: 100, alignItems: 'center' },
  modalSaveText: { color: '#FFFFFF', fontWeight: '700' },
});
