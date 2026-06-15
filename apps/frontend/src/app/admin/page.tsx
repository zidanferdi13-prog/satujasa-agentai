'use client';

import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import DashboardHero from '@/components/dashboard/DashboardHero';
import KpiCard from '@/components/dashboard/KpiCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import SubscriptionDonut from '@/components/dashboard/SubscriptionDonut';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import SystemHealth from '@/components/dashboard/SystemHealth';
import QuickActions from '@/components/dashboard/QuickActions';
import PlatformSummary from '@/components/dashboard/PlatformSummary';
import apiClient from '@/lib/axios';
import type { DashboardResponse } from '@/types/dashboard';

const KPI_CONFIG: Array<{
  icon: string;
  label: string;
  dataKey: keyof DashboardResponse;
  color: string;
  deltaKey: keyof DashboardResponse | null;
  deltaLabel: string;
}> = [
  { icon: '👥', label: 'Total Owner', dataKey: 'total_owners', color: '#4f46e5', deltaKey: 'active_owners', deltaLabel: 'active' },
  { icon: '🏢', label: 'Total Tenant', dataKey: 'total_tenants', color: '#8b5cf6', deltaKey: null, deltaLabel: '' },
  { icon: '🧑‍💻', label: 'Transaksi', dataKey: 'total_transactions', color: '#22c55e', deltaKey: null, deltaLabel: '' },
  { icon: '💳', label: 'Revenue', dataKey: 'total_revenue', color: '#f59e0b', deltaKey: null, deltaLabel: 'total' },
];

function DashboardSkeleton() {
  return (
    <Box sx={{ p: '26px 34px 42px' }}>
      <Skeleton variant="rounded" height={170} sx={{ mb: 3, borderRadius: '26px' }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', lg: 'repeat(4,1fr)' }, gap: '18px', mb: 3 }}>
        {[1,2,3,4].map(i => <Skeleton key={i} variant="rounded" height={150} sx={{ borderRadius: '22px' }} />)}
      </Box>
      <Skeleton variant="rounded" height={280} sx={{ mb: 3, borderRadius: '22px' }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.55fr 1fr 1.25fr' }, gap: '18px', mb: 3 }}>
        <Skeleton variant="rounded" height={180} sx={{ borderRadius: '22px' }} />
        <Skeleton variant="rounded" height={180} sx={{ borderRadius: '22px' }} />
        <Skeleton variant="rounded" height={180} sx={{ borderRadius: '22px' }} />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1.15fr 1.25fr' }, gap: '18px' }}>
        <Skeleton variant="rounded" height={160} sx={{ borderRadius: '22px' }} />
        <Skeleton variant="rounded" height={160} sx={{ borderRadius: '22px' }} />
        <Skeleton variant="rounded" height={160} sx={{ borderRadius: '22px' }} />
      </Box>
    </Box>
  );
}

function SectionError() {
  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Alert severity="error" sx={{ mb: 0 }}>
        Gagal memuat data dashboard.
      </Alert>
    </Box>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useQuery<DashboardResponse>({
    queryKey: ['admin-dashboard'],
    queryFn: () =>
      apiClient
        .get('/admin/dashboard')
        .then((r) => r.data?.data ? r.data.data : r.data),
  });

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <SectionError />;

  const safe = data ?? {} as DashboardResponse;

  return (
    <Box
      sx={{
        p: { xs: 2, md: '26px 34px 42px' },
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 90% 0%, rgba(99, 102, 241, 0.13), transparent 35%),
          radial-gradient(circle at 0% 100%, rgba(34, 197, 94, 0.08), transparent 32%),
          #f6f8fc
        `,
      }}
    >
      {/* Hero */}
      <DashboardHero data={safe} />

      {/* KPI Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: '18px',
          mb: '22px',
        }}
      >
        {KPI_CONFIG.map((kpi) => {
          const rawValue = safe[kpi.dataKey];
          const value = kpi.dataKey === 'total_revenue'
            ? `Rp ${Number(rawValue ?? 0).toLocaleString('id-ID')}`
            : String(rawValue ?? 0);

          const active = kpi.deltaKey ? safe[kpi.deltaKey] : undefined;
          const rawNum = Number(rawValue ?? 0);
          const deltaStr = active !== undefined && rawNum > 0
            ? `${((Number(active) / rawNum) * 100).toFixed(0)}%`
            : undefined;
          const deltaDir = deltaStr ? 'up' as const : undefined;

          return (
            <KpiCard
              key={kpi.dataKey}
              icon={kpi.icon}
              label={kpi.label}
              value={value}
              delta={deltaStr}
              deltaDirection={deltaDir}
              color={kpi.color}
              sparklineData={undefined}
            />
          );
        })}
      </Box>

      {/* Middle: Revenue + Sub Donut (left stack) | Activity (right) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.55fr 1.25fr' },
          gap: '18px',
          mb: '22px',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <RevenueChart data={undefined} />
          <SubscriptionDonut data={safe.subscription_distribution} />
        </Box>
        <ActivityFeed data={safe.recent_activity} />
      </Box>

      {/* Bottom: System Health + Quick Actions + Platform Summary */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1.15fr 1.25fr' },
          gap: '18px',
        }}
      >
        <SystemHealth data={safe.system_health} />
        <QuickActions />
        <PlatformSummary data={safe.platform_stats} />
      </Box>
    </Box>
  );
}
