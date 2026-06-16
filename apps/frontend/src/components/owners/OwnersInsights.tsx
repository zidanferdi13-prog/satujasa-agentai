'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Link from 'next/link';

export default function OwnersInsights() {
  return (
    <Box sx={{ width: 350, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Tier Distribution */}
      <Card sx={{ p: 3, borderRadius: '22px', border: '1px solid var(--dash-line)', boxShadow: 'var(--dash-shadow-soft)' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 2.5 }}>Tier Distribution</Typography>
        <Box sx={{ position: 'relative', height: 160, width: 160, mx: 'auto', mb: 3 }}>
          <Box sx={{ 
            inset: 0, position: 'absolute', borderRadius: '50%',
            background: 'conic-gradient(var(--dash-primary) 0% 40%, var(--dash-violet) 40% 70%, var(--dash-green) 70% 90%, var(--dash-orange) 90% 100%)'
          }} />
          <Box sx={{ 
            position: 'absolute', inset: 30, borderRadius: '50%', bgcolor: 'white',
            display: 'grid', placeItems: 'center'
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: 18, fontWeight: 800 }}>100%</Typography>
              <Typography sx={{ fontSize: 10, color: 'var(--dash-muted)' }}>Coverage</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <LegendItem color="var(--dash-primary)" label="Pro" val="40%" />
          <LegendItem color="var(--dash-violet)" label="Plus" val="30%" />
          <LegendItem color="var(--dash-green)" label="Extreme" val="20%" />
          <LegendItem color="var(--dash-orange)" label="Free" val="10%" />
        </Box>
      </Card>

      {/* Growth */}
      <Card sx={{ p: 3, borderRadius: '22px', border: '1px solid var(--dash-line)', boxShadow: 'var(--dash-shadow-soft)' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1 }}>Owner Growth</Typography>
        <Typography sx={{ fontSize: 12, color: 'var(--dash-muted)', mb: 3 }}>Last 30 days performance</Typography>
        
        <Box sx={{ height: 120, mb: 3, position: 'relative' }}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d="M0,80 Q25,75 50,40 T100,20 L100,100 L0,100 Z" 
              fill="url(#growthGradient)" 
              opacity="0.2"
            />
            <path 
              d="M0,80 Q25,75 50,40 T100,20" 
              fill="none" 
              stroke="var(--dash-primary)" 
              strokeWidth="3" 
              strokeLinecap="round" 
            />
            <defs>
              <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--dash-primary)" />
                <stop offset="100%" stopColor="white" />
              </linearGradient>
            </defs>
          </svg>
        </Box>

        <Link href="/admin/laporan" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'var(--dash-primary)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            Lihat laporan lengkap <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
          </Typography>
        </Link>
      </Card>
    </Box>
  );
}

function LegendItem({ color, label, val }: { color: string, label: string, val: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
      <Box>
        <Typography sx={{ fontSize: 11, fontWeight: 600 }}>{label}</Typography>
        <Typography sx={{ fontSize: 10, color: 'var(--dash-muted)' }}>{val}</Typography>
      </Box>
    </Box>
  );
}
