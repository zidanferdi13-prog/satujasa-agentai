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
    { label: 'Total Owners', val: data.total, icon: '👥', color: 'var(--dash-primary)', delta: data.total_delta },
    { label: 'Active Owners', val: data.active, icon: '✅', color: 'var(--dash-green)', delta: data.active_delta },
    { label: 'Free Tier', val: data.free, icon: '🎁', color: 'var(--dash-orange)', delta: data.free_delta },
    { label: 'Paid Tier', val: data.paid, icon: '👑', color: 'var(--dash-violet)', delta: data.paid_delta },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
      {kpis.map((kpi, i) => (
        <Card key={i} sx={{ 
          minHeight: 112, 
          borderRadius: '22px', 
          p: 2.5, 
          boxShadow: 'var(--dash-shadow-soft)', 
          border: '1px solid var(--dash-line)',
          display: 'grid',
          gridTemplateColumns: '48px 1fr 60px',
          gap: 2,
          alignItems: 'center'
        }}>
          <Box sx={{ width: 48, height: 48, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: `${kpi.color}1a`, color: kpi.color, fontSize: 20 }}>
            {kpi.icon}
          </Box>
          <Box>
            <Typography sx={{ fontSize: 13, color: 'var(--dash-muted)', fontWeight: 500 }}>{kpi.label}</Typography>
            <Typography sx={{ fontSize: 28, fontWeight: 800, lineHeight: 1.1 }}>{kpi.val}</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: kpi.delta.startsWith('+') ? 'var(--dash-green)' : 'var(--dash-orange)' }}>
              {kpi.delta}
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
}
