'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: '#ffffff', borderTop: '1px solid', borderColor: 'rgba(208, 212, 228, 0.3)' }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(6, 1fr)' },
          gap: 4,
          px: { xs: 2, md: 4 },
          py: { xs: 6, md: 8 },
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        {/* Brand */}
        <Box sx={{ gridColumn: { xs: 'span 2', md: 'span 2' } }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: '#6161ff', mb: 2 }}
          >
            STNK SatuJasa
          </Typography>
          <Typography sx={{ color: '#535768', fontSize: 14, maxWidth: 280, mb: 4 }}>
            Pionir solusi digital manajemen biro jasa surat kendaraan bermotor di Indonesia.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box component="span" className="material-symbols-outlined" sx={{ color: '#6161ff', cursor: 'pointer', '&:hover': { transform: 'scale(1.1)' }, transition: 'transform 0.2s' }}>
              public
            </Box>
            <Box component="span" className="material-symbols-outlined" sx={{ color: '#6161ff', cursor: 'pointer', '&:hover': { transform: 'scale(1.1)' }, transition: 'transform 0.2s' }}>
              smartphone
            </Box>
            <Box component="span" className="material-symbols-outlined" sx={{ color: '#6161ff', cursor: 'pointer', '&:hover': { transform: 'scale(1.1)' }, transition: 'transform 0.2s' }}>
              alternate_email
            </Box>
          </Box>
        </Box>

        {/* Product */}
        <Box>
          <Typography sx={{ fontWeight: 700, mb: 2 }}>Product</Typography>
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {['Features', 'Pricing', 'Updates'].map((item) => (
              <Box component="li" key={item}>
                <Typography
                  component="a"
                  href="#"
                  sx={{ color: '#535768', fontSize: 14, textDecoration: 'none', '&:hover': { color: '#6161ff' } }}
                >
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Company */}
        <Box>
          <Typography sx={{ fontWeight: 700, mb: 2 }}>Company</Typography>
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {['About', 'Contact', 'Careers'].map((item) => (
              <Box component="li" key={item}>
                <Typography
                  component="a"
                  href="#"
                  sx={{ color: '#535768', fontSize: 14, textDecoration: 'none', '&:hover': { color: '#6161ff' } }}
                >
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Subscribe */}
        <Box sx={{ gridColumn: { xs: 'span 2', md: 'span 2' } }}>
          <Typography sx={{ fontWeight: 700, mb: 2 }}>Subscribe</Typography>
          <Typography sx={{ color: '#535768', fontSize: 14, mb: 2 }}>
            Dapatkan tips manajemen bisnis langsung di email Anda.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box
              component="input"
              placeholder="Email Anda"
              type="email"
              sx={{
                flexGrow: 1,
                bgcolor: '#f5f6f8',
                border: '1px solid',
                borderColor: '#d0d4e4',
                borderRadius: 2,
                px: 2,
                py: 1.5,
                fontSize: 14,
                outline: 'none',
                '&:focus': { borderColor: '#6161ff', boxShadow: '0 0 0 2px rgba(97,97,255,0.15)' },
              }}
            />
            <Box
              component="button"
              sx={{
                bgcolor: '#6161ff',
                color: '#ffffff',
                border: 'none',
                borderRadius: 2,
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#4a4ae6' },
              }}
            >
              <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 20 }}>
                send
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          borderTop: '1px solid',
          borderColor: 'rgba(208, 212, 228, 0.1)',
          py: 3,
          textAlign: 'center',
          color: '#535768',
          fontSize: 13,
        }}
      >
        &copy; 2024 STNK SatuJasa. All rights reserved.
      </Box>
    </Box>
  );
}
