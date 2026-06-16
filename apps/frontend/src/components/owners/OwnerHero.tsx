'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

interface OwnerHeroProps {
  ownerName?: string;
  healthStatus?: string;
}

export default function OwnerHero({ ownerName = 'Owner', healthStatus = 'operational' }: OwnerHeroProps) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  const greeting = now.getHours() < 12 ? 'Selamat Pagi' : now.getHours() < 17 ? 'Selamat Siang' : 'Selamat Malam';

  const isHealthy = healthStatus === 'operational';

  return (
    <Box
      sx={{
        mb: 3,
        p: { xs: 3, md: 4 },
        borderRadius: '28px',
        background: 'linear-gradient(135deg, #6254f3 0%, #8b7cf6 50%, #a594fc 100%)',
        color: 'white',
        boxShadow: '0 20px 50px rgba(98, 84, 243, 0.25)',
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
        {/* Top row: Avatar + Name + Health Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'rgba(255,255,255,0.25)',
                fontSize: 26,
                fontWeight: 800,
                border: '3px solid rgba(255,255,255,0.3)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              }}
            >
              {ownerName.slice(0, 2).toUpperCase()}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: { xs: 28, md: 32 }, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 , color: '#FFFFFF'}}>
                {greeting}, {ownerName}! 👋
              </Typography>
              <Typography sx={{ fontSize: 15, fontWeight: 400, opacity: 0.9, mt: 0.5, color: '#FFFFFF' }}>
                {dateStr} • {timeStr}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.25,
              px: 2.5,
              py: 1.25,
              borderRadius: '50px',
              bgcolor: isHealthy ? 'rgba(34, 199, 184, 0.25)' : 'rgba(246, 163, 38, 0.25)',
              border: '2px solid',
              borderColor: isHealthy ? 'rgba(34, 199, 184, 0.5)' : 'rgba(246, 163, 38, 0.5)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: isHealthy ? '#22c7b8' : '#f6a326',
                boxShadow: isHealthy ? '0 0 12px rgba(34,199,184,0.8)' : '0 0 12px rgba(246,163,38,0.8)',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.6 },
                },
              }}
            />
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'white' }}>
              {isHealthy ? 'Platform Operasional' : 'Perlu Perhatian'}
            </Typography>
          </Box>
        </Box>

        {/* Stats chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 3 }}>
          <Chip
            icon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>workspace_premium</span>}
            label="Workspace: Owner"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              fontWeight: 600,
              fontSize: 13,
              '& .MuiChip-icon': { color: 'white' },
            }}
          />
          <Chip
            icon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>verified</span>}
            label="Status Aktif"
            sx={{
              bgcolor: 'rgba(34, 199, 184, 0.3)',
              color: 'white',
              border: '1px solid rgba(34, 199, 184, 0.5)',
              fontWeight: 600,
              fontSize: 13,
              '& .MuiChip-icon': { color: '#22c7b8' },
            }}
          />
          <Chip
            icon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>insights</span>}
            label="Dashboard Analytics"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              fontWeight: 600,
              fontSize: 13,
              '& .MuiChip-icon': { color: 'white' },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
