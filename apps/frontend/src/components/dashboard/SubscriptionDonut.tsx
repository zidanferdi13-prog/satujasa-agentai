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
  const dist = useMemo(() => data ?? { free: 15, pro: 10, plus: 10, expert: 5 }, [data]);

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
        border: '1px solid #e5e9f3',
        boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
        background: 'rgba(255,255,255,0.94)',
        height: '100%',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18, color: 'var(--dash-text)', mb: 2.5 }}>
          Distribusi Subscription
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          {/* Donut chart with center text */}
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
              boxShadow: '0 8px 20px rgba(79, 70, 229, 0.12)',
              '&::before': {
                content: '""',
                position: 'absolute',
                width: HOLE_SIZE,
                height: HOLE_SIZE,
                borderRadius: '50%',
                background: '#ffffff',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.04)',
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <Typography
                sx={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: 'var(--dash-text)',
                  lineHeight: 1,
                }}
              >
                {total}
              </Typography>
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: '#8a91a3',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  mt: 0.5,
                }}
              >
                Total Owners
              </Typography>
            </Box>
          </Box>

          {/* Legend */}
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {SEGMENTS.map((seg) => {
              const count = dist[seg.key];
              const pct = total > 0 ? ((count / total) * 100).toFixed(0) : '0';
              return (
                <Box
                  key={seg.key}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: '12px',
                    transition: 'background-color 0.15s',
                    '&:hover': { bgcolor: '#f8f9fc' },
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: seg.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'var(--dash-text)', flex: 1 }}>
                    {seg.label}
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'var(--dash-text)', minWidth: 30, textAlign: 'right' }}>
                    {count}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: '#8a91a3', minWidth: 40, textAlign: 'right' }}>
                    {pct}%
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Bottom link */}
        <Box sx={{ mt: 2.5, textAlign: 'center' }}>
          <Button
            component={Link}
            href="/admin/subscriptions"
            variant="text"
            sx={{
              fontSize: 14,
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
