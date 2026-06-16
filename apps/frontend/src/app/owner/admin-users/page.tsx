'use client';

import { useState, useMemo } from 'react';
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
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import FilterBar from '@/components/shared/FilterBar';
import StatusPill from '@/components/shared/StatusPill';
import apiClient from '@/lib/axios';

interface AdminUser {
  id: string;
  email: string;
  phone: string;
  tenant_name: string;
  created_at: string;
}

interface AdminUserListResponse {
  data: AdminUser[];
  meta: { total: number };
}

export default function AdminUserListPage() {
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery<AdminUserListResponse>({
    queryKey: ['owner-admin-users'],
    queryFn: () =>
      apiClient
        .get('/owner/admin-users')
        .then((r) => r.data?.data ? { data: r.data.data, meta: r.data.meta } : r.data),
  });

  const filteredData = useMemo(() => {
    if (!data?.data) return [];
    let items = data.data;
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((u) => u.email.toLowerCase().includes(q) || u.phone.toLowerCase().includes(q) || u.tenant_name.toLowerCase().includes(q));
    }
    return items;
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
            Admin User 👥
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
            Kelola admin user untuk tenant-tenant Anda.
          </Typography>
        </Box>
        <Link href="/owner/admin-users/baru">
          <Button
            variant="contained"
            startIcon={<span className="material-symbols-outlined">person_add</span>}
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
            Tambah Admin User
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
          Gagal memuat admin user. Coba refresh halaman.
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
          onSearchChange={(v) => { setSearch(v); }}
          searchPlaceholder="Cari email, telepon, atau tenant..."
          filters={[]}
          activeChips={search ? [{ label: `Pencarian: "${search}"`, onRemove: () => setSearch('') }] : []}
          onClearAll={() => { setSearch(''); }}
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
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Telepon</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Tenant</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Dibuat</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[1, 2, 3].map((i) => (
                    <TableRow key={i} sx={{ borderBottom: '1px solid #f0f1f5' }}>
                      {[1, 2, 3, 4, 5].map((j) => (
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
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Telepon</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Tenant</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Dibuat</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((user) => (
                    <TableRow
                      key={user.id}
                      hover
                      sx={{
                        transition: 'all 0.15s',
                        '&:hover': { bgcolor: '#f8f9fc' },
                        '& td': { borderBottom: '1px solid #f0f1f5', py: 2.1 },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ width: 42, height: 42, borderRadius: '12px', display: 'grid', placeItems: 'center', bgcolor: '#eef2ff', color: '#4f46e5', fontWeight: 800, fontSize: 16 }}>
                            {user.email.slice(0, 2).toUpperCase()}
                          </Box>
                          <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#1d2433' }}>{user.email}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#6b7280', fontSize: 14 }}>{user.phone}</TableCell>
                      <TableCell sx={{ color: '#6b7280', fontSize: 14 }}>{user.tenant_name}</TableCell>
                      <TableCell>
                        <StatusPill status="Aktif" variant="success" />
                      </TableCell>
                      <TableCell sx={{ color: '#8a91a3', fontSize: 14 }}>{new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</TableCell>
                    </TableRow>
                  ))}
                  {filteredData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ width: 72, height: 72, borderRadius: '22px', display: 'grid', placeItems: 'center', bgcolor: '#f0f1f5' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#8a91a3' }}>person_off</span>
                          </Box>
                          <Typography sx={{ color: '#1d2433', fontSize: 16, fontWeight: 800 }}>
                            {search ? 'Admin user tidak ditemukan' : 'Belum ada admin user'}
                          </Typography>
                          <Typography sx={{ color: '#8a91a3', fontSize: 13 }}>
                            {search ? 'Coba gunakan kata kunci lain.' : 'Tambahkan admin user untuk memulai.'}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </Box>
  );
}
