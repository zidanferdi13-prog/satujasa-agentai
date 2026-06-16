'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import type { AdminUserDashboardResponse } from '@/types/dashboard';

/* ── Inline Sparkline SVG ── */
function Sparkline({ data = [5, 8, 6, 10, 7, 11, 9], color }: { data?: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const viewW = 94;
  const viewH = 44;
  const padX = 4;
  const padY = 6;
  const usableW = viewW - padX * 2;
  const usableH = viewH - padY * 2;

  const points = data
    .map((v, i) => {
      const x = padX + (i / (data.length - 1)) * usableW;
      const y = padY + usableH - ((v - min) / range) * usableH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg width="94" height="44" viewBox={`0 0 ${viewW} ${viewH}`} fill="none" style={{ display: 'block' }}>
      <polyline
        points={points}
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/* ── Single KPI Card ── */
interface KpiCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend: number;
  color: string;
  sparkData?: number[];
}

function KpiCard({ icon, label, value, trend, color, sparkData }: KpiCardProps) {
  const isPositive = trend >= 0;
  const trendColor = isPositive ? '#22c55e' : '#ef4444';

  return (
    <Card
      sx={{
        p: '22px',
        borderRadius: '22px',
        border: '1px solid #e5e9f3',
        boxShadow: '0 10px 24px rgba(30, 41, 59, 0.06)',
        bgcolor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        minHeight: 128,
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 14px 32px rgba(30, 41, 59, 0.09)',
        },
      }}
    >
      {/* Top row: icon + sparkline */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${color}18`,
            color,
            fontSize: 24,
          }}
        >
          <span className="material-symbols-outlined">{icon}</span>
        </Box>
        <Sparkline data={sparkData} color={color} />
      </Box>

      {/* Value + label + trend */}
      <Box>
        <Typography
          sx={{
            fontSize: 28,
            fontWeight: 800,
            lineHeight: 1.1,
            color: '#1e293b',
          }}
        >
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#8b8fa3' }}>
            {label}
          </Typography>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: trendColor,
              display: 'flex',
              alignItems: 'center',
              gap: 0.3,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              {isPositive ? 'trending_up' : 'trending_down'}
            </span>
            {isPositive ? '+' : ''}{trend}%
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

/* ── Grid ── */
interface AdminUserKpiGridProps {
  kpis?: AdminUserDashboardResponse['kpi'];
}

export default function AdminUserKpiGrid({ kpis }: AdminUserKpiGridProps) {
  const kpi = kpis ?? {
    transactions_today: { value: 0, trend: 0 },
    pending: { value: 0, trend: 0 },
    done: { value: 0, trend: 0 },
    sla: { value: 0, trend: 0 },
  };

  const cards: KpiCardProps[] = [
    {
      icon: 'receipt_long',
      label: 'Transaksi Hari Ini',
      value: kpi.transactions_today.value,
      trend: kpi.transactions_today.trend,
      color: '#6046f4',
      sparkData: [5, 8, 6, 10, 7, 11, 12],
    },
    {
      icon: 'hourglass_empty',
      label: 'Pending',
      value: kpi.pending.value,
      trend: kpi.pending.trend,
      color: '#f59e0b',
      sparkData: [4, 5, 3, 6, 4, 5, 3],
    },
    {
      icon: 'check_circle',
      label: 'Selesai',
      value: kpi.done.value,
      trend: kpi.done.trend,
      color: '#22c55e',
      sparkData: [2, 4, 5, 7, 6, 9, 11],
    },
    {
      icon: 'schedule',
      label: 'SLA Tepat Waktu',
      value: `${kpi.sla.value}%`,
      trend: kpi.sla.trend,
      color: '#3b82f6',
      sparkData: [85, 88, 90, 87, 92, 95, 93],
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 2,
        mb: 3,
      }}
    >
      {cards.map((card) => (
        <KpiCard key={card.label} {...card} />
      ))}
    </Box>
  );
}
