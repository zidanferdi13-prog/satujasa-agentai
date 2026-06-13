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
  { label: 'Harga', href: '/#pricing' },
  { label: 'Download', href: '/download' },
  { label: 'FAQ', href: '/#faq' },
];

export default function Navbar({ fixed = true }: NavbarProps) {
  return (
    <Box
      component="nav"
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
          borderRadius: '9999px',
          border: '1px solid',
          borderColor: 'rgba(208, 212, 228, 0.7)',
          bgcolor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          px: { xs: 2, md: 3 },
          py: 1.25,
          boxShadow: 'rgba(205, 208, 223, 0.3) 0px 1px 24px 0px',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <Box component="img" src={icon.src} alt="" sx={{ width: 32, height: 32, borderRadius: 2 }} />
          <Box sx={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: '#6161ff' }}>
            STNK SatuJasa
          </Box>
        </Link>

        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 3.5,
            bgcolor: '#f5f6f8',
            borderRadius: '9999px',
            px: 3,
            py: 1,
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#535768',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#6161ff'; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.color = '#535768'; }}
            >
              {link.label}
            </Link>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Link href="/auth/signin" style={{ fontSize: 14, fontWeight: 500, color: '#535768', textDecoration: 'none', display: 'none' }} className="sm:inline">
            Masuk
          </Link>
          <Link href="/auth/signup">
            <Button variant="contained" color="primary" size="small" sx={{ borderRadius: '9999px', px: 3 }}>
              Daftar
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
