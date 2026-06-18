'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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
              maxWidth: 560,
              mb: 5,
            }}
          >
            SatuJasa membantu biro jasa mencatat transaksi, memantau proses dokumen, memberi kabar pelanggan, dan membaca performa cabang dari satu ruang kerja owner.
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
            <Box sx={{ borderRadius: 4, bgcolor: '#f5f6f8', p: 3, minHeight: 520 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#333333' }}>Owner Dashboard</Typography>
                <Typography sx={{ fontSize: 12, color: '#6161ff', fontWeight: 700 }}>Real UI reference • /owner</Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 2 }}>
                {['Total Transaksi', 'Tenant Aktif', 'Revenue Bulan Ini'].map((label, index) => (
                  <Box key={label} sx={{ borderRadius: 3, bgcolor: '#ffffff', border: '1px solid #e6e8ef', p: 2 }}>
                    <Typography sx={{ fontSize: 12, color: '#7b8192', mb: 1 }}>{label}</Typography>
                    <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#333333' }}>
                      {index === 0 ? '128' : index === 1 ? '3' : 'Rp 24,8jt'}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr' }, gap: 2 }}>
                <Box sx={{ borderRadius: 4, bgcolor: '#ffffff', border: '1px solid #e6e8ef', p: 2.5, minHeight: 260 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#333333', mb: 2 }}>Revenue Overview</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'end', gap: 1.25, height: 180 }}>
                    {[36, 54, 42, 70, 62, 88, 74].map((value) => (
                      <Box key={value} sx={{ flex: 1, borderRadius: '9999px 9999px 0 0', bgcolor: '#6161ff', opacity: 0.92, height: `${value}%` }} />
                    ))}
                  </Box>
                </Box>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Box sx={{ borderRadius: 4, bgcolor: '#ffffff', border: '1px solid #e6e8ef', p: 2.5 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#333333', mb: 1 }}>Subscription</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 800, color: '#6161ff' }}>Plus</Typography>
                    <Typography sx={{ fontSize: 12, color: '#7b8192', mt: 0.5 }}>3 tenant • 3 admin user</Typography>
                  </Box>
                  <Box sx={{ borderRadius: 4, bgcolor: '#ffffff', border: '1px solid #e6e8ef', p: 2.5 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#333333', mb: 1 }}>Status Sistem</Typography>
                    <Typography sx={{ fontSize: 14, color: '#535768', lineHeight: 1.7 }}>
                      Monitoring transaksi, performa cabang, dan notifikasi pelanggan dalam satu tampilan ringkas.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
