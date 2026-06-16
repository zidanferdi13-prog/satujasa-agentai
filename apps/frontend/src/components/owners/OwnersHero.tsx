'use client'
import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';

interface OwnersHeroProps {
  count: number;
  active: number;
  tenants: number;
  admins: number;
}

const OwnersHero: React.FC<OwnersHeroProps> = ({ count, active, tenants, admins }) => {
  const pillData = [
    { label: 'Total Owners', value: count, color: 'var(--dash-primary)' },
    { label: 'Active Subscription', value: active, color: 'var(--dash-green)' },
    { label: 'Tenant Terkait', value: tenants, color: 'var(--dash-violet)' },
    { label: 'Admin User', value: admins, color: 'var(--dash-orange)' },
  ];

  return (
    <Box
      sx={{
        p: 4,
        borderRadius: '28px',
        background: 'linear-gradient(110deg, rgba(255,255,255,0.95) 0%, rgba(246,248,255,0.96) 54%, rgba(238,242,255,0.92) 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 3,
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Kelola Owner
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
          Pantau dan atur semua owner yang terdaftar di sistem Anda.
        </Typography>
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', mb: 4 }}>
          {pillData.map((pill, index) => (
            <Box
              key={index}
              sx={{
                border: '1px solid var(--dash-line)',
                backgroundColor: 'white',
                borderRadius: '12px',
                px: 2,
                py: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: pill.color,
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {pill.label}: {pill.value}
              </Typography>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button variant="contained">Tambah Owner</Button>
          <Button variant="outlined">Export</Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default OwnersHero;
