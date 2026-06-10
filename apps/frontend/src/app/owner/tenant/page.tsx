'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import apiClient from '@/lib/axios';

interface Tenant {
  id: string;
  name: string;
  address: string;
  phone: string;
  admin_user_count: number;
  transaction_count: number;
  created_at: string;
}

interface TenantListResponse {
  data: Tenant[];
  meta: { total: number };
}

export default function TenantListPage() {
  const { data, isLoading, isError } = useQuery<TenantListResponse>({
    queryKey: ['owner-tenants'],
    queryFn: () =>
      apiClient
        .get('/owner/tenants')
        .then((r) => r.data?.data ? { data: r.data.data, meta: r.data.meta } : r.data),
  });

  return (
    <Box className="p-6 md:p-8">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Tenant Saya
        </Typography>
        <Link href="/owner/tenant/baru">
          <Button variant="contained" startIcon={<span className="material-symbols-outlined text-[20px]">add</span>}>
            Tambah Tenant
          </Button>
        </Link>
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Gagal memuat tenant. Coba refresh halaman.
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent>
                <Skeleton variant="text" height={28} sx={{ mb: 1 }} />
                <Skeleton variant="text" height={20} width="80%" />
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {data?.data?.map((tenant) => (
            <Link href={`/owner/tenant/${tenant.id}`} key={tenant.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {tenant.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {tenant.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    📞 {tenant.phone}
                  </Typography>

                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Admin User</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {tenant.admin_user_count}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Transaksi</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {tenant.transaction_count}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Link>
          ))}

          {(!data?.data || data.data.length === 0) && (
            <Card sx={{ gridColumn: '1 / -1' }}>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Belum ada tenant. Buat tenant baru untuk memulai.
                </Typography>
                <Link href="/owner/tenant/baru">
                  <Button variant="contained">
                    Buat Tenant Pertama
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
}
