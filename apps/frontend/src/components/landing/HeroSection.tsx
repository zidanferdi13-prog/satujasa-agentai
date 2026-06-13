'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import splash from '../../../assets/splash.png';

export default function HeroSection() {
  return (
    <Box
      component="header"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 16, md: 20 },
        pb: { xs: 12, md: 16 },
      }}
    >
      {/* Gradient rainbow bar at top */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'conic-gradient(from 270deg, #8181ff 15%, #33dbdb 40%, #33d58e 55%, #ffd633 65%, #fc527d 85%, #8181ff 100%)',
        }}
      />

      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.05fr 0.95fr' },
          gap: { xs: 8, lg: 12 },
          alignItems: 'end',
          px: { xs: 2, sm: 3, md: 5 },
        }}
      >
        {/* Left — text content */}
        <Box sx={{ maxWidth: 640 }}>
          <Box
            sx={{
              display: 'inline-flex',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: '#d0d4e4',
              bgcolor: '#ffffff',
              px: 3,
              py: 1,
              mb: 4,
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: '#6161ff',
            }}
          >
            Platform kerja biro jasa STNK
          </Box>

          <Box
            sx={{
              fontSize: { xs: 36, md: 56, lg: 68 },
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              mb: 4,
              background: 'linear-gradient(90deg, #fe81e4, #fda900)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Operasional STNK yang tidak lagi tercecer.
          </Box>

          <Box
            sx={{
              fontSize: { xs: 16, md: 18 },
              lineHeight: 1.7,
              color: '#535768',
              maxWidth: 520,
              mb: 5,
            }}
          >
            SatuJasa membantu biro jasa mencatat transaksi, memantau proses dokumen,
            memberi kabar pelanggan, dan membaca performa cabang dari satu ruang kerja.
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <Link href="/auth/signup">
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ px: 4, py: 1.75, borderRadius: '9999px', fontSize: 15, fontWeight: 600 }}
                endIcon={<Box component="span" className="material-symbols-outlined" sx={{ fontSize: 18 }}>arrow_forward</Box>}
              >
                Daftar SatuJasa
              </Button>
            </Link>
            <Link href="/auth/signin" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" size="large" sx={{ px: 4, py: 1.75, borderRadius: '9999px', fontSize: 15, fontWeight: 600 }}>
                Masuk ke Dashboard
              </Button>
            </Link>
          </Box>
        </Box>

        {/* Right — splash mockup */}
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              borderRadius: 6,
              border: '1px solid',
              borderColor: '#d0d4e4',
              bgcolor: '#ffffff',
              p: 2,
              boxShadow: 'rgba(205, 208, 223, 0.4) 0px 2px 48px 0px',
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src={splash.src}
              alt="Tampilan aplikasi SatuJasa"
              sx={{ display: 'block', width: 1, maxHeight: 540, objectFit: 'contain', objectPosition: 'top' }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
