'use client';

import { useMemo } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { PlatformStats } from '@/types/dashboard';

type PlatformSummaryProps = {
  data?: PlatformStats;
};

const DEFAULT_DATA: PlatformStats = {
  storage_used_gb: 64,
  storage_total_gb: 200,
  db_used_mb: 320,
  db_total_mb: 1024,
  active_users_30d: 1850,
  total_users_30d: 3200,
  active_tenants: 14,
  total_tenant_slots: 25,
};

type ProgressRow = {
  label: string;
  used: number;
  total: number;
  unit: string;
};

export default function PlatformSummary({ data }: PlatformSummaryProps) {
  const stats = data ?? DEFAULT_DATA;

  const rows: ProgressRow[] = useMemo(
    () => [
      {
        label: 'Storage',
        used: stats.storage_used_gb,
        total: stats.storage_total_gb,
        unit: 'GB',
      },
      {
        label: 'Database',
        used: stats.db_used_mb,
        total: stats.db_total_mb,
        unit: 'MB',
      },
      {
        label: 'Users (30d)',
        used: stats.active_users_30d,
        total: stats.total_users_30d,
        unit: '',
      },
      {
        label: 'Active Tenants',
        used: stats.active_tenants,
        total: stats.total_tenant_slots,
        unit: '',
      },
    ],
    [stats],
  );

  return (
    <Card
      sx={{
        borderRadius: '22px',
        border: '1px solid #e5e9f3',
        boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
        background: 'rgba(255,255,255,0.94)',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18, color: 'var(--dash-text)', mb: 0.5 }}>
            Platform Summary
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 13, color: '#8a91a3' }}>
            Ringkasan penggunaan resource
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {rows.map((row) => {
            const pct = row.total > 0 ? Math.min((row.used / row.total) * 100, 100) : 0;

            return (
              <Box key={row.label}>
                {/* Label row */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'var(--dash-text)' }}>
                    {row.label}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'var(--dash-text)' }}>
                      {pct.toFixed(0)}%
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#8a91a3' }}>
                      {row.used}/{row.total} {row.unit}
                    </Typography>
                  </Box>
                </Box>

                {/* Progress bar */}
                <Box
                  sx={{
                    height: 8,
                    borderRadius: '999px',
                    bgcolor: '#edf0fb',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      borderRadius: '999px',
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg, #4f46e5 0%, #6366f1 100%)',
                      transition: 'width 0.4s ease',
                      boxShadow: pct > 80 ? '0 2px 8px rgba(79, 70, 229, 0.3)' : 'none',
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Card>
  );
}
