'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: number | null;
  accentColor?: string;
  loading?: boolean;
}

function formatDelta(delta: number): string {
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta}`;
}

export default function MetricCard({
  label,
  value,
  delta,
  accentColor,
  loading = false,
}: MetricCardProps) {
  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        ...(accentColor && {
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            backgroundColor: accentColor,
          },
        }),
      }}
    >
      <CardContent sx={{ p: '20px !important' }}>
        {/* Label */}
        {loading ? (
          <Skeleton variant="text" width={80} height={16} sx={{ mb: 1 }} />
        ) : (
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: '#535768',
              mb: 0.5,
            }}
          >
            {label}
          </Typography>
        )}

        {/* Value */}
        {loading ? (
          <Skeleton variant="text" width={120} height={36} sx={{ mb: 0.5 }} />
        ) : (
          <Typography
            sx={{
              fontSize: { xs: 28, sm: 32 },
              fontWeight: 700,
              color: '#333333',
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            {value}
          </Typography>
        )}

        {/* Delta */}
        {loading ? (
          <Skeleton variant="text" width={60} height={16} />
        ) : delta !== undefined && delta !== null ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              component="span"
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: delta >= 0 ? '#10b981' : '#ef4444',
                lineHeight: 1.4,
              }}
            >
              {formatDelta(delta)}
            </Typography>
          </Box>
        ) : null}
      </CardContent>
    </Card>
  );
}
