'use client';

import { useMemo } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type KpiCardProps = {
  icon: string;
  label: string;
  value: string | number;
  delta?: string | undefined;
  deltaDirection?: 'up' | 'down' | 'neutral';
  color: string;
  sparklineData?: number[];
};

/**
 * Renders a tiny inline SVG sparkline curve from an array of numbers.
 */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const path = useMemo(() => {
    if (!data || data.length < 2) return '';
    const w = 64;
    const h = 28;
    const padding = 2;
    const chartW = w - padding * 2;
    const chartH = h - padding * 2;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((val, i) => {
      const x = padding + (i / (data.length - 1)) * chartW;
      const y = padding + chartH - ((val - min) / range) * chartH;
      return { x, y };
    });

    return points
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ');
  }, [data]);

  if (!data || data.length < 2) return null;

  return (
    <svg
      width={64}
      height={28}
      viewBox="0 0 64 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <path
        d={path}
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default function KpiCard({
  icon,
  label,
  value,
  delta,
  deltaDirection = 'neutral',
  color,
  sparklineData,
}: KpiCardProps) {
  const arrow = deltaDirection === 'up' ? '↑' : deltaDirection === 'down' ? '↓' : '—';
  const arrowColor =
    deltaDirection === 'up'
      ? '#22c55e'
      : deltaDirection === 'down'
        ? '#ef4444'
        : '#6b7280';

  return (
    <Card
      sx={{
        borderRadius: '22px',
        boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
        border: '1px solid #e5e9f3',
        background: 'rgba(255,255,255,0.94)',
        transition: 'box-shadow 0.2s, transform 0.2s',
        '&:hover': {
          boxShadow: '0 24px 48px rgba(30, 41, 59, 0.1)',
          transform: 'translateY(-3px)',
        },
      }}
    >
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* Top row: icon + value */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          {/* Icon rounded square */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${color}15`,
              flexShrink: 0,
            }}
          >
            <Box
              component="span"
              sx={{
                fontSize: 22,
                lineHeight: 1,
                color,
              }}
            >
              {icon}
            </Box>
          </Box>

          {/* Value */}
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: 28, sm: 32 },
              fontWeight: 800,
              color: 'var(--dash-text)',
              lineHeight: 1,
              ml: 2,
              textAlign: 'right',
            }}
          >
            {value}
          </Typography>
        </Box>

        {/* Label uppercase */}
        <Typography
          variant="body2"
          sx={{
            fontSize: 12,
            fontWeight: 600,
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {label}
        </Typography>

        {/* Bottom row: delta + sparkline */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <Box
              component="span"
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: arrowColor,
                lineHeight: 1,
              }}
            >
              {arrow}
            </Box>
            {delta && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: arrowColor,
                }}
              >
                {delta}
              </Typography>
            )}
          </Box>

          {sparklineData && sparklineData.length >= 2 && (
            <Sparkline data={sparklineData} color={color} />
          )}
        </Box>
      </Box>
    </Card>
  );
}
