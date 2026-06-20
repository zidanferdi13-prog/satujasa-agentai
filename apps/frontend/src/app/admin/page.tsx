'use client';

import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import DashboardHero from '@/components/dashboard/DashboardHero';
import KpiCard from '@/components/dashboard/KpiCard';
import QuickActions from '@/components/dashboard/QuickActions';
import DashboardErrorBoundary from '@/components/shared/DashboardErrorBoundary';
import apiClient from '@/lib/axios';
import type { DashboardResponse } from '@/types/dashboard';

const RevenueChart = dynamic(() => import('@/components/dashboard/RevenueChart'), {
  loading: () => <Skeleton variant="rounded" height={280} sx={{ borderRadius: 3 }} />,
});
const SubscriptionDonut = dynamic(() => import('@/components/dashboard/SubscriptionDonut'), {
  loading: () => <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} />,
});
const ActivityFeed = dynamic(() => import('@/components/dashboard/ActivityFeed'), {
  loading: () => <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} />,
});
const SystemHealth = dynamic(() => import('@/components/dashboard/SystemHealth'), {
  loading: () => <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} />,
});
const PlatformSummary = dynamic(() => import('@/components/dashboard/PlatformSummary'), {
  loading: () => <Skeleton variant="rounded" height={160} sx={{ borderRadius: 3 }} />,
});

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
  { icon: '💳', label: 'Revenue', dataKey: 'total_subscription_revenue', color: '#f59e0b', deltaKey: null, deltaLabel: 'total' },
];

function DashboardSkeleton() {
  return (
    <Box sx={{ p: '26px 34px 42px' }}>
      <Skeleton variant="rounded" height={170} sx={{ mb: 3, borderRadius: 3 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', lg: 'repeat(4,1fr)' }, gap: '18px', mb: 3 }}>
        {[1,2,3,4].map(i => <Skeleton key={i} variant="rounded" height={150} sx={{ borderRadius: 3 }} />)}
      </Box>
      <Skeleton variant="rounded" height={280} sx={{ mb: 3, borderRadius: 3 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.55fr 1fr 1.25fr' }, gap: '18px', mb: 3 }}>
        <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} />
        <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} />
        <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1.15fr 1.25fr' }, gap: '18px' }}>
        <Skeleton variant="rounded" height={160} sx={{ borderRadius: 3 }} />
        <Skeleton variant="rounded" height={160} sx={{ borderRadius: 3 }} />
        <Skeleton variant="rounded" height={160} sx={{ borderRadius: 3 }} />
      </Box>
    </Box>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery<DashboardResponse>({
    queryKey: ['admin-dashboard'],
    queryFn: () =>
      apiClient
        .get('/admin/dashboard')
        .then((r) => r.data?.data ? r.data.data : r.data),
  });

  if (isLoading) return <DashboardSkeleton />;

  const safe = data ?? {} as DashboardResponse;

  return (
    <DashboardErrorBoundary>
      <Box
        sx={{
          p: { xs: '20px', sm: '24px 28px', lg: '32px 40px 48px' },
          minHeight: '100vh',
          background: `
            radial-gradient(circle at 90% 0%, rgba(99, 102, 241, 0.13), transparent 35%),
            radial-gradient(circle at 0% 100%, rgba(34, 197, 94, 0.08), transparent 32%),
            #f6f8fc
          `,
        }}
      >
        {isError && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <Button color="inherit" size="small" onClick={() => refetch()} disabled={isFetching}>
                Coba lagi
              </Button>
            }
          >
            Gagal memuat data dashboard. Data default sementara tetap ditampilkan.
          </Alert>
        )}

        <DashboardHero />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: '20px',
            mb: '24px',
          }}
        >
          {KPI_CONFIG.map((kpi) => {
            const rawValue = safe[kpi.dataKey];
            const value = (kpi.dataKey === 'total_revenue' || kpi.dataKey === 'total_subscription_revenue')
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

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.6fr 1fr' },
            gap: '20px',
            mb: '24px',
          }}
        >
          <RevenueChart data={safe.monthly_revenue} />
          <ActivityFeed data={safe.recent_activity} />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
            gap: '20px',
            mb: '24px',
          }}
        >
          <SubscriptionDonut data={safe.subscription_distribution} />
          <SystemHealth data={safe.system_health} />
          <QuickActions />
        </Box>

        <PlatformSummary data={safe.platform_stats} />
      </Box>
    </DashboardErrorBoundary>
  );
}
