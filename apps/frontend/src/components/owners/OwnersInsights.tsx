'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Link from 'next/link';

export default function OwnersInsights() {
  return (
    <Box sx={{ width: { xs: '100%', xl: 350 }, display: 'flex', flexDirection: { xs: 'column', md: 'row', xl: 'column' }, gap: 3 }}>
      {/* Tier Distribution */}
      <Card sx={{ flex: 1, p: 3, borderRadius: '22px', border: '1px solid #e5e9f3', boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)', background: 'rgba(255,255,255,0.94)' }}>
        <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1d2433', mb: 0.5 }}>Tier Distribution</Typography>
        <Typography sx={{ fontSize: 13, color: 'var(--dash-muted)', mb: 2.5 }}>Komposisi subscription owner</Typography>
        <Box sx={{ position: 'relative', height: 172, width: 172, mx: 'auto', mb: 3 }}>
          <Box sx={{
            inset: 0, position: 'absolute', borderRadius: '50%',
            background: 'conic-gradient(var(--dash-primary) 0% 40%, var(--dash-violet) 40% 70%, var(--dash-green) 70% 90%, var(--dash-orange) 90% 100%)',
            boxShadow: '0 14px 28px rgba(79,70,229,0.14)',
          }} />
          <Box sx={{
            position: 'absolute', inset: 34, borderRadius: '50%', bgcolor: 'white',
            display: 'grid', placeItems: 'center', boxShadow: 'inset 0 2px 8px rgba(30,41,59,0.05)'
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#1d2433', lineHeight: 1 }}>100%</Typography>
              <Typography sx={{ fontSize: 10, color: 'var(--dash-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', mt: 0.5 }}>Coverage</Typography>
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
      <Card sx={{ flex: 1, p: 3, borderRadius: '22px', border: '1px solid #e5e9f3', boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)', background: 'rgba(255,255,255,0.94)' }}>
        <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1d2433', mb: 0.5 }}>Owner Growth</Typography>
        <Typography sx={{ fontSize: 13, color: 'var(--dash-muted)', mb: 3 }}>Last 30 days performance</Typography>

        <Box sx={{ height: 130, mb: 3, position: 'relative', borderRadius: '18px', bgcolor: '#f8f9fc', p: 1.5, overflow: 'hidden' }}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path d="M0,80 Q25,75 50,40 T100,20 L100,100 L0,100 Z" fill="url(#growthGradient)" />
            <path d="M0,80 Q25,75 50,40 T100,20" fill="none" stroke="var(--dash-primary)" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </Box>

        <Link href="/admin/laporan" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 800, color: 'var(--dash-primary)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            Lihat laporan lengkap <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
          </Typography>
        </Link>
      </Card>
    </Box>
  );
}

function LegendItem({ color, label, val }: { color: string, label: string, val: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.1, p: 1.25, borderRadius: '12px', bgcolor: '#f8f9fc', border: '1px solid #eef0f6' }}>
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
      <Box>
        <Typography sx={{ fontSize: 12, fontWeight: 800, color: '#1d2433', lineHeight: 1.2 }}>{label}</Typography>
        <Typography sx={{ fontSize: 11, color: 'var(--dash-muted)', lineHeight: 1.2, mt: 0.3 }}>{val}</Typography>
      </Box>
    </Box>
  );
}
