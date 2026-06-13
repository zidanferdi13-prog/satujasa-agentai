'use client';

import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MetricCard from '@/components/shared/MetricCard';
import EmptyState from '@/components/shared/EmptyState';
import apiClient from '@/lib/axios';

interface DashboardStats {
  transactions_today: number;
  transactions_pending: number;
  transactions_done: number;
}

export default function UserAdminPage() {
  const { data, isLoading } = useQuery<DashboardStats>({
    queryKey: ['user-admin-dashboard'],
    queryFn: () => apiClient.get('/admin-user/dashboard').then((r) => r.data),
  });

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Admin User Dashboard
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
          {[1, 2, 3].map((i) => (
            <MetricCard key={i} label="" value="" loading />
          ))}
        </Box>
      ) : !data || (data.transactions_today === 0 && data.transactions_pending === 0 && data.transactions_done === 0) ? (
        <EmptyState
          icon="dashboard"
          title="No Dashboard Data"
          description="Activity log akan ditampilkan di sini."
        />
      ) : (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
            <MetricCard label="Transaksi Hari Ini" value={data.transactions_today} />
            <MetricCard label="Pending" value={data.transactions_pending} />
            <MetricCard label="Selesai" value={data.transactions_done} />
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Tenant Activity
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Activity log akan ditampilkan di sini.
          </Typography>
        </>
      )}
    </Box>
  );
}
