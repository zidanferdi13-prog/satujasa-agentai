'use client';

import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import apiClient from '@/lib/axios';

interface DashboardStats {
  total_tenants: number;
  total_admin_users: number;
  total_transactions: number;
  total_revenue: number;
}

export default function OwnerPage() {
  const { data, isLoading } = useQuery<DashboardStats>({
    queryKey: ['owner-dashboard'],
    queryFn: () => apiClient.get('/owner/dashboard').then((r) => r.data),
  });

  if (isLoading) {
    return (
      <Box className="p-8">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box className="p-8">
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Owner Dashboard
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Total Tenant
            </Typography>
            <Typography variant="h5">{data?.total_tenants ?? 0}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Total Admin User
            </Typography>
            <Typography variant="h5">{data?.total_admin_users ?? 0}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Total Transaksi
            </Typography>
            <Typography variant="h5">{data?.total_transactions ?? 0}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Total Revenue
            </Typography>
            <Typography variant="h5">
              Rp{(data?.total_revenue ?? 0).toLocaleString('id-ID')}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Tenant List
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Tenant data akan ditampilkan di sini.
      </Typography>
    </Box>
  );
}
