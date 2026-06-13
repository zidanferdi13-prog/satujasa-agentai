'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import apiClient from '@/lib/axios';
import type { DocumentChecklist, FeeDetail, TransactionDetail, TransactionStatus, UpdateStatusPayload } from '@/types/transaction';
import StatusBadge from '@/components/transactions/StatusBadge';
import StatusTimeline from '@/components/transactions/StatusTimeline';
import ActivityTimeline from '@/components/transactions/ActivityTimeline';
import UpdateStatusModal from '@/components/transactions/UpdateStatusModal';
import { getNextStatuses, isFinalStatus, STATUS_LABELS } from '@/lib/stateMachine';

function formatCurrency(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return amount.toLocaleString('id-ID');
}

function normalizeEditableAmount(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return amount === 0 ? '' : String(value);
}

type EditableFeeRow = FeeDetail & { amountInput: string };

const STATUS_ACTION_LABELS: Partial<Record<TransactionStatus, string>> = {
  DOKUMEN_DITERIMA: 'Terima Dokumen',
  PROSES_SAMSAT: 'Proses Samsat',
  MENUNGGU_PEMBAYARAN: 'Menunggu Pembayaran',
  SELESAI: 'Selesai',
  DIBATALKAN: 'Batalkan',
};

export default function TransaksiDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [feeModalOpen, setFeeModalOpen] = useState(false);
  const [statusConfirm, setStatusConfirm] = useState<TransactionStatus | null>(null);
  const [editableFeeRows, setEditableFeeRows] = useState<EditableFeeRow[]>([]);
  const [toast, setToast] = useState('');
  const [errorToast, setErrorToast] = useState('');

  const { data: tx, isLoading } = useQuery<TransactionDetail>({
    queryKey: ['transaction', id],
    queryFn: () => apiClient.get(`/admin-user/transactions/${id}`).then((r) => r.data?.data ?? r.data),
  });

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: (payload: UpdateStatusPayload) =>
      apiClient.patch(`/admin-user/transactions/${id}/status`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction', id] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['activity-logs', id] });
      setModalOpen(false);
      setStatusConfirm(null);
      setToast('Status berhasil diupdate');
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setErrorToast(message ?? 'Gagal mengupdate status');
    },
  });

  const { mutate: updateChecklist, variables: updatingChecklist } = useMutation({
    mutationFn: ({ checklistId, isChecked }: { checklistId: string; isChecked: boolean }) =>
      apiClient.patch(`/admin-user/transactions/${id}/document-checklists/${checklistId}`, { isChecked }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction', id] });
      setToast('Checklist dokumen berhasil diupdate');
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setErrorToast(message ?? 'Gagal mengupdate checklist dokumen');
    },
  });

  const feeTotalPreview = editableFeeRows.reduce(
    (sum, fee) => sum + Number(fee.amountInput || 0),
    0,
  );

  const { mutate: updateFees, isPending: isSavingFees } = useMutation({
    mutationFn: (feeDetails: { componentCode: string; amount: number }[]) =>
      apiClient.patch(`/admin-user/transactions/${id}/fees`, { feeDetails }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction', id] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setFeeModalOpen(false);
      setToast('Rincian biaya berhasil diupdate');
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setErrorToast(message ?? 'Gagal mengupdate rincian biaya');
    },
  });

  function openFeeEditor() {
    setEditableFeeRows(
      (tx?.fee_details ?? []).map((fee) => ({
        ...fee,
        amountInput: normalizeEditableAmount(fee.amount),
      })),
    );
    setFeeModalOpen(true);
  }

  function handleFeeAmountChange(componentCode: string, value: string) {
    setEditableFeeRows((prev) =>
      prev.map((fee) => (fee.component_code === componentCode ? { ...fee, amountInput: value } : fee)),
    );
  }

  function handleSaveFees() {
    if (editableFeeRows.some((fee) => Number.isNaN(Number(fee.amountInput)) || Number(fee.amountInput) < 0)) {
      setErrorToast('Nominal biaya tidak valid');
      return;
    }
    updateFees(
      editableFeeRows.map((fee) => ({
        componentCode: fee.component_code,
        amount: Number(fee.amountInput || 0),
      })),
    );
  }

  function getChecklistKey(doc: DocumentChecklist) {
    return doc.id ?? doc.document_code;
  }

  function handleChecklistToggle(doc: DocumentChecklist) {
    if (!doc.id) {
      setErrorToast('Checklist ID tidak tersedia dari backend');
      return;
    }
    updateChecklist({ checklistId: doc.id, isChecked: !doc.is_checked });
  }

  function handleCopyMonitoring() {
    if (!tx?.monitoring_token) return;
    const url = `${window.location.origin}/monitoring/${tx.monitoring_token}`;
    navigator.clipboard.writeText(url);
    setToast('Link monitoring berhasil disalin');
  }

  function handleWhatsApp() {
    if (!tx?.monitoring_token || !tx.customer_phone) return;
    const monitoringUrl = `${window.location.origin}/monitoring/${tx.monitoring_token}`;
    const message = `Halo ${tx.customer_name || 'Pelanggan'}, berikut link monitoring status dokumen Anda:\n${monitoringUrl}`;
    const waUrl = `https://wa.me/${tx.customer_phone.replace(/^0/, '62')}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  }

  if (isLoading) {
    return <Box className="p-8"><Typography>Loading...</Typography></Box>;
  }

  if (!tx) {
    return <Box className="p-8"><Typography>Transaksi tidak ditemukan.</Typography></Box>;
  }

  const statusActions = getNextStatuses(tx.status);

  return (
    <Box className="p-6 md:p-8" sx={{ maxWidth: 800 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Button variant="text" onClick={() => router.back()} sx={{ minWidth: 0 }}>
          <span className="material-symbols-outlined">arrow_back</span>
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, flex: 1 }}>
          Detail Transaksi
        </Typography>
        <StatusBadge status={tx.status} size="medium" />
      </Box>

      {/* Info */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Customer</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>{tx.customer_name || '-'}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">No. HP</Typography>
            <Typography variant="body1">{tx.customer_phone || '-'}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Plat Nomor</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>{tx.vehicle_plate ?? tx.plate_number ?? '-'}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Kendaraan</Typography>
            <Typography variant="body1">{tx.vehicle_type || '-'}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Layanan</Typography>
            <Typography variant="body1">{tx.service_name || '-'}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Total Biaya</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Rp{formatCurrency(tx.total_cost)}
            </Typography>
          </Box>
          {tx.notes && (
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="caption" color="text.secondary">Catatan</Typography>
              <Typography variant="body2">{tx.notes}</Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Fee snapshot */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Rincian Biaya
          </Typography>
          <Button size="small" variant="outlined" onClick={openFeeEditor} disabled={!tx.fee_details?.length}>
            Edit Biaya
          </Button>
        </Box>
        {tx.fee_details?.length ? (
          <Box>
            {tx.fee_details.map((fee) => (
              <Box key={fee.component_code} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 180px' }, gap: 2, py: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {fee.component_name ?? fee.component_code}
                  </Typography>
                  <Chip size="small" label={fee.is_editable === false ? 'Biaya sistem / locked' : fee.source ?? 'Snapshot'} sx={{ mt: 0.75 }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, textAlign: { xs: 'left', md: 'right' } }}>
                  Rp{formatCurrency(fee.amount)}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Alert severity="info">Belum ada snapshot rincian biaya.</Alert>
        )}
      </Paper>

      {/* Document checklist snapshot */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Checklist Dokumen
        </Typography>
        {tx.document_checklists?.length ? (
          <Box>
            {tx.document_checklists.map((doc) => {
              const checklistKey = getChecklistKey(doc);
              const isUpdating = updatingChecklist?.checklistId === doc.id;
              return (
                <Box
                  key={checklistKey}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1.25,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Checkbox
                    checked={Boolean(doc.is_checked)}
                    disabled={isUpdating || !doc.id}
                    onChange={() => handleChecklistToggle(doc)}
                    slotProps={{ input: { 'aria-label': `Checklist ${doc.document_name}` } }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {doc.document_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {doc.is_required ? 'Dokumen wajib' : 'Dokumen opsional'}
                    </Typography>
                  </Box>
                  {isUpdating ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Chip
                      size="small"
                      label={doc.is_checked ? 'Sudah diterima' : 'Belum diterima'}
                      color={doc.is_checked ? 'success' : 'default'}
                      variant={doc.is_checked ? 'filled' : 'outlined'}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        ) : (
          <Alert severity="info">Belum ada snapshot checklist dokumen.</Alert>
        )}
      </Paper>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {!isFinalStatus(tx.status) && statusActions.map((nextStatus) => (
          <Button
            key={nextStatus}
            variant={nextStatus === 'DIBATALKAN' || nextStatus === 'cancelled' ? 'outlined' : 'contained'}
            color={nextStatus === 'DIBATALKAN' || nextStatus === 'cancelled' ? 'error' : 'primary'}
            onClick={() => setStatusConfirm(nextStatus)}
            disabled={isPending}
          >
            {STATUS_ACTION_LABELS[nextStatus] ?? STATUS_LABELS[nextStatus]}
          </Button>
        ))}
        <Button variant="outlined" onClick={handleWhatsApp} disabled={!tx.monitoring_token || !tx.customer_phone} startIcon={<span className="material-symbols-outlined text-[20px]">chat</span>}>
          Kirim WA
        </Button>
        <Button variant="outlined" onClick={handleCopyMonitoring} startIcon={<span className="material-symbols-outlined text-[20px]">link</span>}>
          Copy Link Monitoring
        </Button>
      </Box>

      {/* Timeline */}
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Riwayat Status
      </Typography>
      <StatusTimeline logs={tx.status_logs ?? []} />

      {/* Aktivitas */}
      <Divider sx={{ mb: 3, mt: 4 }} />
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Aktivitas
      </Typography>
      <ActivityTimeline transactionId={id} />

      {/* Modal */}
      <UpdateStatusModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={updateStatus}
        currentStatus={tx.status}
        isPending={isPending}
      />

      <Dialog open={!!statusConfirm} onClose={() => !isPending && setStatusConfirm(null)} fullWidth maxWidth="xs">
        <DialogTitle>Konfirmasi Update Status</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Ubah status transaksi menjadi <strong>{statusConfirm ? STATUS_LABELS[statusConfirm] : ''}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusConfirm(null)} disabled={isPending}>Batal</Button>
          <Button
            variant="contained"
            color={statusConfirm === 'DIBATALKAN' || statusConfirm === 'cancelled' ? 'error' : 'primary'}
            onClick={() => statusConfirm && updateStatus({ status: statusConfirm })}
            disabled={isPending}
          >
            {isPending ? 'Menyimpan...' : 'Konfirmasi'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={feeModalOpen} onClose={() => !isSavingFees && setFeeModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Biaya</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {editableFeeRows.map((fee) => (
              <Box key={fee.component_code} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 180px' }, gap: 2, alignItems: 'center', py: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {fee.component_name ?? fee.component_code}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {fee.default_amount !== undefined ? `Referensi: Rp${formatCurrency(fee.default_amount)}` : fee.component_code}
                  </Typography>
                </Box>
                <TextField
                  type="number"
                  size="small"
                  value={fee.amountInput}
                  placeholder="Rp 0"
                  onChange={(e) => handleFeeAmountChange(fee.component_code, e.target.value)}
                  slotProps={{
                    input: { startAdornment: <InputAdornment position="start">Rp</InputAdornment> },
                    htmlInput: { min: 0 },
                  }}
                />
              </Box>
            ))}
            <Typography variant="h6" sx={{ mt: 2, textAlign: 'right', fontWeight: 800 }}>
              Preview Total: Rp{formatCurrency(feeTotalPreview)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeeModalOpen(false)} disabled={isSavingFees}>Batal</Button>
          <Button variant="contained" onClick={handleSaveFees} disabled={isSavingFees}>
            {isSavingFees ? 'Menyimpan...' : 'Simpan Biaya'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setToast('')}>{toast}</Alert>
      </Snackbar>
      <Snackbar
        open={!!errorToast}
        autoHideDuration={4000}
        onClose={() => setErrorToast('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setErrorToast('')}>{errorToast}</Alert>
      </Snackbar>
    </Box>
  );
}
