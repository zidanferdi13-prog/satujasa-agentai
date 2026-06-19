'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import apiClient from '@/lib/axios';
import type { DocumentChecklist, FeeDetail, TransactionDetail, TransactionStatus, UpdateStatusPayload } from '@/types/transaction';
import StatusPill from '@/components/shared/StatusPill';
import StatusTimeline from '@/components/transactions/StatusTimeline';
import ActivityTimeline from '@/components/transactions/ActivityTimeline';
import UpdateStatusModal from '@/components/transactions/UpdateStatusModal';
import { getNextStatuses, isFinalStatus, STATUS_LABELS } from '@/lib/stateMachine';

function getStatusVariant(status: TransactionStatus): 'success' | 'warning' | 'error' | 'info' {
  switch (status) {
    case 'SELESAI':
    case 'done':
      return 'success';
    case 'DIBATALKAN':
    case 'cancelled':
      return 'error';
    case 'PROSES_SAMSAT':
    case 'at_samsat':
    case 'processing':
      return 'info';
    case 'DOKUMEN_DITERIMA':
    case 'document_check':
    case 'needs_revision':
    case 'MENUNGGU_PEMBAYARAN':
    case 'payment_pending':
      return 'warning';
    default:
      return 'info';
  }
}

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
    return (
      <Box
        sx={{
          p: { xs: '20px', sm: '24px 28px', lg: '32px 40px 48px' },
          minHeight: '100vh',
          background: `
            radial-gradient(circle at 90% 0%, rgba(99, 102, 241, 0.13), transparent 35%),
            radial-gradient(circle at 0% 100%, rgba(34, 197, 94, 0.08), transparent 32%),
            #f6f8fc
          `,
        }}
      >
        <Skeleton variant="rounded" width="100%" height={600} sx={{ borderRadius: '22px' }} />
      </Box>
    );
  }

  if (!tx) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <Typography color="text.secondary">Transaksi tidak ditemukan.</Typography>
      </Box>
    );
  }

  const statusActions = getNextStatuses(tx.status);

  return (
    <Box
      sx={{
        p: { xs: '20px', sm: '24px 28px', lg: '32px 40px 48px' },
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 90% 0%, rgba(99, 102, 241, 0.13), transparent 35%),
          radial-gradient(circle at 0% 100%, rgba(34, 197, 94, 0.08), transparent 32%),
          #f6f8fc
        `,
      }}
    >
      {/* Back Button + Header */}
      <Box sx={{ mb: '28px', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="text"
          onClick={() => router.back()}
          sx={{
            minWidth: 0,
            width: 40,
            height: 40,
            borderRadius: '12px',
            border: '1px solid #e5e9f3',
            bgcolor: 'rgba(255,255,255,0.94)',
            color: '#6b7280',
            '&:hover': {
              bgcolor: '#f8f9fc',
              borderColor: '#d0d4e4',
            },
          }}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Button>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontSize: { xs: 28, md: 32 },
              fontWeight: 800,
              color: 'var(--dash-text)',
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            Detail Transaksi
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: 15,
              color: 'var(--dash-muted)',
              fontWeight: 400,
            }}
          >
            ID: {tx.id}
          </Typography>
        </Box>
        <StatusPill status={STATUS_LABELS[tx.status]} variant={getStatusVariant(tx.status)} />
      </Box>

      {/* Transaction Info Card */}
      <Box
        sx={{
          borderRadius: '22px',
          border: '1px solid #e5e9f3',
          boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
          background: 'rgba(255,255,255,0.94)',
          p: 3,
          mb: 3,
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1d2433', mb: 3 }}>
          Informasi Transaksi
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
              Customer
            </Typography>
            <Typography sx={{ fontSize: 15, color: '#1d2433', fontWeight: 600 }}>
              {tx.customer_name || '-'}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
              No. HP
            </Typography>
            <Typography sx={{ fontSize: 15, color: '#1d2433', fontWeight: 500 }}>
              {tx.customer_phone || '-'}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
              Plat Nomor
            </Typography>
            <Typography sx={{ fontSize: 15, color: '#1d2433', fontWeight: 600 }}>
              {tx.vehicle_plate ?? tx.plate_number ?? '-'}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
              Kendaraan
            </Typography>
            <Typography sx={{ fontSize: 15, color: '#1d2433', fontWeight: 500 }}>
              {tx.vehicle_type || '-'}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
              Layanan
            </Typography>
            <Typography sx={{ fontSize: 15, color: '#1d2433', fontWeight: 500 }}>
              {tx.service_name || '-'}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
              Total Biaya
            </Typography>
            <Typography sx={{ fontSize: 18, color: '#1d2433', fontWeight: 800 }}>
              Rp{formatCurrency(tx.total_cost)}
            </Typography>
          </Box>
          {tx.notes && (
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
                Catatan
              </Typography>
              <Typography sx={{ fontSize: 15, color: '#1d2433', fontWeight: 500, lineHeight: 1.6 }}>
                {tx.notes}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Fee Details Card */}
      <Box
        sx={{
          borderRadius: '22px',
          border: '1px solid #e5e9f3',
          boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
          background: 'rgba(255,255,255,0.94)',
          p: 3,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1d2433' }}>
            Rincian Biaya
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={openFeeEditor}
            disabled={!tx.fee_details?.length}
            startIcon={<span className="material-symbols-outlined">edit</span>}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              borderColor: '#e5e9f3',
              color: '#4f46e5',
              '&:hover': {
                borderColor: '#4f46e5',
                bgcolor: '#eef2ff',
              },
            }}
          >
            Edit Biaya
          </Button>
        </Box>
        {tx.fee_details?.length ? (
          <Box>
            {tx.fee_details.map((fee) => (
              <Box
                key={fee.component_code}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 180px' },
                  gap: 2,
                  py: 2,
                  borderBottom: '1px solid #e5e9f3',
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1d2433' }}>
                    {fee.component_name ?? fee.component_code}
                  </Typography>
                  <Chip
                    size="small"
                    label={fee.is_editable === false ? 'Biaya sistem / locked' : fee.source ?? 'Snapshot'}
                    sx={{
                      mt: 1,
                      borderRadius: '8px',
                      fontSize: 11,
                      fontWeight: 600,
                      bgcolor: '#f8f9fc',
                      color: '#6b7280',
                    }}
                  />
                </Box>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1d2433', textAlign: { xs: 'left', md: 'right' } }}>
                  Rp{formatCurrency(fee.amount)}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Alert
            severity="info"
            sx={{
              borderRadius: '14px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              bgcolor: 'rgba(239, 246, 255, 0.95)',
            }}
          >
            Belum ada snapshot rincian biaya.
          </Alert>
        )}
      </Box>

      {/* Document Checklist Card */}
      <Box
        sx={{
          borderRadius: '22px',
          border: '1px solid #e5e9f3',
          boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
          background: 'rgba(255,255,255,0.94)',
          p: 3,
          mb: 3,
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1d2433', mb: 3 }}>
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
                    py: 2,
                    borderBottom: '1px solid #e5e9f3',
                  }}
                >
                  <Checkbox
                    checked={Boolean(doc.is_checked)}
                    disabled={isUpdating || !doc.id}
                    onChange={() => handleChecklistToggle(doc)}
                    slotProps={{ input: { 'aria-label': `Checklist ${doc.document_name}` } }}
                    sx={{
                      '&.Mui-checked': {
                        color: '#22c55e',
                      },
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1d2433' }}>
                      {doc.document_name}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#6b7280' }}>
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
                      sx={{ borderRadius: '10px', fontWeight: 700 }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        ) : (
          <Alert
            severity="info"
            sx={{
              borderRadius: '14px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              bgcolor: 'rgba(239, 246, 255, 0.95)',
            }}
          >
            Belum ada snapshot checklist dokumen.
          </Alert>
        )}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {!isFinalStatus(tx.status) && statusActions.map((nextStatus) => (
          <Button
            key={nextStatus}
            variant={nextStatus === 'DIBATALKAN' || nextStatus === 'cancelled' ? 'outlined' : 'contained'}
            color={nextStatus === 'DIBATALKAN' || nextStatus === 'cancelled' ? 'error' : 'primary'}
            onClick={() => setStatusConfirm(nextStatus)}
            disabled={isPending}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              px: 3,
            }}
          >
            {STATUS_ACTION_LABELS[nextStatus] ?? STATUS_LABELS[nextStatus]}
          </Button>
        ))}
        <Button
          variant="outlined"
          onClick={handleWhatsApp}
          disabled={!tx.monitoring_token || !tx.customer_phone}
          startIcon={<span className="material-symbols-outlined">chat</span>}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 700,
            px: 3,
            borderColor: '#e5e9f3',
            color: '#22c55e',
            '&:hover': {
              borderColor: '#22c55e',
              bgcolor: '#ecfdf3',
            },
          }}
        >
          Kirim WA
        </Button>
        <Button
          variant="outlined"
          onClick={handleCopyMonitoring}
          startIcon={<span className="material-symbols-outlined">link</span>}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 700,
            px: 3,
            borderColor: '#e5e9f3',
            color: '#4f46e5',
            '&:hover': {
              borderColor: '#4f46e5',
              bgcolor: '#eef2ff',
            },
          }}
        >
          Copy Link Monitoring
        </Button>
      </Box>

      {/* Status Timeline */}
      <Box
        sx={{
          borderRadius: '22px',
          border: '1px solid #e5e9f3',
          boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
          background: 'rgba(255,255,255,0.94)',
          p: 3,
          mb: 3,
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1d2433', mb: 3 }}>
          Riwayat Status
        </Typography>
        <StatusTimeline logs={tx.status_logs ?? []} />
      </Box>

      {/* Activity Timeline */}
      <Box
        sx={{
          borderRadius: '22px',
          border: '1px solid #e5e9f3',
          boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
          background: 'rgba(255,255,255,0.94)',
          p: 3,
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1d2433', mb: 3 }}>
          Aktivitas
        </Typography>
        <ActivityTimeline transactionId={id} />
      </Box>

      {/* Modal */}
      <UpdateStatusModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={updateStatus}
        currentStatus={tx.status}
        isPending={isPending}
      />

      <Dialog open={!!statusConfirm} onClose={() => !isPending && setStatusConfirm(null)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800 }}>Konfirmasi Update Status</DialogTitle>
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
            sx={{ borderRadius: '12px', fontWeight: 700 }}
          >
            {isPending ? 'Menyimpan...' : 'Konfirmasi'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={feeModalOpen} onClose={() => !isSavingFees && setFeeModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800 }}>Edit Biaya</DialogTitle>
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
          <Button variant="contained" onClick={handleSaveFees} disabled={isSavingFees} sx={{ borderRadius: '12px', fontWeight: 700 }}>
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
