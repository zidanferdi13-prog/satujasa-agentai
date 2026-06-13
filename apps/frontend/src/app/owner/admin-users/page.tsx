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
import Paper from '@mui/material/Paper';
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
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Admin User
        </Typography>
        <Link href="/owner/admin-users/baru">
          <Button variant="contained" startIcon={<span className="material-symbols-outlined text-[20px]">add</span>}>
            Tambah Admin User
          </Button>
        </Link>
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Gagal memuat admin user. Coba refresh halaman.
        </Alert>
      )}

      <FilterBar
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); }}
        searchPlaceholder="Cari email, telepon, atau tenant..."
        filters={[]}
        activeChips={search ? [{ label: `Pencarian: "${search}"`, onRemove: () => setSearch('') }] : []}
        onClearAll={() => { setSearch(''); }}
      />

      <Box sx={{ mt: 3 }}>
        {isLoading ? (
          <Paper variant="outlined">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Telepon</TableCell>
                    <TableCell>Tenant</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Dibuat</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[1, 2, 3].map((i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.default' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Telepon</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tenant</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Dibuat</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.tenant_name}</TableCell>
                    <TableCell>
                      <StatusPill status="Aktif" variant="success" />
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString('id-ID')}</TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        {search ? 'Admin user tidak ditemukan.' : 'Belum ada admin user.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}
