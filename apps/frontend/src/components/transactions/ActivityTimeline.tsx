'use client';

import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import apiClient from '@/lib/axios';
import type { ActivityLog as ActivityLogType } from '@/types/transaction';
import { STATUS_LABELS } from '@/lib/stateMachine';
import StatusBadge from './StatusBadge';

interface ActivityTimelineProps {
  transactionId: string;
}

function formatTimestamp(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('id-ID');
}

export default function ActivityTimeline({ transactionId }: ActivityTimelineProps) {
  const { data, isLoading, isError } = useQuery<{ logs: ActivityLogType[] }>({
    queryKey: ['activity-logs', transactionId],
    queryFn: () =>
      apiClient.get(`/admin-user/transactions/${transactionId}/logs`).then((r) => {
        const raw = r.data?.data ?? r.data;
        // Accept { logs: [...] } or [...] directly
        return Array.isArray(raw) ? { logs: raw } : raw;
      }),
  });

  const logs = data?.logs ?? [];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Memuat aktivitas...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 1 }}>
        Gagal memuat riwayat aktivitas.
      </Alert>
    );
  }

  if (logs.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
        Belum ada aktivitas.
      </Typography>
    );
  }

  return (
    <Box sx={{ position: 'relative', pl: 3 }}>
      {/* Vertical line */}
      <Box
        sx={{
          position: 'absolute',
          left: 8,
          top: 8,
          bottom: 8,
          width: 2,
          bgcolor: 'divider',
        }}
      />

      {logs.map((log, index) => (
        <Box key={log.id} sx={{ position: 'relative', pb: index < logs.length - 1 ? 3 : 0 }}>
          {/* Dot */}
          <Box
            sx={{
              position: 'absolute',
              left: -19,
              top: 6,
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: index === 0 ? 'primary.main' : 'grey.400',
              border: '2px solid',
              borderColor: 'background.paper',
            }}
          />

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <StatusBadge status={log.to_status} size="small" />
              <Typography variant="caption" color="text.secondary">
                {formatTimestamp(log.created_at)}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>
              <strong>{log.changed_by?.name ?? 'Sistem'}</strong>
              {' — '}
              {STATUS_LABELS[log.from_status]} → {STATUS_LABELS[log.to_status]}
            </Typography>

            {log.notes && (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 0.25 }}>
                &ldquo;{log.notes}&rdquo;
              </Typography>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
