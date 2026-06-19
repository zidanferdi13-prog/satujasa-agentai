'use client';

import Image from 'next/image';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import dashboardImage from '../../../assets/dashboard-admin.png';

const features = [
  {
    icon: 'inventory_2',
    title: 'Manajemen Transaksi',
    desc: 'Input data STNK/BPKB, biaya, dan estimasi selesai tanpa rekap ulang.',
  },
  {
    icon: 'public',
    title: 'Link Tracking Pelanggan',
    desc: 'Pelanggan cek status sendiri tanpa perlu login atau menunggu balasan admin.',
  },
  {
    icon: 'hub',
    title: 'Multi Cabang',
    desc: 'Kelola lokasi, admin, dan tenant dari satu dashboard owner.',
  },
  {
    icon: 'analytics',
    title: 'Laporan Omzet & Profit',
    desc: 'Baca performa harian, bulanan, dan per cabang dengan lebih cepat.',
  },
];

export default function FeaturesSection() {
  return (
    <Box component="section" sx={{ bgcolor: '#f5f6f8', py: { xs: 8, md: 12 } }} id="features">
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Box sx={{ mb: 6, display: 'grid', gap: 3, gridTemplateColumns: { lg: '0.75fr 1.25fr' }, alignItems: 'end' }}>
          <Typography
            sx={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#6161ff' }}
          >
            Fitur inti
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.045em', maxWidth: 760, color: '#1d2433', lineHeight: 1 }}>
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
                borderRadius: 2.5,
                p: 2.5,
                border: '1px solid rgba(208, 212, 228, 0.72)',
                boxShadow: '0 12px 34px rgba(43, 50, 91, 0.05)',
                transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-4px)', borderColor: 'rgba(97, 97, 255, 0.44)', boxShadow: '0 18px 50px rgba(43, 50, 91, 0.08)' },
              }}
            >
              <CardContent sx={{ p: '0 !important' }}>
                <Box
                  component="span"
                  className="material-symbols-outlined"
                  sx={{ display: 'inline-flex', mb: 2.5, p: 1.2, borderRadius: 1.5, fontSize: 28, color: '#6161ff', bgcolor: '#eeefff' }}
                >
                  {icon}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 1.5, color: '#1d2433' }}>
                  {title}
                </Typography>
                <Typography sx={{ fontSize: 14, lineHeight: 1.7, color: '#535768' }}>
                  {desc}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ mt: 8 }}>
          <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: '1px solid rgba(208, 212, 228, 0.72)', boxShadow: '0 24px 70px rgba(43, 50, 91, 0.08)', overflow: 'hidden' }}>
            <CardContent sx={{ p: { xs: 2, md: 3 }, display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' }, alignItems: 'center', gap: { xs: 3, md: 5 } }}>
              <Box
                sx={{
                  minHeight: 300,
                  bgcolor: '#f5f6f8',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  p: { xs: 1.5, md: 2 },
                  position: 'relative',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1, pb: 1.5, fontSize: 11, fontWeight: 800, color: '#535768' }}>
                  <Box>Owner Dashboard</Box>
                  <Box sx={{ bgcolor: '#fff3bf', color: '#8a5a00', borderRadius: 1.5, px: 1.2, py: 0.4 }}>Cabang aktif</Box>
                </Box>
                <Image
                  src={dashboardImage}
                  alt="Dashboard SatuJasa"
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }}
                />
              </Box>
              <Box sx={{ pr: { lg: 3 } }}>
                <Typography sx={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#6161ff', mb: 1.5 }}>
                  Kontrol Data Terpusat
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.04em', mb: 2, color: '#1d2433', lineHeight: 1.05 }}>
                  Semua metrik bisnis di ujung jari owner.
                </Typography>
                <Typography sx={{ fontSize: 15, lineHeight: 1.8, color: '#535768', mb: 3 }}>
                  Dashboard menampilkan ringkasan transaksi, performa cabang, tren revenue, dan aktivitas terbaru agar owner tidak menunggu laporan manual.
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['Revenue', 'Tenant', 'Aktivitas', 'Subscription'].map((label) => (
                    <Box key={label} sx={{ borderRadius: 1.5, bgcolor: '#f5f6f8', color: '#535768', px: 1.6, py: 0.8, fontSize: 12, fontWeight: 800 }}>
                      {label}
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
