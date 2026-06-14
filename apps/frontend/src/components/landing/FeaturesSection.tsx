'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const features = [
  {
    icon: 'inventory_2',
    title: 'Manajemen Transaksi',
    desc: 'Input data STNK/BPKB, biaya, dan estimasi waktu selesai dalam sekejap.',
  },
  {
    icon: 'public',
    title: 'Tracking Publik',
    desc: 'Link tracking khusus untuk pelanggan tanpa perlu login ke sistem.',
  },
  {
    icon: 'hub',
    title: 'Multi Cabang',
    desc: 'Kelola banyak lokasi operasional dalam satu platform dashboard pusat.',
  },
  {
    icon: 'analytics',
    title: 'Revenue Analytics',
    desc: 'Analisis omzet dan profit harian, mingguan, hingga bulanan secara otomatis.',
  },
];

export default function FeaturesSection() {
  return (
    <Box component="section" sx={{ bgcolor: '#f5f6f8', py: { xs: 8, md: 12 } }} id="features">
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Box sx={{ mb: 6, display: 'grid', gap: 3, gridTemplateColumns: { lg: '0.8fr 1.2fr' }, alignItems: 'end' }}>
          <Typography
            sx={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#6161ff' }}
          >
            Fitur inti
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.04em', maxWidth: 720 }}>
            Dibuat untuk alur kerja biro jasa, bukan dashboard generik.
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: '1.2fr 0.9fr 0.9fr' },
            gap: 2.5,
          }}
        >
          {features.map(({ icon, title, desc }, index) => (
            <Card
              key={title}
              sx={{
                borderRadius: '2rem',
                p: index === 0 ? { xs: 2.5, lg: 3.5 } : 2.5,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
                ...(index === 0 ? { gridRow: { lg: 'span 2' } } : {}),
              }}
            >
              <CardContent sx={{ p: '0 !important' }}>
                <Box
                  component="span"
                  className="material-symbols-outlined"
                  sx={{ display: 'block', mb: 2, fontSize: 32, color: '#6161ff' }}
                >
                  {icon}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 1.5 }}>
                  {title}
                </Typography>
                <Typography sx={{ mb: 2.5, fontSize: 14, lineHeight: 1.6, color: '#535768' }}>
                  {desc}
                </Typography>
                <Button
                  variant="text"
                  sx={{ fontWeight: 700, fontSize: 13, p: 0, '&:hover': { bgcolor: 'transparent' } }}
                  endIcon={<Box component="span" className="material-symbols-outlined" sx={{ fontSize: 16 }}>chevron_right</Box>}
                >
                  Pelajari selengkapnya
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
