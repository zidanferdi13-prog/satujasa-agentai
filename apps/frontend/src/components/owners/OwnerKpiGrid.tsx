'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

interface KpiCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend: string;
  color: string;
  sparkData?: number[];
}

function Sparkline({ data = [3, 5, 4, 7, 6, 9, 8], color }: { data?: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 60;
    const y = 24 - (v / max) * 20;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
      <polyline points={points} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function KpiCard({ icon, label, value, trend, color, sparkData }: KpiCardProps) {
  const trendNum = parseFloat(trend);
  const isPositive = trendNum >= 0;

  return (
    <Card sx={{ p: 2.5, borderRadius: '22px', border: '1px solid #e8eaf0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: 1.5, position: 'relative', overflow: 'visible' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: `${color}15`, color, fontSize: 20 }}>
          <span className="material-symbols-outlined">{icon}</span>
        </Box>
        <Sparkline data={sparkData} color={color} />
      </Box>
      <Box>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#8b8fa3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</Typography>
        <Typography sx={{ fontSize: 28, fontWeight: 800, lineHeight: 1.1, mt: 0.5 }}>{value}</Typography>
      </Box>
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: isPositive ? '#22c7b8' : '#ef4444', display: 'flex', alignItems: 'center', gap: 0.3 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{isPositive ? 'trending_up' : 'trending_down'}</span>
          {isPositive ? '+' : ''}{trend}%
        </Typography>
        <Typography sx={{ fontSize: 11, color: '#a0a4b8' }}>vs bulan lalu</Typography>
      </Box>
    </Card>
  );
}

interface OwnerKpiGridProps {
  totalTenants: number;
  totalAdminUsers: number;
  totalTransactions: number;
  totalRevenue: string;
  trends: { tenants: string; admin_users: string; transactions: string; revenue: string };
}

export default function OwnerKpiGrid({ totalTenants = 0, totalAdminUsers = 0, totalTransactions = 0, totalRevenue = '0', trends }: OwnerKpiGridProps) {
  const formatRupiah = (val: string) => {
    const num = Number(val);
    if (num >= 1_000_000_000) return `Rp ${(num / 1_000_000_000).toFixed(1)}M`;
    if (num >= 1_000_000) return `Rp ${(num / 1_000_000).toFixed(1)}JT`;
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  const cards: KpiCardProps[] = [
    { icon: 'apartment', label: 'Total Tenant', value: totalTenants, trend: trends?.tenants ?? '0', color: '#6254f3', sparkData: [2, 3, 4, 3, 5, 6, 7] },
    { icon: 'group', label: 'Total Admin User', value: totalAdminUsers, trend: trends?.admin_users ?? '0', color: '#2388ff', sparkData: [1, 2, 3, 2, 4, 3, 5] },
    { icon: 'shopping_cart', label: 'Total Transaksi', value: totalTransactions, trend: trends?.transactions ?? '0', color: '#22c7b8', sparkData: [5, 8, 6, 9, 10, 12, 14] },
    { icon: 'payments', label: 'Total Revenue', value: formatRupiah(totalRevenue), trend: trends?.revenue ?? '0', color: '#f6a326', sparkData: [3, 5, 4, 6, 8, 7, 9] },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
      {cards.map((card) => <KpiCard key={card.label} {...card} />)}
    </Box>
  );
}
