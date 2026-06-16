'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { OwnersKpi } from '@/types/owner';

interface OwnersKpiGridProps {
  data: OwnersKpi;
}

export default function OwnersKpiGrid({ data }: OwnersKpiGridProps) {
  const kpis = [
    { label: 'Total Owners', val: data.total, icon: '👥', color: 'var(--dash-primary)', bg: '#eef2ff', delta: data.total_delta },
    { label: 'Active Owners', val: data.active, icon: '✅', color: 'var(--dash-green)', bg: '#ecfdf3', delta: data.active_delta },
    { label: 'Free Tier', val: data.free, icon: '🎁', color: 'var(--dash-orange)', bg: '#fff7ed', delta: data.free_delta },
    { label: 'Paid Tier', val: data.paid, icon: '👑', color: 'var(--dash-violet)', bg: '#f5f3ff', delta: data.paid_delta },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
      {kpis.map((kpi) => (
        <Card
          key={kpi.label}
          sx={{
            borderRadius: '18px',
            p: 2,
            boxShadow: '0 10px 24px rgba(30, 41, 59, 0.06)',
            border: '1px solid #e5e9f3',
            background: 'rgba(255,255,255,0.94)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 14px 32px rgba(30, 41, 59, 0.09)',
            },
          }}
        >
          <Box sx={{ width: 44, height: 44, borderRadius: '13px', display: 'grid', placeItems: 'center', bgcolor: kpi.bg, color: kpi.color, fontSize: 19, flexShrink: 0 }}>
            {kpi.icon}
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontSize: 11, color: 'var(--dash-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.3 }}>
              {kpi.label}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography sx={{ fontSize: 24, fontWeight: 800, lineHeight: 1, color: '#1d2433' }}>{kpi.val}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 800, color: kpi.delta.startsWith('+') ? 'var(--dash-green)' : 'var(--dash-orange)' }}>
                {kpi.delta}
              </Typography>
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );
}
