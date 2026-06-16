'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3,
        p: 3,
        borderRadius: '22px',
        background: 'linear-gradient(135deg, #6254f3 0%, #8b7cf6 50%, #a594fc 100%)',
        color: 'white',
        boxShadow: '0 8px 32px rgba(98, 84, 243, 0.3)',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            bgcolor: 'rgba(255,255,255,0.2)',
            fontSize: 24,
            fontWeight: 800,
            border: '2px solid rgba(255,255,255,0.3)',
          }}
        >
          {ownerName.slice(0, 2).toUpperCase()}
        </Avatar>
        <Box>
          <Typography sx={{ fontSize: 26, fontWeight: 850, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {greeting}, {ownerName}! 👋
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 400, opacity: 0.85, mt: 0.5 }}>
            {dateStr} • {timeStr}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: '50px',
          bgcolor: isHealthy ? 'rgba(34, 199, 184, 0.2)' : 'rgba(246, 163, 38, 0.2)',
          border: '1px solid',
          borderColor: isHealthy ? 'rgba(34, 199, 184, 0.4)' : 'rgba(246, 163, 38, 0.4)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: isHealthy ? '#22c7b8' : '#f6a326',
            boxShadow: isHealthy ? '0 0 8px rgba(34,199,184,0.6)' : '0 0 8px rgba(246,163,38,0.6)',
          }}
        />
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'white' }}>
          {isHealthy ? 'Performa Platform Normal' : 'Perlu Perhatian'}
        </Typography>
      </Box>
    </Box>
  );
}
