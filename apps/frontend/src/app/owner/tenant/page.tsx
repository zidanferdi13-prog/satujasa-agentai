'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import FilterBar from '@/components/shared/FilterBar';
import EmptyState from '@/components/shared/EmptyState';
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
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery<TenantListResponse>({
    queryKey: ['owner-tenants'],
    queryFn: () =>
      apiClient
        .get('/owner/tenants')
        .then((r) => r.data?.data ? { data: r.data.data, meta: r.data.meta } : r.data),
  });

  const filteredTenants = useMemo(() => {
    if (!data?.data) return [];
    if (!search) return data.data;
    const q = search.toLowerCase();
    return data.data.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.address.toLowerCase().includes(q) ||
        t.phone.toLowerCase().includes(q),
    );
  }, [data, search]);

  return (
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
      {/* Page Header */}
      <Box sx={{ mb: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontSize: { xs: 28, md: 32 },
              fontWeight: 800,
              color: 'var(--dash-text)',
              lineHeight: 1.2,
              mb: 1,
            }}
          >
            Tenant Saya 🏢
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: 15,
              color: 'var(--dash-muted)',
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Kelola dan pantau semua tenant bisnis Anda.
          </Typography>
        </Box>
        <Link href="/owner/tenant/baru">
          <Button
            variant="contained"
            startIcon={<span className="material-symbols-outlined">add</span>}
            sx={{
              borderRadius: '14px',
              textTransform: 'none',
              bgcolor: 'var(--dash-primary)',
              px: 3,
              py: 1.25,
              fontWeight: 700,
              boxShadow: '0 10px 22px rgba(79, 70, 229, 0.24)',
              '&:hover': {
                bgcolor: 'var(--dash-primary-2)',
                boxShadow: '0 12px 28px rgba(79, 70, 229, 0.3)',
              },
            }}
          >
            Tambah Tenant
          </Button>
        </Link>
      </Box>

      {isError && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: '14px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            bgcolor: 'rgba(254, 242, 242, 0.95)',
          }}
        >
          Gagal memuat tenant. Coba refresh halaman.
        </Alert>
      )}

      {/* Filter Bar */}
      <Box
        sx={{
          borderRadius: '18px',
          border: '1px solid #e5e9f3',
          boxShadow: '0 8px 20px rgba(30, 41, 59, 0.04)',
          background: 'rgba(255,255,255,0.94)',
          mb: 3,
          overflow: 'visible',
        }}
      >
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari tenant..."
          filters={[]}
          activeChips={search ? [{ label: `Pencarian: "${search}"`, onRemove: () => setSearch('') }] : []}
          onClearAll={() => setSearch('')}
        />
      </Box>

      {/* Table Card */}
      <Box sx={{ mt: 3 }}>
        {isLoading ? (
          <Box
            sx={{
              borderRadius: '22px',
              border: '1px solid #e5e9f3',
              boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
              background: 'rgba(255,255,255,0.94)',
              overflow: 'hidden',
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8f9fc', borderBottom: '2px solid #e5e9f3' }}>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Nama</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Alamat</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Telepon</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, textAlign: 'center' }}>Admin User</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, textAlign: 'center' }}>Transaksi</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Dibuat</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[1, 2, 3].map((i) => (
                    <TableRow key={i} sx={{ borderBottom: '1px solid #f0f1f5' }}>
                      {[1, 2, 3, 4, 5, 6].map((j) => (
                        <TableCell key={j} sx={{ py: 2.5 }}>
                          <Skeleton variant="rounded" height={20} sx={{ borderRadius: '8px' }} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : filteredTenants.length === 0 ? (
          <EmptyState
            icon="store"
            title={search ? 'Tenant tidak ditemukan' : 'Belum ada tenant'}
            description={search ? 'Coba gunakan kata kunci lain.' : 'Buat tenant baru untuk memulai.'}
            action={search ? undefined : { label: 'Buat Tenant Pertama', onClick: () => window.location.href = '/owner/tenant/baru' }}
          />
        ) : (
          <Box
            sx={{
              borderRadius: '22px',
              border: '1px solid #e5e9f3',
              boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
              background: 'rgba(255,255,255,0.94)',
              overflow: 'hidden',
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8f9fc', borderBottom: '2px solid #e5e9f3' }}>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Nama</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Alamat</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Telepon</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, textAlign: 'center' }}>Admin User</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, textAlign: 'center' }}>Transaksi</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Dibuat</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTenants.map((tenant) => (
                    <TableRow
                      key={tenant.id}
                      hover
                      sx={{
                        cursor: 'pointer',
                        '&:last-child td': { borderBottom: 'none' },
                        transition: 'all 0.15s',
                        '&:hover': { bgcolor: '#f8f9fc' },
                        '& td': { borderBottom: '1px solid #f0f1f5', py: 2.1 },
                      }}
                      component={Link}
                      href={`/owner/tenant/${tenant.id}`}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ width: 42, height: 42, borderRadius: '12px', display: 'grid', placeItems: 'center', bgcolor: '#eef2ff', color: '#4f46e5', fontWeight: 800, fontSize: 16 }}>
                            {(tenant.name || 'TN').slice(0, 2).toUpperCase()}
                          </Box>
                          <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#1d2433' }}>{tenant.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#6b7280', fontSize: 14 }}>{tenant.address}</TableCell>
                      <TableCell sx={{ color: '#6b7280', fontSize: 14 }}>{tenant.phone}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.25, py: 0.6, borderRadius: '10px', bgcolor: '#eef2ff', color: '#4f46e5', fontSize: 12, fontWeight: 800 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>group</span>
                          {tenant.admin_user_count}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.25, py: 0.6, borderRadius: '10px', bgcolor: '#ecfdf3', color: '#22c55e', fontSize: 12, fontWeight: 800 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>receipt</span>
                          {tenant.transaction_count}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#8a91a3', fontSize: 14 }}>{new Date(tenant.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </Box>
  );
}
