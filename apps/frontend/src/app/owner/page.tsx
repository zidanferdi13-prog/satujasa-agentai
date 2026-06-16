'use client';

import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import apiClient from '@/lib/axios';
import OwnerHero from '@/components/owners/OwnerHero';
import OwnerKpiGrid from '@/components/owners/OwnerKpiGrid';
import OwnerTenantTable from '@/components/owners/OwnerTenantTable';
import OwnerChart from '@/components/owners/OwnerChart';
import OwnerQuickActions from '@/components/owners/OwnerQuickActions';
import OwnerActivityFeed from '@/components/owners/OwnerActivityFeed';
import OwnerSubscription from '@/components/owners/OwnerSubscription';
import OwnerHealth from '@/components/owners/OwnerHealth';
import type { OwnerDashboardResponse } from '@/types/dashboard';

function OwnerDashboardSkeleton() {
  return (
    <Box sx={{ p: '32px 40px 48px' }}>
      <Skeleton variant="rounded" height={100} sx={{ borderRadius: '22px', mb: 3 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rounded" height={140} sx={{ borderRadius: '22px' }} />)}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { lg: '1.35fr 1.15fr 0.72fr' }, gap: 3 }}>
        <Skeleton variant="rounded" height={400} sx={{ borderRadius: '22px' }} />
        <Skeleton variant="rounded" height={400} sx={{ borderRadius: '22px' }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Skeleton variant="rounded" height={200} sx={{ borderRadius: '22px' }} />
          <Skeleton variant="rounded" height={250} sx={{ borderRadius: '22px' }} />
        </Box>
      </Box>
    </Box>
  );
}

export default function OwnerPage() {
  const { data, isLoading, isError } = useQuery<OwnerDashboardResponse>({
    queryKey: ['owner-dashboard'],
    queryFn: () => apiClient.get('/owner/dashboard').then((r) => r.data),
    retry: 1,
  });

  if (isLoading) return <OwnerDashboardSkeleton />;

  const kpi = data?.kpi ?? {
    total_tenants: 0,
    total_admin_users: 0,
    total_transactions: 0,
    active_transactions: 0,
    total_revenue: '0',
    trends: { tenants: '0', admin_users: '0', transactions: '0', revenue: '0' },
  };

  const healthSummary = data?.health
    ? (data.health.server === 'operational' && data.health.database === 'operational' ? 'operational' : 'degraded')
    : 'operational';

  return (
    <Box
      sx={{
        p: { xs: '20px', sm: '24px 28px', lg: '32px 40px 48px' },
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 90% 0%, rgba(98, 84, 243, 0.08), transparent 35%),
          radial-gradient(circle at 0% 100%, rgba(34, 199, 184, 0.06), transparent 32%),
          #f6f8fc
        `,
      }}
    >
      {isError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '14px' }}>
          Gagal memuat data dashboard. Coba refresh halaman.
        </Alert>
      )}

      {/* Hero */}
      <OwnerHero ownerName="Owner" healthStatus={healthSummary} />

      {/* KPI Grid */}
      <OwnerKpiGrid
        totalTenants={kpi.total_tenants}
        totalAdminUsers={kpi.total_admin_users}
        totalTransactions={kpi.total_transactions}
        totalRevenue={kpi.total_revenue}
        trends={kpi.trends}
      />

      {/* Main Grid Layout */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.5fr 1fr' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        {/* Left Column: Tenant Table + Chart + Quick Actions */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <OwnerTenantTable tenants={data?.tenants} />
          <OwnerChart data={data?.chart_30d} />
          <OwnerQuickActions />
        </Box>

        {/* Right Column: Activity + Subscription + Health */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <OwnerActivityFeed activities={data?.activity} />
          <OwnerSubscription subscription={data?.subscription} />
          <OwnerHealth health={data?.health} />
        </Box>
      </Box>
    </Box>
  );
}
