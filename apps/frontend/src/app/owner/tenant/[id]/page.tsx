'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import apiClient from '@/lib/axios';

interface AdminUser {
  id: string;
  email: string;
  phone: string;
  created_at: string;
}

interface TenantDetail {
  id: string;
  name: string;
  address: string;
  phone: string;
  admin_users: AdminUser[];
  created_at: string;
}

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: tenant, isLoading } = useQuery<TenantDetail>({
    queryKey: ['owner-tenant', id],
    queryFn: () =>
      apiClient.get(`/owner/tenants/${id}`).then((r) => r.data?.data ?? r.data),
  });

  if (isLoading) {
    return <Box className="p-8"><Typography>Loading...</Typography></Box>;
  }

  if (!tenant) {
    return <Box className="p-8"><Typography>Tenant tidak ditemukan.</Typography></Box>;
  }

  return (
    <Box className="p-6 md:p-8" sx={{ maxWidth: 800 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Button variant="text" onClick={() => router.back()} sx={{ minWidth: 0 }}>
          <span className="material-symbols-outlined">arrow_back</span>
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, flex: 1 }}>
          {tenant.name}
        </Typography>
      </Box>

      {/* Info */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Alamat</Typography>
            <Typography variant="body2">{tenant.address}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Telepon</Typography>
            <Typography variant="body2">{tenant.phone}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Dibuat</Typography>
            <Typography variant="body2">{new Date(tenant.created_at).toLocaleDateString('id-ID')}</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Admin Users */}
      <Divider sx={{ my: 3 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Admin User ({tenant.admin_users?.length ?? 0})
        </Typography>
        <Link href={`/owner/admin-users/baru?tenant_id=${tenant.id}`}>
          <Button size="small" variant="contained">
            Tambah Admin
          </Button>
        </Link>
      </Box>

      {tenant.admin_users && tenant.admin_users.length > 0 ? (
        <Box sx={{ display: 'grid', gap: 2 }}>
          {tenant.admin_users.map((user) => (
            <Card key={user.id} variant="outlined">
              <CardContent sx={{ py: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {user.email}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.phone}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Card variant="outlined">
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Belum ada admin user di tenant ini.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
