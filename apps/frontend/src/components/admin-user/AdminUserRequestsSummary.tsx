'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import type { AdminUserDashboardResponse } from '@/types/dashboard';

/* ── Design tokens ── */
const PURPLE = '#6044f4';
const AMBER = '#f59e0b';
const GREEN = '#22c55e';
const RED = '#ef4444';

/* ── Mock defaults ── */
const MOCK: AdminUserDashboardResponse['requests_summary'] = {
  total: 12,
  pending: 5,
  approved: 6,
  rejected: 1,
};

/* ── Props ── */
interface AdminUserRequestsSummaryProps {
  requests?: AdminUserDashboardResponse['requests_summary'];
}

/* ── Mini-card data shape ── */
interface MiniCardDef {
  icon: string;
  label: string;
  color: string;
  value: number;
}

/* ── Single mini-card ── */
function MiniCard({ icon, label, color, value }: MiniCardDef) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: '12px',
        border: '1px solid #e5e9f3',
        bgcolor: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        transition: 'all 0.15s ease',
        cursor: 'default',
        '&:hover': {
          borderColor: color,
          boxShadow: `0 4px 12px ${color}1a`,
          transform: 'translateY(-1px)',
        },
      }}
    >
      {/* Icon container */}
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: `${color}18`,
          color,
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        <span className="material-symbols-outlined">{icon}</span>
      </Box>

      {/* Label + Value */}
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: '#8a91a3',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            lineHeight: 1.3,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 800,
            color: '#1e293b',
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

/* ── Component ── */
export default function AdminUserRequestsSummary({
  requests,
}: AdminUserRequestsSummaryProps) {
  const data = requests ?? MOCK;

  const cards: MiniCardDef[] = [
    { icon: 'description', label: 'Total', color: PURPLE, value: data.total },
    { icon: 'hourglass_empty', label: 'Menunggu', color: AMBER, value: data.pending },
    { icon: 'check_circle', label: 'Disetujui', color: GREEN, value: data.approved },
    { icon: 'cancel', label: 'Ditolak', color: RED, value: data.rejected },
  ];

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
            mb: 2.5,
          }}
        >
          Permintaan Terbaru
        </Typography>

        {/* 2x2 grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1.5,
          }}
        >
          {cards.map((card) => (
            <MiniCard key={card.label} {...card} />
          ))}
        </Box>
      </Box>
    </Card>
  );
}
