'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { TransactionStatusLog } from '@/types/transaction';
import StatusBadge from './StatusBadge';

interface StatusTimelineProps {
  logs: TransactionStatusLog[];
}

export default function StatusTimeline({ logs }: StatusTimelineProps) {
  if (!logs || logs.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Belum ada riwayat status.
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
              <StatusBadge status={log.status} size="small" />
              <Typography variant="caption" color="text.secondary">
                {new Date(log.created_at).toLocaleString('id-ID')}
              </Typography>
            </Box>
            {log.notes && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {log.notes}
              </Typography>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
