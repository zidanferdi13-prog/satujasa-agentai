'use client';

import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import type { SystemHealthData } from '@/types/dashboard';

type SystemHealthProps = {
  data?: SystemHealthData;
};

const DEFAULT_DATA: SystemHealthData = {
  server: 'operational',
  database: 'operational',
  backup: 'operational',
};

const SERVICE_CONFIG: {
  key: keyof SystemHealthData;
  label: string;
  icon: string;
}[] = [
  { key: 'server', label: 'Server', icon: 'dns' },
  { key: 'database', label: 'Database', icon: 'storage' },
  { key: 'backup', label: 'Backup', icon: 'backup' },
];

const STATUS_LABEL: Record<string, string> = {
  operational: 'Operational',
  degraded: 'Degraded',
  down: 'Down',
};

const STATUS_COLOR: Record<string, string> = {
  operational: '#22c55e',
  degraded: '#f59e0b',
  down: '#ef4444',
};

const STATUS_BG: Record<string, string> = {
  operational: '#ecfdf3',
  degraded: '#fff7ed',
  down: '#fef2f2',
};

function MaterialIcon({ name }: { name: string }) {
  return (
    <Box
      component="span"
      className="material-symbols-outlined"
      sx={{ fontSize: 28, color: 'var(--dash-primary)', lineHeight: 1 }}
    >
      {name}
    </Box>
  );
}

export default function SystemHealth({ data }: SystemHealthProps) {
  const health = data ?? DEFAULT_DATA;

  return (
    <Card
      sx={{
        borderRadius: '22px',
        border: '1px solid #e5e9f3',
        boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
        background: 'rgba(255,255,255,0.94)',
        height: '100%',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18, color: 'var(--dash-text)', mb: 0.5 }}>
            System Health
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 13, color: '#8a91a3' }}>
            Status layanan platform
          </Typography>
        </Box>

        {/* Status list */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {SERVICE_CONFIG.map((svc) => {
            const status = health[svc.key];
            const label = STATUS_LABEL[status] ?? 'Unknown';
            const color = STATUS_COLOR[status] ?? '#6b7280';
            const bg = STATUS_BG[status] ?? '#f9fafb';

            return (
              <Box
                key={svc.key}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: '14px',
                  border: '1px solid #e5e9f3',
                  transition: 'all 0.15s',
                  '&:hover': {
                    bgcolor: '#f8f9fc',
                    borderColor: '#d0d4e4',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: bg,
                    flexShrink: 0,
                  }}
                >
                  <Box
                    component="span"
                    className="material-symbols-outlined"
                    sx={{ fontSize: 22, color, lineHeight: 1 }}
                  >
                    {svc.icon}
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'var(--dash-text)', mb: 0.3 }}>
                    {svc.label}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: '#8a91a3' }}>
                    {label}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '999px',
                    fontSize: 11,
                    fontWeight: 600,
                    color,
                    bgcolor: bg,
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: color,
                      flexShrink: 0,
                    }}
                  />
                  {label}
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Bottom button */}
        <Button
          component={Link}
          href="/admin/system"
          variant="outlined"
          fullWidth
          sx={{
            mt: 2.5,
            borderRadius: '14px',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--dash-primary)',
            borderColor: '#e5e9f3',
            textTransform: 'none',
            py: 1.25,
            '&:hover': {
              borderColor: 'var(--dash-primary)',
              bgcolor: 'transparent',
            },
          }}
        >
          Lihat detail sistem &rarr;
        </Button>
      </Box>
    </Card>
  );
}
