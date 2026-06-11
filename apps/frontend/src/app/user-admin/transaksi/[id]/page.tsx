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
import apiClient from '@/lib/axios';
import type { TransactionDetail, UpdateStatusPayload } from '@/types/transaction';
import StatusBadge from '@/components/transactions/StatusBadge';
import StatusTimeline from '@/components/transactions/StatusTimeline';
import UpdateStatusModal from '@/components/transactions/UpdateStatusModal';
import { isFinalStatus } from '@/lib/stateMachine';

function formatCurrency(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return amount.toLocaleString('id-ID');
}

export default function TransaksiDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');

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
      setModalOpen(false);
      setToast('Status berhasil diupdate');
    },
  });

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
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Rincian Biaya
        </Typography>
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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tx.document_checklists.map((doc) => (
              <Chip
                key={doc.document_code}
                icon={<span className="material-symbols-outlined text-[18px]">{doc.is_checked ? 'check_circle' : 'radio_button_unchecked'}</span>}
                label={`${doc.document_name}${doc.is_required ? ' (wajib)' : ''}`}
                color={doc.is_checked ? 'success' : 'default'}
                variant={doc.is_checked ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        ) : (
          <Alert severity="info">Belum ada snapshot checklist dokumen.</Alert>
        )}
      </Paper>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {!isFinalStatus(tx.status) && (
          <Button variant="contained" onClick={() => setModalOpen(true)}>
            Update Status
          </Button>
        )}
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

      {/* Modal */}
      <UpdateStatusModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={updateStatus}
        currentStatus={tx.status}
        isPending={isPending}
      />

      {/* Toast */}
      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setToast('')}>{toast}</Alert>
      </Snackbar>
    </Box>
  );
}
