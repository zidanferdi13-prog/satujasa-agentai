'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import apiClient from '@/lib/axios';
import StatusBadge from '@/components/transactions/StatusBadge';
import StatusTimeline from '@/components/transactions/StatusTimeline';
import type { TransactionDetail } from '@/types/transaction';

type MonitoringData = TransactionDetail & {
  status_history?: TransactionDetail['status_logs'];
  tenant_name?: string;
};

function formatDateTime(value: string | null | undefined) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('id-ID');
}

export default function MonitoringPage() {
  const { token } = useParams<{ token: string }>();

  const { data, isLoading, isError } = useQuery<MonitoringData>({
    queryKey: ['monitoring', token],
    queryFn: () =>
      apiClient
        .get(`/monitoring/${token}`)
        .then((r) => r.data?.data ?? r.data),
    enabled: !!token,
  });

  const tx = data;
  const statusLogs = tx?.status_logs ?? tx?.status_history ?? [];
  const isDone = tx?.status === 'done';
  const isCancelled = tx?.status === 'cancelled';

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography>Memuat informasi transaksi...</Typography>
      </Box>
    );
  }

  if (isError || !tx) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Transaksi Tidak Ditemukan
          </Typography>
          <Typography variant="body2">
            Token atau kode tracking tidak valid. Hubungi admin untuk informasi lebih lanjut.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      {/* Status Alert */}
      {isDone && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            ✓ Dokumen Anda Sudah Selesai!
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Silakan hubungi kami untuk pengambilan atau pengiriman dokumen.
          </Typography>
        </Alert>
      )}

      {isCancelled && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            ✗ Permintaan Dibatalkan
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Proses dokumen Anda telah dibatalkan. Hubungi kami untuk informasi lebih lanjut.
          </Typography>
        </Alert>
      )}

      {/* Info Card */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '12px', textTransform: 'uppercase' }}>
            Nama Pelanggan
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {tx.customer_name || 'Pelanggan'}
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '12px', textTransform: 'uppercase' }}>
              Plat Nomor
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {tx.plate_number ?? tx.vehicle_plate ?? '—'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '12px', textTransform: 'uppercase' }}>
              Jenis Kendaraan
            </Typography>
            <Typography variant="body1">
              {tx.vehicle_type || '—'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '12px', textTransform: 'uppercase' }}>
            Layanan
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {tx.service_name || '—'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '12px', textTransform: 'uppercase' }}>
              Status Saat Ini
            </Typography>
          </Box>
          <StatusBadge status={tx.status} size="medium" />
        </Box>
      </Paper>

      {/* Timeline */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Riwayat Pembaruan
      </Typography>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <StatusTimeline logs={statusLogs} />
      </Paper>

      {/* Meta Info */}
      <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, fontSize: '12px' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Dikirim
            </Typography>
            <Typography variant="body2">
              {formatDateTime(tx.created_at)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Update Terakhir
            </Typography>
            <Typography variant="body2">
              {formatDateTime(tx.updated_at)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
