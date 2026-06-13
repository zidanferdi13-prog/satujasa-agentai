'use client';

import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MetricCard from '@/components/shared/MetricCard';
import EmptyState from '@/components/shared/EmptyState';
import apiClient from '@/lib/axios';

interface DashboardStats {
  total_owners: number;
  total_tenants: number;
  total_admin_users: number;
  total_revenue: number;
}

export default function AdminPage() {
  const { data, isLoading } = useQuery<DashboardStats>({
    queryKey: ['admin-dashboard'],
    queryFn: () => apiClient.get('/admin/dashboard').then((r) => r.data),
  });

  return (
    <Box sx={{ p: { xs: 3, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Super Admin Dashboard
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
          {[1, 2, 3, 4].map((i) => (
            <MetricCard key={i} label="" value="" loading />
          ))}
        </Box>
      ) : !data || (data.total_owners === 0 && data.total_tenants === 0 && data.total_admin_users === 0 && data.total_revenue === 0) ? (
        <EmptyState
          icon="dashboard"
          title="No Dashboard Data"
          description="Platform metrics akan ditampilkan di sini."
        />
      ) : (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
            <MetricCard label="Total Owners" value={data.total_owners} />
            <MetricCard label="Total Tenant" value={data.total_tenants} />
            <MetricCard label="Total Admin User" value={data.total_admin_users} />
            <MetricCard label="Total Revenue" value={`Rp${data.total_revenue.toLocaleString('id-ID')}`} />
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            System Status
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Platform metrics akan ditampilkan di sini.
          </Typography>
        </>
      )}
    </Box>
  );
}
