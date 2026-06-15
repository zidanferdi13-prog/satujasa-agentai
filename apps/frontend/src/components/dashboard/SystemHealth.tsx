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
        border: '1px solid var(--dash-line)',
        boxShadow: 'var(--dash-shadow-soft)',
        background: '#ffffff',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16, color: 'var(--dash-text)', mb: 2 }}>
          System Health
        </Typography>

        {/* 3-column grid; collapses to 1 on mobile */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
            gap: 2,
          }}
        >
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
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 2,
                  borderRadius: '16px',
                  border: '1px solid var(--dash-line)',
                }}
              >
                <MaterialIcon name={svc.icon} />
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'var(--dash-text)' }}>
                  {svc.label}
                </Typography>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 1.5,
                    py: 0.4,
                    borderRadius: '999px',
                    fontSize: 11,
                    fontWeight: 600,
                    color,
                    bgcolor: bg,
                  }}
                >
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
            mt: 2,
            borderRadius: '12px',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--dash-primary)',
            borderColor: 'var(--dash-line)',
            textTransform: 'none',
            py: 1,
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
