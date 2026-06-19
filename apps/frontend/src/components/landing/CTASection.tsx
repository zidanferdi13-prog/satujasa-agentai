'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const rail = ['Order', 'Proses', 'Siap ambil', 'Selesai'];

export default function CTASection() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 }, position: 'relative', overflow: 'hidden', bgcolor: '#f5f6f8' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <Box
          sx={{
            bgcolor: '#0b1f3a',
            color: '#ffffff',
            p: { xs: 4, md: 8 },
            borderRadius: { xs: 4, md: 6 },
            boxShadow: '0 30px 90px rgba(11, 31, 58, 0.22)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 25% 20%, rgba(97, 97, 255, 0.42), transparent 34%), radial-gradient(circle at 78% 70%, rgba(255, 243, 191, 0.16), transparent 28%)',
            },
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                letterSpacing: '-0.045em',
                mb: 2,
                color: '#ffffff',
                fontSize: { xs: 30, md: 48 },
                lineHeight: 1,
              }}
            >
              Rapikan alur berkas STNK mulai hari ini.
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 15, md: 18 },
                lineHeight: 1.75,
                color: 'rgba(255, 255, 255, 0.72)',
                mb: 4,
                maxWidth: 640,
                mx: 'auto',
              }}
            >
              Mulai dari transaksi pertama, lalu biarkan status, laporan, dan update pelanggan mengikuti alur yang sama.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mb: 4 }}>
              {rail.map((item, index) => (
                <Box key={item} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ borderRadius: 5, bgcolor: index === rail.length - 1 ? '#10b981' : 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.14)', px: 1.8, py: 0.8, fontSize: 12, fontWeight: 800 }}>
                    {item}
                  </Box>
                  {index < rail.length - 1 && <Box sx={{ width: 18, height: 2, bgcolor: 'rgba(255,255,255,0.25)' }} />}
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
              <Button
                component={Link}
                href="/auth/signup"
                variant="contained"
                sx={{
                  bgcolor: '#ffffff',
                  color: '#6161ff',
                  fontWeight: 800,
                  px: 5,
                  py: 1.65,
                  fontSize: 16,
                  borderRadius: 10,
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                }}
              >
                Daftar Sekarang
              </Button>
              <Button
                component={Link}
                href="/auth/signin"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.28)',
                  color: '#ffffff',
                  fontWeight: 800,
                  px: 5,
                  py: 1.65,
                  fontSize: 16,
                  borderRadius: 10,
                  '&:hover': { borderColor: 'rgba(255, 255, 255, 0.62)', bgcolor: 'rgba(255, 255, 255, 0.08)' },
                }}
              >
                Masuk Dashboard
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
