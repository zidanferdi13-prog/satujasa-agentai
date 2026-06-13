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
  ActivityLogEntry,
  ActivityLogResponse,
  TransactionDocumentChecklistSnapshot,
  TransactionFeeSnapshot,
  TransactionStatus,
  UpdateFeeDetailsRequest,
  VALID_TRANSITIONS,
} from '@/contracts';
import { colors, spacing, radius, cardShadow, typography, themeStyles } from '@/theme/designTokens';

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
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState<string | null>(null);

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

  const fetchLogs = async () => {
    if (!id) return;
    try {
      setLogsError(null);
      setLogsLoading(true);
      const response = await api.get<ActivityLogResponse>(
        `/admin-user/transactions/${id}/logs`
      );
      setLogs(response.data.logs ?? []);
    } catch (err: any) {
      setLogsError(err?.message || 'Gagal memuat aktivitas');
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  useEffect(() => {
    if (!loading && transaction?.id) {
      fetchLogs();
    }
  }, [loading, transaction?.id]);

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
      fetchLogs();
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
              {formatDateID(transaction.created_at)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Terakhir Diperbarui</Text>
            <Text style={styles.infoValue}>
              {formatDateID(transaction.updated_at)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Biaya</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Biaya Utama</Text>
            <Text style={styles.infoValue}>
              {formatCurrencyID(transaction.total_cost)}
            </Text>
          </View>
          {toNumber(transaction.additional_cost) > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Biaya Tambahan</Text>
              <Text style={styles.infoValue}>
                {formatCurrencyID(transaction.additional_cost)}
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
                    {formatCurrencyID(fee.amount)}
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
          <Text style={styles.sectionTitle}>Aktivitas</Text>
          {logsLoading ? (
            <Text style={styles.logsEmpty}>Memuat aktivitas...</Text>
          ) : logsError ? (
            <View>
              <Text style={styles.logsError}>{logsError}</Text>
              <TouchableOpacity style={styles.statusButton} onPress={fetchLogs}>
                <Text style={styles.statusButtonText}>↻ Muat Ulang</Text>
              </TouchableOpacity>
            </View>
          ) : logs.length === 0 ? (
            <Text style={styles.logsEmpty}>Belum ada aktivitas</Text>
          ) : (
            logs.map((log) => (
              <View key={log.id} style={styles.logEntry}>
                <View style={styles.logDot} />
                <View style={styles.logContent}>
                  <Text style={styles.logStatus}>
                    {log.from_status || '—'} → {log.to_status}
                  </Text>
                  {log.changed_by?.email && (
                    <Text style={styles.logActor}>{log.changed_by.email}</Text>
                  )}
                  <Text style={styles.logTimestamp}>
                    {formatTimestampID(log.created_at)}
                  </Text>
                  {log.notes && (
                    <Text style={styles.logNotes}>“{log.notes}”</Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

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
                  <Text style={styles.modalTotalValue}>{formatCurrencyID(feeTotalPreview)}</Text>
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

function toNumber(value: string | number | null | undefined): number {
  return Number(value ?? 0) || 0;
}

function formatCurrencyID(value: string | number | null | undefined): string {
  return `Rp ${toNumber(value).toLocaleString('id-ID')}`;
}

function formatDateID(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID');
}

function formatTimestampID(iso: string): string {
  return new Date(iso).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cloud },
  content: { padding: spacing[16], paddingBottom: spacing[32] },
  header: { marginBottom: spacing[16] },
  transactionId: { color: colors.slate, fontSize: typography.sizes.caption, marginTop: spacing[8] },
  section: { ...themeStyles.card as object, marginBottom: spacing[16] },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[12] ?? 12 },
  sectionTitle: themeStyles.sectionTitle,
  editFeeButton: { backgroundColor: colors.periwinkleWash, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.badges },
  editFeeButtonText: { color: colors.mondayViolet, fontSize: typography.sizes.caption, fontWeight: typography.weights.medium },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[8],
    borderBottomWidth: 1,
    borderBottomColor: colors.fog,
  },
  infoLabel: { color: colors.slate, fontSize: typography.sizes.bodySm },
  infoValue: { color: colors.ink, fontWeight: typography.weights.medium, fontSize: typography.sizes.bodySm },
  snapshotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[8],
    borderBottomWidth: 1,
    borderBottomColor: colors.fog,
  },
  snapshotInfo: { flex: 1, paddingRight: spacing[12] ?? 12 },
  snapshotTitle: { color: colors.ink, fontWeight: typography.weights.bold, fontSize: typography.sizes.bodySm },
  snapshotMeta: { color: colors.slate, fontSize: typography.sizes.caption, marginTop: 2 },
  snapshotAmount: { color: colors.mondayViolet, fontWeight: typography.weights.bold, fontSize: typography.sizes.bodySm },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[8],
    borderBottomWidth: 1,
    borderBottomColor: colors.fog,
  },
  checklistIcon: { color: colors.mondayViolet, fontSize: 18, marginRight: spacing[12] ?? 12 },
  notes: { color: colors.ink, fontSize: typography.sizes.bodySm, lineHeight: 20 },
  statusButton: {
    backgroundColor: colors.mondayViolet,
    borderRadius: radius.buttons,
    paddingVertical: 13,
    paddingHorizontal: spacing[20] ?? 20,
    marginBottom: spacing[8],
    alignItems: 'center',
  },
  statusButtonText: { color: colors.snow, fontWeight: typography.weights.medium, fontSize: typography.sizes.bodySm, textAlign: 'center' },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: colors.snow,
    borderWidth: 1,
    borderColor: colors.mist,
    borderRadius: radius.buttons,
    paddingVertical: 13,
    paddingHorizontal: spacing[20] ?? 20,
    marginBottom: spacing[8],
    alignItems: 'center',
  },
  actionButtonIcon: { fontSize: 18, marginRight: spacing[12] ?? 12 },
  actionButtonText: { color: colors.ink, fontWeight: typography.weights.medium, fontSize: typography.sizes.bodySm },
  logsEmpty: { color: colors.slate, fontSize: typography.sizes.bodySm, fontStyle: 'italic', textAlign: 'center', paddingVertical: spacing[8] },
  logsError: { color: colors.error, fontSize: typography.sizes.bodySm, marginBottom: spacing[8] },
  logEntry: { flexDirection: 'row', marginBottom: spacing[12] ?? 12, alignItems: 'flex-start' },
  logDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.mist, marginTop: 6, marginRight: spacing[12] ?? 12 },
  logContent: { flex: 1 },
  logStatus: { color: colors.ink, fontWeight: typography.weights.medium, fontSize: typography.sizes.bodySm },
  logActor: { color: colors.slate, fontSize: typography.sizes.caption, marginTop: 2 },
  logTimestamp: { color: colors.iron, fontSize: 11, marginTop: 1 },
  logNotes: { color: colors.slate, fontSize: typography.sizes.caption, fontStyle: 'italic', marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: spacing[24] },
  modalContent: { backgroundColor: colors.snow, borderRadius: radius.cards, width: '100%', maxHeight: '80%', padding: spacing[24] },
  modalTitle: { color: colors.ink, fontSize: typography.sizes.subheading, fontWeight: typography.weights.medium, marginBottom: spacing[16] },
  modalScroll: { maxHeight: 400 },
  modalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing[8], borderBottomWidth: 1, borderBottomColor: colors.fog },
  modalInfo: { flex: 1, paddingRight: spacing[12] ?? 12 },
  modalFeeName: { color: colors.ink, fontWeight: typography.weights.bold, fontSize: typography.sizes.bodySm },
  modalFeeCode: { color: colors.slate, fontSize: typography.sizes.caption, marginTop: 2 },
  modalInput: { backgroundColor: colors.cloud, borderWidth: 1, borderColor: colors.pebble, borderRadius: radius.inputs, padding: spacing[12] ?? 12, width: 120, textAlign: 'right', color: colors.ink, fontWeight: typography.weights.bold },
  modalTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing[16], paddingTop: spacing[12] ?? 12, borderTopWidth: 1, borderTopColor: colors.fog },
  modalTotalLabel: { color: colors.ink, fontWeight: typography.weights.bold },
  modalTotalValue: { color: colors.mondayViolet, fontWeight: typography.weights.bold, fontSize: typography.sizes.body },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: spacing[16], gap: spacing[12] ?? 12 },
  modalCancelButton: { paddingVertical: 12, paddingHorizontal: spacing[20] ?? 20, borderRadius: radius.buttons, borderWidth: 1, borderColor: colors.pebble },
  modalCancelText: { color: colors.slate, fontWeight: typography.weights.medium },
  modalSaveButton: { backgroundColor: colors.mondayViolet, paddingVertical: 12, paddingHorizontal: spacing[20] ?? 20, borderRadius: radius.buttons, minWidth: 100, alignItems: 'center' },
  modalSaveText: { color: colors.snow, fontWeight: typography.weights.medium },
});
