'use client';

import { useMemo } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import type { DashboardResponse } from '@/types/dashboard';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type DashboardHeroProps = {
  data: DashboardResponse | null;
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  return 'Selamat malam';
}

export default function DashboardHero({ data }: DashboardHeroProps) {
  const { data: user } = useCurrentUser();
  const greeting = useMemo(() => getGreeting(), []);
  const userName = user?.name ?? 'Pengguna';

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.15fr 0.85fr' },
        gap: { xs: 3, md: 4 },
        mb: 3,
      }}
    >
      {/* ── Left: Greeting + Chips ── */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Greeting */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: 26, md: 32 },
            fontWeight: 800,
            color: 'var(--dash-text)',
            lineHeight: 1.2,
          }}
        >
          {greeting}, {userName}
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body1"
          sx={{
            fontSize: 15,
            color: 'var(--dash-muted)',
            fontWeight: 400,
            mt: -0.5,
          }}
        >
          Kelola dan pantau seluruh ekosistem SatuJasa
        </Typography>

        {/* Chips Row */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 1 }}>
          {/* Workspace chip */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.8,
              background: 'rgba(255,255,255,0.78)',
              border: '1px solid #edf0fb',
              borderRadius: '14px',
              px: '13px',
              py: '10px',
              fontSize: 13,
              fontWeight: 700,
              color: '#394154',
            }}
          >
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                fontSize: 15,
                lineHeight: 1,
              }}
            >
              🏢
            </Box>
            <span>Workspace: STNK</span>
          </Box>

          {/* Role chip */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.8,
              background: 'rgba(255,255,255,0.78)',
              border: '1px solid #edf0fb',
              borderRadius: '14px',
              px: '13px',
              py: '10px',
              fontSize: 13,
              fontWeight: 700,
              color: '#394154',
            }}
          >
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                fontSize: 15,
                lineHeight: 1,
              }}
            >
              👤
            </Box>
            <span>{user?.role ?? '—'}</span>
          </Box>

          {/* Status chip */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.8,
              background: 'rgba(255,255,255,0.78)',
              border: '1px solid #edf0fb',
              borderRadius: '14px',
              px: '13px',
              py: '10px',
              fontSize: 13,
              fontWeight: 700,
              color: '#394154',
            }}
          >
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: '#22c55e',
                flexShrink: 0,
              }}
            />
            <span>Active</span>
          </Box>
        </Box>
      </Box>

      {/* ── Right: Hero Art ── */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 340,
            aspectRatio: '4 / 3',
            background: 'radial-gradient(circle at 30% 30%, rgba(79,70,229,0.12) 0%, transparent 60%), linear-gradient(145deg, #f8faff 0%, #eef2ff 100%)',
            borderRadius: '26px',
            border: '1px solid rgba(79,70,229,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Device mockup */}
          <Box
            sx={{
              width: '75%',
              height: '75%',
              borderRadius: '18px',
              background: '#ffffff',
              border: '1px solid #e5e9f3',
              transform: 'rotate(-3deg)',
              boxShadow: '0 12px 40px rgba(30,41,59,0.08)',
              display: 'flex',
              flexDirection: 'column',
              p: 2,
              gap: 1.5,
            }}
          >
            {/* Bars */}
            <Box
              sx={{
                height: 8,
                width: '55%',
                borderRadius: 4,
                background: 'linear-gradient(90deg, #4f46e5 0%, #6366f1 100%)',
              }}
            />
            <Box
              sx={{
                height: 8,
                width: '80%',
                borderRadius: 4,
                background: 'linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)',
              }}
            />
            <Box
              sx={{
                height: 8,
                width: '65%',
                borderRadius: 4,
                background: 'linear-gradient(90deg, #22c55e 0%, #4ade80 100%)',
              }}
            />
            <Box
              sx={{
                height: 8,
                width: '90%',
                borderRadius: 4,
                background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)',
              }}
            />
            <Box
              sx={{
                height: 8,
                width: '45%',
                borderRadius: 4,
                background: 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)',
              }}
            />
            <Box
              sx={{
                height: 8,
                width: '72%',
                borderRadius: 4,
                background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
