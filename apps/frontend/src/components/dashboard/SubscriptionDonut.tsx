'use client';

import { useMemo } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import type { SubscriptionDistribution } from '@/types/dashboard';

type SubscriptionDonutProps = {
  data?: SubscriptionDistribution;
};

const DONUT_SIZE = 160;
const HOLE_SIZE = 92;

const SEGMENTS = [
  { key: 'free' as const, label: 'Free', color: 'var(--dash-primary)' },
  { key: 'pro' as const, label: 'Pro', color: 'var(--dash-violet)' },
  { key: 'plus' as const, label: 'Plus', color: 'var(--dash-green)' },
  { key: 'expert' as const, label: 'Expert', color: 'var(--dash-orange)' },
];

function buildConicGradient(values: { key: string; value: number }[]): string {
  const total = values.reduce((s, v) => s + v.value, 0);
  if (total === 0) return 'conic-gradient(#e5e9f3 0deg, #e5e9f3 360deg)';

  let currentDeg = 0;
  const stops: string[] = [];
  for (const seg of values) {
    const pct = seg.value / total;
    const startDeg = currentDeg;
    const endDeg = currentDeg + pct * 360;
    const color = SEGMENTS.find((s) => s.key === seg.key)?.color ?? '#e5e9f3';
    stops.push(`${color} ${startDeg}deg ${endDeg}deg`);
    currentDeg = endDeg;
  }
  return `conic-gradient(${stops.join(', ')})`;
}

export default function SubscriptionDonut({ data }: SubscriptionDonutProps) {
  const dist = data ?? { free: 15, pro: 10, plus: 10, expert: 5 };

  const total = useMemo(
    () => dist.free + dist.pro + dist.plus + dist.expert,
    [dist],
  );

  const conicGradient = useMemo(
    () =>
      buildConicGradient([
        { key: 'free', value: dist.free },
        { key: 'pro', value: dist.pro },
        { key: 'plus', value: dist.plus },
        { key: 'expert', value: dist.expert },
      ]),
    [dist],
  );

  return (
    <Card
      sx={{
        borderRadius: '22px',
        border: '1px solid var(--dash-line)',
        boxShadow: 'var(--dash-shadow-soft)',
        background: '#ffffff',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16, color: 'var(--dash-text)', mb: 2 }}>
          Distribusi Subscription
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: 3, alignItems: 'center' }}>
          {/* Donut chart */}
          <Box
            sx={{
              position: 'relative',
              width: DONUT_SIZE,
              height: DONUT_SIZE,
              borderRadius: '50%',
              background: conicGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&::before': {
                content: '""',
                position: 'absolute',
                width: HOLE_SIZE,
                height: HOLE_SIZE,
                borderRadius: '50%',
                background: '#ffffff',
              },
            }}
          >
            <Typography
              sx={{
                position: 'relative',
                zIndex: 1,
                fontSize: 22,
                fontWeight: 800,
                color: 'var(--dash-text)',
              }}
            >
              {total}
            </Typography>
          </Box>

          {/* Legend */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {SEGMENTS.map((seg) => {
              const count = dist[seg.key];
              const pct = total > 0 ? ((count / total) * 100).toFixed(0) : '0';
              return (
                <Box
                  key={seg.key}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: seg.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'var(--dash-text)', minWidth: 50 }}>
                    {seg.label}
                  </Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text)', minWidth: 30, textAlign: 'right' }}>
                    {count}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: '#8a91a3' }}>
                    {pct}%
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Bottom link */}
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button
            component={Link}
            href="/admin/subscriptions"
            variant="text"
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--dash-primary)',
              textTransform: 'none',
              '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
            }}
          >
            Lihat detail &rarr;
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
