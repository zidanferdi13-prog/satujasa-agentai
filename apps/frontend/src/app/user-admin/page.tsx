'use client';

import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import apiClient from '@/lib/axios';
import AdminUserHero from '@/components/admin-user/AdminUserHero';
import AdminUserKpiGrid from '@/components/admin-user/AdminUserKpiGrid';
import AdminUserChart from '@/components/admin-user/AdminUserChart';
import AdminUserQuickActions from '@/components/admin-user/AdminUserQuickActions';
import AdminUserActivityFeed from '@/components/admin-user/AdminUserActivityFeed';
import AdminUserTransactionTable from '@/components/admin-user/AdminUserTransactionTable';
import AdminUserTeamPerformance from '@/components/admin-user/AdminUserTeamPerformance';
import AdminUserRequestsSummary from '@/components/admin-user/AdminUserRequestsSummary';
import type { AdminUserDashboardResponse } from '@/types/dashboard';

function DashboardSkeleton() {
  return (
    <Box sx={{ p: '32px 40px 48px' }}>
      <Skeleton variant="rounded" height={100} sx={{ borderRadius: '22px', mb: 3 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rounded" height={128} sx={{ borderRadius: '22px' }} />)}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1.55fr 0.82fr 1.05fr' }, gap: 3, mb: 3 }}>
        <Skeleton variant="rounded" height={320} sx={{ borderRadius: '22px' }} />
        <Skeleton variant="rounded" height={320} sx={{ borderRadius: '22px' }} />
        <Skeleton variant="rounded" height={320} sx={{ borderRadius: '22px' }} />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2.28fr 1fr' }, gap: 3 }}>
        <Skeleton variant="rounded" height={400} sx={{ borderRadius: '22px' }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Skeleton variant="rounded" height={220} sx={{ borderRadius: '22px' }} />
          <Skeleton variant="rounded" height={180} sx={{ borderRadius: '22px' }} />
        </Box>
      </Box>
    </Box>
  );
}

export default function UserAdminPage() {
  const { data, isLoading, isError } = useQuery<AdminUserDashboardResponse>({
    queryKey: ['user-admin-dashboard'],
    queryFn: () => apiClient.get('/admin-user/dashboard').then((r) => r.data?.data ?? r.data),
    retry: 1,
  });

  if (isLoading) return <DashboardSkeleton />;

  return (
    <Box
      sx={{
        p: { xs: '20px', sm: '24px 28px', lg: '32px 40px 48px' },
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 90% 0%, rgba(96, 68, 244, 0.08), transparent 35%),
          radial-gradient(circle at 0% 100%, rgba(34, 197, 94, 0.06), transparent 32%),
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
      <AdminUserHero userName={undefined} />

      {/* KPI Grid */}
      <AdminUserKpiGrid kpis={data?.kpi} />

      {/* Row 2: Chart | Quick Actions | Activity */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1.55fr 0.82fr 1.05fr' },
          gap: 3,
          mb: 3,
        }}
      >
        <AdminUserChart chartData={data?.chart_30d} />
        <AdminUserQuickActions />
        <AdminUserActivityFeed activities={data?.activity} />
      </Box>

      {/* Row 3: Transaction Table | Team Perf + Requests */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2.28fr 1fr' },
          gap: 3,
        }}
      >
        <AdminUserTransactionTable transactions={data?.recent_transactions} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <AdminUserTeamPerformance performance={data?.team_performance} />
          <AdminUserRequestsSummary requests={data?.requests_summary} />
        </Box>
      </Box>
    </Box>
  );
}
