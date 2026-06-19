'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import icon from '../../../assets/icon.png';

type NavbarProps = {
  fixed?: boolean;
};

const navLinks = [
  { label: 'Fitur', href: '/#features' },
  { label: 'Solusi', href: '/#solutions' },
  { label: 'Alur', href: '/#workflow' },
  { label: 'Harga', href: '/#pricing' },
  { label: 'FAQ', href: '/#faq' },
];

export default function Navbar({ fixed = true }: NavbarProps) {
  return (
    <Box
      component="nav"
      aria-label="Navigasi utama"
      sx={{
        position: fixed ? 'fixed' : 'static',
        left: 0,
        right: 0,
        top: 16,
        zIndex: 50,
        px: { xs: 2, md: 5 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 6,
          border: '1px solid rgba(208, 212, 228, 0.72)',
          bgcolor: 'rgba(255, 255, 255, 0.86)',
          backdropFilter: 'blur(18px)',
          px: { xs: 1.5, md: 2 },
          py: 1,
          boxShadow: '0 18px 55px rgba(43, 50, 91, 0.1)',
        }}
      >
        <Box
          component={Link}
          href="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            textDecoration: 'none',
            borderRadius: 2,
            '&:focus-visible': {
              outline: '3px solid rgba(97, 97, 255, 0.35)',
              outlineOffset: 3,
            },
          }}
        >
          <Box component="img" src={icon.src} alt="" aria-hidden="true" sx={{ width: 34, height: 34, borderRadius: 2.5 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.04em', color: '#1d2433' }}>
              SatuJasa
            </Box>
            <Box
              sx={{
                display: { xs: 'none', lg: 'inline-flex' },
                borderRadius: 6,
                bgcolor: '#fff3bf',
                color: '#8a5a00',
                px: 1.2,
                py: 0.35,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              STNK Ops
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 0.5,
            borderRadius: 6,
            px: 1,
            py: 0.5,
          }}
        >
          {navLinks.map((link) => (
            <Box
              key={link.href}
              component={Link}
              href={link.href}
              sx={{
                position: 'relative',
                borderRadius: 6,
                px: 1.6,
                py: 0.9,
                fontSize: 13,
                fontWeight: 700,
                color: '#535768',
                textDecoration: 'none',
                transition: 'color 0.2s, background-color 0.2s',
                '&:hover': {
                  color: '#6161ff',
                  bgcolor: '#f5f6f8',
                },
                '&:focus-visible': {
                  color: '#6161ff',
                  bgcolor: '#f5f6f8',
                  outline: '3px solid rgba(97, 97, 255, 0.35)',
                  outlineOffset: 3,
                },
              }}
            >
              {link.label}
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
          <Box
            component={Link}
            href="/auth/signin"
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              fontSize: 14,
              fontWeight: 700,
              color: '#535768',
              textDecoration: 'none',
              borderRadius: 6,
              px: 1.5,
              py: 1,
              '&:hover': { color: '#6161ff' },
              '&:focus-visible': {
                color: '#6161ff',
                outline: '3px solid rgba(97, 97, 255, 0.35)',
                outlineOffset: 3,
              },
            }}
          >
            Masuk
          </Box>
          <Button
            component={Link}
            href="/auth/signup"
            variant="contained"
            color="primary"
            size="small"
            sx={{ borderRadius: 8, px: { xs: 2, sm: 3 }, fontWeight: 800 }}
          >
            Daftar
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          gap: 1,
          overflowX: 'auto',
          maxWidth: 1200,
          mx: 'auto',
          mt: 1.25,
          px: 0.5,
          pb: 0.5,
          scrollbarWidth: 'thin',
        }}
      >
        {navLinks.map((link) => (
          <Box
            key={`mobile-${link.href}`}
            component={Link}
            href={link.href}
            sx={{
              flex: '0 0 auto',
              borderRadius: 999,
              border: '1px solid rgba(208, 212, 228, 0.72)',
              bgcolor: 'rgba(255, 255, 255, 0.92)',
              px: 2,
              py: 1,
              fontSize: 13,
              fontWeight: 700,
              color: '#535768',
              textDecoration: 'none',
              '&:hover': {
                color: '#6161ff',
                bgcolor: '#f5f6f8',
              },
              '&:focus-visible': {
                color: '#6161ff',
                bgcolor: '#f5f6f8',
                outline: '3px solid rgba(97, 97, 255, 0.35)',
                outlineOffset: 3,
              },
            }}
          >
            {link.label}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
