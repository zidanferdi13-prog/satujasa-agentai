'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const productLinks = [
  { label: 'Fitur', href: '/#features' },
  { label: 'Solusi', href: '/#solutions' },
  { label: 'Alur kerja', href: '/#workflow' },
  { label: 'Harga', href: '/#pricing' },
];

const supportLinks = [
  { label: 'FAQ', href: '/#faq' },
  { label: 'Masuk', href: '/auth/signin' },
  { label: 'Daftar', href: '/auth/signup' },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: '#ffffff', borderTop: '1px solid', borderColor: 'rgba(208, 212, 228, 0.5)' }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1.4fr' },
          gap: 4,
          px: { xs: 2, md: 4 },
          py: { xs: 6, md: 8 },
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#1d2433', mb: 1 }}>
            SatuJasa
          </Typography>
          <Typography sx={{ color: '#535768', fontSize: 14, maxWidth: 320, mb: 3, lineHeight: 1.8 }}>
            Ruang kendali biro jasa STNK untuk merapikan transaksi, status berkas, dan laporan cabang.
          </Typography>
          <Box sx={{ display: 'inline-flex', borderRadius: 5, bgcolor: '#fff3bf', color: '#8a5a00', px: 1.6, py: 0.8, fontSize: 11, fontWeight: 900, letterSpacing: '0.12em' }}>
            B 1234 STJ
          </Box>
        </Box>

        <Box>
          <Typography sx={{ fontWeight: 900, mb: 2, color: '#1d2433' }}>Produk</Typography>
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 1.4 }}>
            {productLinks.map((item) => (
              <Box component="li" key={item.href}>
                <Typography
                  component={Link}
                  href={item.href}
                  sx={{ color: '#535768', fontSize: 14, textDecoration: 'none', '&:hover': { color: '#6161ff' } }}
                >
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box>
          <Typography sx={{ fontWeight: 900, mb: 2, color: '#1d2433' }}>Akses</Typography>
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 1.4 }}>
            {supportLinks.map((item) => (
              <Box component="li" key={item.href}>
                <Typography
                  component={Link}
                  href={item.href}
                  sx={{ color: '#535768', fontSize: 14, textDecoration: 'none', '&:hover': { color: '#6161ff' } }}
                >
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ borderRadius: 1, bgcolor: '#f5f6f8', p: 3 }}>
          <Typography sx={{ fontWeight: 900, mb: 1, color: '#1d2433' }}>Status operasional</Typography>
          <Typography sx={{ color: '#535768', fontSize: 14, lineHeight: 1.7, mb: 2 }}>
            Order masuk → diproses → siap ambil → selesai. Semua tercatat di satu tempat.
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.8 }}>
            {['Draft', 'Proses', 'Selesai'].map((item, index) => (
              <Box key={item} sx={{ borderRadius: 5, bgcolor: index === 2 ? '#10b981' : '#ffffff', color: index === 2 ? '#ffffff' : '#535768', px: 1.2, py: 0.6, fontSize: 11, fontWeight: 800 }}>
                {item}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          borderTop: '1px solid rgba(208, 212, 228, 0.45)',
          py: 3,
          textAlign: 'center',
          color: '#535768',
          fontSize: 13,
        }}
      >
        &copy; 2026 SatuJasa. Ruang kendali biro jasa STNK.
      </Box>
    </Box>
  );
}
