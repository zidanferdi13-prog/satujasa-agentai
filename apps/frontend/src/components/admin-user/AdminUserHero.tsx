'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface AdminUserHeroProps {
  userName?: string;
}

export default function AdminUserHero({ userName: _userNameProp }: AdminUserHeroProps) {
  const { data: user } = useCurrentUser();
  const userName = user?.name ?? _userNameProp ?? 'Admin';
  return (
    <Box
      sx={{
        mb: 3,
        p: { xs: 3, md: 4 },
        borderRadius: '22px',
        background: 'linear-gradient(135deg, #4238e8 0%, #6d46f7 50%, #9a7bf4 100%)',
        color: 'white',
        boxShadow: '0 20px 50px rgba(66, 56, 232, 0.25)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '40%',
          height: '100%',
          background: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Top row: Icon + Greeting + Status Pill */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            mb: 2,
          }}
        >
          {/* Left: shield icon + greeting */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255,255,255,0.15)',
                fontSize: 28,
                flexShrink: 0,
              }}
            >
              <span className="material-symbols-outlined">shield</span>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: 22, md: 28 },
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  color: '#FFFFFF',
                }}
              >
                Admin User Dashboard 👋
              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 400,
                  opacity: 0.85,
                  mt: 0.5,
                  color: '#FFFFFF',
                }}
              >
                Selamat datang, {userName}. Pantau transaksi dan aktivitas tenant Anda secara real-time
              </Typography>
            </Box>
          </Box>

          {/* Right: status pill */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2.5,
              py: 1,
              borderRadius: '50px',
              bgcolor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: '#22c55e',
                boxShadow: '0 0 12px rgba(34,197,94,0.7)',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                },
              }}
            />
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'white' }}>
              Operasional Stabil
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
