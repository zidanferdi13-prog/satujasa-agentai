'use client';

import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
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

  if (isLoading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Admin User Dashboard
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent>
                <Skeleton variant="text" height={20} width="60%" sx={{ mb: 1 }} />
                <Skeleton variant="text" height={32} width="40%" />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Admin User Dashboard
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Transaksi Hari Ini
            </Typography>
            <Typography variant="h5">{data?.transactions_today ?? 0}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Pending
            </Typography>
            <Typography variant="h5">{data?.transactions_pending ?? 0}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Selesai
            </Typography>
            <Typography variant="h5">{data?.transactions_done ?? 0}</Typography>
          </CardContent>
        </Card>
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Tenant Activity
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Activity log akan ditampilkan di sini.
      </Typography>
    </Box>
  );
}
