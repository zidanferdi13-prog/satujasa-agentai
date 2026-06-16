'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

interface HealthData {
  server: string;
  database: string;
  backup: string;
  api: string;
  security: string;
}

interface OwnerHealthProps {
  health?: HealthData;
}

function HealthItem({ label, status }: { label: string; status: string }) {
  const isOk = status?.toLowerCase() === 'operational' || status?.toLowerCase() === 'healthy' || status?.toLowerCase() === 'ok';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: isOk ? '#22c7b8' : '#f6a326',
            boxShadow: isOk ? '0 0 6px rgba(34,199,184,0.5)' : '0 0 6px rgba(246,163,38,0.5)',
          }}
        />
        <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#2d3142' }}>{label}</Typography>
      </Box>
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 600,
          color: isOk ? '#22c7b8' : '#f6a326',
          px: 1,
          py: 0.25,
          borderRadius: '6px',
          bgcolor: isOk ? '#e6faf8' : '#fff4e6',
        }}
      >
        {isOk ? 'Normal' : 'Perhatian'}
      </Typography>
    </Box>
  );
}

export default function OwnerHealth({ health }: OwnerHealthProps) {
  const h = health ?? {
    server: 'operational',
    database: 'operational',
    backup: 'operational',
    api: 'operational',
    security: 'operational',
  };

  const allOk = Object.values(h).every((v) => v?.toLowerCase() === 'operational' || v?.toLowerCase() === 'healthy' || v?.toLowerCase() === 'ok');

  const items = [
    { label: 'Server', status: h.server },
    { label: 'Database', status: h.database },
    { label: 'Backup', status: h.backup },
    { label: 'API', status: h.api },
    { label: 'Security', status: h.security },
  ];

  return (
    <Card sx={{ borderRadius: '22px', border: '1px solid #e8eaf0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', p: 2.5 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1a1d2e', mb: 2 }}>
        System Health
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {items.map((item) => (
          <HealthItem key={item.label} label={item.label} status={item.status} />
        ))}
      </Box>

      <Box
        sx={{
          mt: 2,
          p: 1.5,
          borderRadius: '12px',
          bgcolor: allOk ? '#e6faf8' : '#fff4e6',
          textAlign: 'center',
        }}
      >
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: allOk ? '#22c7b8' : '#f6a326' }}>
          {allOk ? '✅ Semua sistem berjalan dengan baik' : '⚠️ Beberapa sistem perlu perhatian'}
        </Typography>
      </Box>
    </Card>
  );
}
