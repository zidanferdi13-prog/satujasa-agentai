'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import type { AdminUserDashboardResponse } from '@/types/dashboard';

/* ── Design tokens ── */
const PURPLE = '#6044f4';
const BLUE = '#3b82f6';
const AMBER = '#f59e0b';
const DONUT_SIZE = 132;
const HOLE_SIZE = 80;

/* ── Props ── */
interface AdminUserTeamPerformanceProps {
  performance?: AdminUserDashboardResponse['team_performance'];
}

/* ── Build conic-gradient stops ── */
function buildConicGradient(
  donePct: number,
  processingPct: number,
  pendingPct: number,
): string {
  const total = donePct + processingPct + pendingPct;
  if (total === 0) {
    return 'conic-gradient(#e5e9f3 0% 100%)';
  }

  const stop1 = donePct;
  const stop2 = donePct + processingPct;

  return `conic-gradient(${PURPLE} 0% ${stop1}%, ${BLUE} ${stop1}% ${stop2}%, ${AMBER} ${stop2}% 100%)`;
}

/* ── Legend item ── */
interface LegendItemProps {
  color: string;
  label: string;
  count: number;
}

function LegendItem({ color, label, count }: LegendItemProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 0.5,
        py: 0.75,
      }}
    >
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          bgcolor: color,
          flexShrink: 0,
        }}
      />
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 600,
          color: '#1e293b',
          flex: 1,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 700,
          color: '#1e293b',
          minWidth: 28,
          textAlign: 'right',
        }}
      >
        {count}
      </Typography>
    </Box>
  );
}

/* ── Component ── */
export default function AdminUserTeamPerformance({
  performance,
}: AdminUserTeamPerformanceProps) {
  const perf = useMemo(
    () => performance ?? { done_count: 0, done_pct: 0, processing_count: 0, processing_pct: 0, pending_count: 0, pending_pct: 0 },
    [performance],
  );

  const total = useMemo(
    () => perf.done_count + perf.processing_count + perf.pending_count,
    [perf],
  );

  const gradient = useMemo(
    () => buildConicGradient(perf.done_pct, perf.processing_pct, perf.pending_pct),
    [perf],
  );

  return (
    <Card
      sx={{
        borderRadius: '22px',
        border: '1px solid #e5e9f3',
        boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
        bgcolor: '#fff',
        height: '100%',
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 700,
            color: '#1e293b',
            mb: 3,
          }}
        >
          Performa Tim
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          {/* ── Donut chart ── */}
          <Box
            sx={{
              position: 'relative',
              width: DONUT_SIZE,
              height: DONUT_SIZE,
              borderRadius: '50%',
              background: gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
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
            {/* Center text */}
            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                textAlign: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#1e293b',
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
                  mt: 0.3,
                }}
              >
                Total
              </Typography>
            </Box>
          </Box>

          {/* ── Legend ── */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          >
            <LegendItem
              color={PURPLE}
              label="Selesai"
              count={perf.done_count}
            />
            <LegendItem
              color={BLUE}
              label="Diproses"
              count={perf.processing_count}
            />
            <LegendItem
              color={AMBER}
              label="Pending"
              count={perf.pending_count}
            />
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
