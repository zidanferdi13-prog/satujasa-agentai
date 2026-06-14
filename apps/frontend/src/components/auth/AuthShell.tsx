'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import icon from '../../../assets/icon.png';

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

const benefits = [
  'Dashboard web untuk owner dan admin cabang',
  'Akses mobile Android untuk pekerjaan lapangan',
  'Data transaksi dan status dokumen tetap tersinkron',
];

export default function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f6f8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '0.92fr 0.78fr' },
          gap: { lg: 10 },
          maxWidth: 1200,
          width: 1,
          alignItems: 'center',
        }}
      >
        {/* Left side — brand */}
        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, mb: 5 }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
              <Box
                component="img"
                src={icon.src}
                alt=""
                sx={{ width: 40, height: 40, borderRadius: 3 }}
              />
              <Box sx={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: '#6161ff' }}>
                STNK SatuJasa
              </Box>
            </Link>
            <Box
              sx={{
                display: 'inline-flex',
                borderRadius: '9999px',
                border: '1px solid #d0d4e4',
                bgcolor: '#ffffff',
                px: 3,
                py: 1,
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: '#6161ff',
              }}
            >
              {eyebrow}
            </Box>
          </Box>

          <Box
            sx={{
              fontSize: { xs: 42, xl: 50 },
              fontWeight: 800,
              lineHeight: 0.98,
              letterSpacing: '-0.055em',
              color: '#333333',
              maxWidth: 560,
            }}
          >
            {title}
          </Box>
          <Box
            sx={{
              mt: 3.5,
              fontSize: 18,
              lineHeight: 2,
              color: '#535768',
              maxWidth: 560,
            }}
          >
            {description}
          </Box>

          <Box
            sx={{
              mt: 5,
              borderRadius: 6,
              bgcolor: '#333333',
              color: '#ffffff',
              p: 3,
              boxShadow: 'rgba(205, 208, 223, 0.4) 0px 2px 48px 0px',
            }}
          >
            <Box sx={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', color: '#9ec7ff', mb: 1.5 }}>
              Satu platform
            </Box>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {benefits.map((benefit) => (
                <Box
                  key={benefit}
                  component="li"
                  sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, fontSize: 14, fontWeight: 700, lineHeight: 1.75, '& + &': { mt: 2 } }}
                >
                  <Box
                    component="span"
                    className="material-symbols-outlined"
                    sx={{ mt: 0.25, fontSize: 20, color: '#9ec7ff' }}
                  >
                    check_circle
                  </Box>
                  {benefit}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Right side — form */}
        <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 6, lg: 0 } }}>
          <Box sx={{ width: 1, maxWidth: 460 }}>
            <Link href="/" className="flex lg:hidden items-center gap-3 mb-4" style={{ textDecoration: 'none' }}>
              <Box component="img" src={icon.src} alt="" sx={{ width: 36, height: 36, borderRadius: 2 }} />
              <Box sx={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: '#6161ff' }}>STNK SatuJasa</Box>
            </Link>
            <Card sx={{ borderRadius: '8px !important', border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                {children}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
