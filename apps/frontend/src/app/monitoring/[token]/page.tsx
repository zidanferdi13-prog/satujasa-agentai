'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import apiClient from '@/lib/axios';
import StatusBadge from '@/components/transactions/StatusBadge';
import StatusTimeline from '@/components/transactions/StatusTimeline';
import MetricCard from '@/components/shared/MetricCard';
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
  const isDone = tx?.status === 'done' || tx?.status === 'SELESAI';
  const isCancelled = tx?.status === 'cancelled' || tx?.status === 'DIBATALKAN';

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Box sx={{ maxWidth: 600, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Skeleton variant="rounded" height={80} sx={{ borderRadius: 3 }} />
          <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3 }} />
        </Box>
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

      {/* Metric Cards Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard label="Nama Pelanggan" value={tx.customer_name || 'Pelanggan'} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard label="Plat Nomor" value={tx.plate_number ?? tx.vehicle_plate ?? '—'} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard label="Jenis Kendaraan" value={tx.vehicle_type || '—'} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard label="Layanan" value={tx.service_name || '—'} accentColor="#6161ff" />
        </Grid>
      </Grid>

      {/* Status card */}
      <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2.5 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, textTransform: 'uppercase', fontWeight: 600 }}>
              Status Saat Ini
            </Typography>
          </Box>
          <StatusBadge status={tx.status} size="medium" />
        </CardContent>
      </Card>

      {/* Timeline */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Riwayat Pembaruan
      </Typography>
      <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <StatusTimeline logs={statusLogs} />
      </Card>

      {/* Meta Info */}
      <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Grid container spacing={2} sx={{ fontSize: 12 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Dikirim
            </Typography>
            <Typography variant="body2">
              {formatDateTime(tx.created_at)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Update Terakhir
            </Typography>
            <Typography variant="body2">
              {formatDateTime(tx.updated_at)}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
