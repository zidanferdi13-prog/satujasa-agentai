'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 2.5,
          }}
        >
          {features.map(({ icon, title, desc }) => (
            <Card
              key={title}
              sx={{
                borderRadius: '2rem',
                p: 2.5,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
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
                <Typography sx={{ fontSize: 14, lineHeight: 1.6, color: '#535768' }}>
                  {desc}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Data control visual — system screenshot reference */}
        <Box sx={{ mt: 8 }}>
          <Card sx={{ borderRadius: '2rem', bgcolor: '#ffffff' }}>
            <CardContent sx={{ p: { xs: 3, md: 4 }, display: 'flex', alignItems: 'center', gap: 4, minHeight: 320 }}>
              <Box sx={{ flex: 1, minHeight: 300, bgcolor: '#f5f6f8', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ textAlign: 'center', color: '#999999' }}>
                  <Box component="span" className="material-symbols-outlined" sx={{ display: 'block', fontSize: 48, mb: 1 }}>
                    analytics
                  </Box>
                  <Typography sx={{ fontSize: 14, color: '#999999' }}>
                    System Dashboard
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#6161ff', mb: 1.5 }}>
                  Kontrol Data Terpusat
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 2 }}>
                  Semua Metrik Bisnis di Ujung Jari
                </Typography>
                <Typography sx={{ fontSize: 14, lineHeight: 1.7, color: '#535768', mb: 3 }}>
                  Dashboard interaktif menampilkan ringkasan transaksi, performa per cabang, tren revenue, dan insight bisnis real-time untuk pengambilan keputusan yang lebih cepat.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
