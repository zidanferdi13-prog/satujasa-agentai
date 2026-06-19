'use client';

import { useMemo } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  return 'Selamat malam';
}

export default function DashboardHero() {
  const { data: user } = useCurrentUser();
  const greeting = useMemo(() => getGreeting(), []);
  const userName = user?.name ?? 'Super Admin';

  return (
    <Box
      sx={{
        mb: '28px',
        p: { xs: '28px 24px', md: '36px 40px' },
        borderRadius: '28px',
        background: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 50%, #f0f9ff 100%)',
        border: '1px solid rgba(79, 70, 229, 0.08)',
        boxShadow: '0 20px 45px rgba(30, 41, 59, 0.07)',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.3fr 0.7fr' },
        gap: { xs: 3, md: 4 },
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Left Content */}
      <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontSize: { xs: 28, md: 36 },
            fontWeight: 800,
            color: 'var(--dash-text)',
            lineHeight: 1.2,
            mb: 1,
          }}
        >
          {greeting}, {userName}! 👋
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: 15,
            color: 'var(--dash-muted)',
            fontWeight: 400,
            lineHeight: 1.6,
            mb: 1,
          }}
        >
          Berikut ringkasan performa terbaru platform STNK SatuJasa.
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 1 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.8,
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(79, 70, 229, 0.12)',
              borderRadius: '14px',
              px: '14px',
              py: '10px',
              fontSize: 13,
              fontWeight: 600,
              color: '#4f46e5',
            }}
          >
            <span style={{ fontSize: 15 }}>🏢</span>
            <span>Workspace: Admin</span>
          </Box>

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.8,
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(139, 92, 246, 0.12)',
              borderRadius: '14px',
              px: '14px',
              py: '10px',
              fontSize: 13,
              fontWeight: 600,
              color: '#8b5cf6',
            }}
          >
            <span style={{ fontSize: 15 }}>👤</span>
            <span>Role: {user?.role ?? 'Super Admin'}</span>
          </Box>

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.8,
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(34, 197, 94, 0.12)',
              borderRadius: '14px',
              px: '14px',
              py: '10px',
              fontSize: 13,
              fontWeight: 600,
              color: '#22c55e',
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: '#22c55e',
                flexShrink: 0,
              }}
            />
            <span>Akses Penuh</span>
          </Box>
        </Box>
      </Box>

      {/* Right Illustration */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 320,
            aspectRatio: '1.2 / 1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Floating cards */}
          <Box
            sx={{
              position: 'absolute',
              top: '10%',
              left: '5%',
              width: '45%',
              p: 2,
              borderRadius: '18px',
              background: 'rgba(255,255,255,0.95)',
              border: '1px solid rgba(79, 70, 229, 0.1)',
              boxShadow: '0 12px 32px rgba(30,41,59,0.1)',
              transform: 'rotate(-6deg)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <span style={{ fontSize: 20 }}>📊</span>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Analytics
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#4f46e5' }}>
              +24%
            </Typography>
          </Box>

          <Box
            sx={{
              position: 'absolute',
              top: '25%',
              right: '0%',
              width: '50%',
              p: 2,
              borderRadius: '18px',
              background: 'rgba(255,255,255,0.95)',
              border: '1px solid rgba(34, 197, 94, 0.1)',
              boxShadow: '0 12px 32px rgba(30,41,59,0.1)',
              transform: 'rotate(4deg)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <span style={{ fontSize: 20 }}>💰</span>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Revenue
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#22c55e' }}>
              Rp 48M
            </Typography>
          </Box>

          <Box
            sx={{
              position: 'absolute',
              bottom: '10%',
              left: '15%',
              width: '55%',
              p: 2,
              borderRadius: '18px',
              background: 'rgba(255,255,255,0.95)',
              border: '1px solid rgba(139, 92, 246, 0.1)',
              boxShadow: '0 12px 32px rgba(30,41,59,0.1)',
              transform: 'rotate(-2deg)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <span style={{ fontSize: 20 }}>👥</span>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Users
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#8b5cf6' }}>
              1,850
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
