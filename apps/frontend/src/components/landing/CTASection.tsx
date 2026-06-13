import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function CTASection() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 }, position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <Box
          sx={{
            bgcolor: '#6161ff',
            color: '#ffffff',
            p: { xs: 5, md: 8 },
            borderRadius: '3rem',
            boxShadow: '0 8px 32px rgba(97, 97, 255, 0.25)',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.04em',
              mb: 2,
              color: '#ffffff',
              fontSize: { xs: 28, md: 40 },
            }}
          >
            Siap digitalisasi operasional jasa STNK Anda?
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: 15, md: 18 },
              lineHeight: 1.7,
              color: 'rgba(255, 255, 255, 0.8)',
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Mulai rapikan transaksi, status dokumen, dan komunikasi pelanggan tanpa mengganti cara
            kerja tim secara drastis.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
            <Button
              component={Link}
              href="/auth/signup"
              variant="contained"
              sx={{
                bgcolor: '#ffffff',
                color: '#6161ff',
                fontWeight: 700,
                px: 6,
                py: 1.75,
                fontSize: 16,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                },
              }}
            >
              Daftar Sekarang
            </Button>
            <Button
              component={Link}
              href="/auth/help"
              variant="outlined"
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                fontWeight: 700,
                px: 6,
                py: 1.75,
                fontSize: 16,
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.6)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Bantuan Login
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.1,
          background: 'radial-gradient(circle at center, #6161ff, transparent)',
        }}
      />
    </Box>
  );
}
