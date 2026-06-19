'use client';

import Image from 'next/image';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import dashboardImage from '../../../assets/dashboard-owner.png';

const heroChips = ['Tracking publik', 'Multi cabang', 'Update pelanggan'];
const railSteps = ['Order masuk', 'Berkas dicek', 'Diproses', 'Siap ambil'];

export default function HeroSection() {
  return (
    <Box
      component="header"
      className="landing-dossier-grid"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 16, md: 19 },
        pb: { xs: 10, md: 14 },
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 16% 18%, rgba(97, 97, 255, 0.12), transparent 30%), radial-gradient(circle at 86% 28%, rgba(255, 243, 191, 0.7), transparent 26%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, #6161ff 0 28%, #0d63d8 28% 52%, #fff3bf 52% 72%, #10b981 72% 100%)',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          maxWidth: 1280,
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '0.92fr 1.08fr' },
          gap: { xs: 8, lg: 7 },
          alignItems: 'center',
          px: { xs: 2, sm: 3, md: 5 },
        }}
      >
        <Box sx={{ maxWidth: 650, justifySelf: { xs: 'center', lg: 'start' } }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              border: '1px solid rgba(208, 212, 228, 0.82)',
              borderRadius: 6,
              bgcolor: 'rgba(255, 255, 255, 0.86)',
              px: 2.2,
              py: 1,
              mb: 3.5,
              fontSize: 11,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: '#6161ff',
              boxShadow: '0 10px 28px rgba(43, 50, 91, 0.08)',
            }}
          >
            <Box component="span" aria-hidden="true" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
            Ruang kendali biro jasa STNK
          </Box>

          <Box
            component="h1"
            sx={{
              fontSize: { xs: 38, md: 58, lg: 70 },
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: '-0.055em',
              mb: 4,
              color: '#1d2433',
            }}
          >
            Berkas STNK rapi. Cabang terbaca.{' '}
            <Box component="span" sx={{ color: '#6161ff' }}>
              Pelanggan tenang.
            </Box>
          </Box>

          <Box
            component="p"
            sx={{
              fontSize: { xs: 16, md: 18 },
              lineHeight: 1.75,
              color: '#535768',
              maxWidth: 590,
              mb: 4,
            }}
          >
            Catat transaksi, pantau posisi berkas, kirim update pelanggan, dan baca performa cabang dari satu dashboard owner.
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 5 }}>
            {heroChips.map((chip) => (
              <Box
                key={chip}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  borderRadius: 6,
                  border: '1px solid rgba(208, 212, 228, 0.72)',
                  bgcolor: '#ffffff',
                  color: '#535768',
                  px: 1.7,
                  py: 0.8,
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                {chip}
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <Button
              component={Link}
              href="/auth/signup"
              variant="contained"
              color="primary"
              size="large"
              sx={{ px: 4, py: 1.75, borderRadius: 10, fontSize: 15, fontWeight: 800 }}
              endIcon={<Box component="span" aria-hidden="true" className="material-symbols-outlined" sx={{ fontSize: 18 }}>arrow_forward</Box>}
            >
              Daftar SatuJasa
            </Button>
            <Button
              component={Link}
              href="/#workflow"
              variant="outlined"
              size="large"
              sx={{ px: 4, py: 1.75, borderRadius: 10, fontSize: 15, fontWeight: 800, bgcolor: '#ffffff' }}
            >
              Lihat alur kerja
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            position: 'relative',
            width: '100%',
            minHeight: { xs: 360, md: 470, lg: 560 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            justifySelf: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              width: { xs: '86%', md: '80%' },
              height: { xs: '60%', md: '66%' },
              borderRadius: 6,
              background: 'linear-gradient(135deg, rgba(97, 97, 255, 0.34), rgba(13, 99, 216, 0.18), rgba(255, 243, 191, 0.75))',
              filter: 'blur(58px)',
              transform: 'translateY(26px)',
            },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: { xs: 640, lg: 700 },
            }}
          >
            <Box
              sx={{
                overflow: 'hidden',
                borderRadius: 2,
                background: '#ffffff',
                border: '1px solid rgba(208, 212, 228, 0.72)',
                boxShadow: '0 24px 70px rgba(43, 50, 91, 0.14)',
              }}
            >
              <Image
                src={dashboardImage}
                alt="Dashboard owner SatuJasa yang menampilkan ringkasan transaksi, grafik pendapatan, cabang, dan status berkas STNK"
                style={{ width: '100%', height: 'auto', display: 'block' }}
                priority
              />
            </Box>

            <Box
              sx={{
                position: { xs: 'static', md: 'absolute' },
                left: { md: 22 },
                right: { md: 22 },
                bottom: { md: -18 },
                mt: { xs: 1.5, md: 0 },
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                gap: 1,
              }}
            >
              {railSteps.map((step, index) => (
                <Box
                  key={step}
                  sx={{
                    mt: { xs: 10, md: 0 },
                    borderRadius: 1.5,
                    bgcolor: index === railSteps.length - 1 ? '#10b981' : '#ffffff',
                    color: index === railSteps.length - 1 ? '#ffffff' : '#535768',
                    border: '1px solid rgba(208, 212, 228, 0.72)',
                    px: 1.3,
                    py: 0.9,
                    fontSize: 11,
                    fontWeight: 800,
                    textAlign: 'center',
                    boxShadow: '0 10px 24px rgba(43, 50, 91, 0.1)',
                  }}
                >
                  {step}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
