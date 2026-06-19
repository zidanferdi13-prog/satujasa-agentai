'use client';

import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import apiClient from '@/lib/axios';
import AdminUserHero from '@/components/admin-user/AdminUserHero';
import AdminUserKpiGrid from '@/components/admin-user/AdminUserKpiGrid';
import AdminUserQuickActions from '@/components/admin-user/AdminUserQuickActions';
import AdminUserActivityFeed from '@/components/admin-user/AdminUserActivityFeed';
import AdminUserTransactionTable from '@/components/admin-user/AdminUserTransactionTable';
import DashboardErrorBoundary from '@/components/shared/DashboardErrorBoundary';
import type { AdminUserDashboardResponse } from '@/types/dashboard';

const AdminUserChart = dynamic(() => import('@/components/admin-user/AdminUserChart'), {
  loading: () => <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />,
});
const AdminUserTeamPerformance = dynamic(() => import('@/components/admin-user/AdminUserTeamPerformance'), {
  loading: () => <Skeleton variant="rounded" height={220} sx={{ borderRadius: 3 }} />,
});
const AdminUserRequestsSummary = dynamic(() => import('@/components/admin-user/AdminUserRequestsSummary'), {
  loading: () => <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} />,
});

function DashboardSkeleton() {
  return (
    <Box sx={{ p: '32px 40px 48px' }}>
      <Skeleton variant="rounded" height={100} sx={{ borderRadius: 3, mb: 3 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rounded" height={128} sx={{ borderRadius: 3 }} />)}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1.55fr 0.82fr 1.05fr' }, gap: 3, mb: 3 }}>
        <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
        <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
        <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2.28fr 1fr' }, gap: 3 }}>
        <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Skeleton variant="rounded" height={220} sx={{ borderRadius: 3 }} />
          <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} />
        </Box>
      </Box>
    </Box>
  );
}

export default function UserAdminPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery<AdminUserDashboardResponse>({
    queryKey: ['user-admin-dashboard'],
    queryFn: () => apiClient.get('/admin-user/dashboard').then((r) => r.data?.data ?? r.data),
    retry: 1,
  });

  if (isLoading) return <DashboardSkeleton />;

  return (
    <DashboardErrorBoundary>
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
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <Button color="inherit" size="small" onClick={() => refetch()} disabled={isFetching}>
                Coba lagi
              </Button>
            }
          >
            Gagal memuat data dashboard. Data kosong sementara tetap ditampilkan.
          </Alert>
        )}

        <AdminUserHero />
        <AdminUserKpiGrid kpis={data?.kpi} />

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
    </DashboardErrorBoundary>
  );
}
