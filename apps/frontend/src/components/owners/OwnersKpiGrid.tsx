'use client'
import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { OwnersKpi } from '@/types/owner';

interface OwnersKpiGridProps {
  data: OwnersKpi;
}

const OwnersKpiGrid: React.FC<OwnersKpiGridProps> = ({ data }) => {
  const kpis = [
    { label: 'Total Owners', value: data.totalOwners, icon: '👥', color: 'var(--dash-primary)' },
    { label: 'Active Owners', value: data.activeOwners, icon: '✅', color: 'var(--dash-green)' },
    { label: 'Free Tier', value: data.freeTier, icon: '🎁', color: 'var(--dash-orange)' },
    { label: 'Paid Tier', value: data.paidTier, icon: '👑', color: 'var(--dash-violet)' },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', mt: 4 }}>
      {kpis.map((kpi, index) => (
        <Card
          key={index}
          sx={{
            borderRadius: '22px',
            boxShadow: 'var(--dash-shadow-soft)',
            border: '1px solid var(--dash-line)',
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3, position: 'relative' }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: `${kpi.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                fontSize: '24px',
              }}
            >
              {kpi.icon}
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {kpi.label}
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {kpi.value}
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 60,
                height: 24,
              }}
            >
              <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                <path
                  d="M0,35 Q20,10 40,25 T80,5 T100,20"
                  fill="none"
                  stroke={kpi.color}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default OwnersKpiGrid;
