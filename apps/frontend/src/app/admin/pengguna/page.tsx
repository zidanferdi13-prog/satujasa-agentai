'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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

interface User {
  id: string;
  email: string;
  role: string;
  owner_name?: string;
  is_active: boolean;
  created_at: string;
}

interface UsersListResponse {
  data: User[];
  meta: { total: number };
}

const roleVariant: Record<string, 'success' | 'warning' | 'info' | 'error'> = {
  superadmin: 'info',
  owner: 'warning',
  admin_user: 'success',
};

export default function AdminPenggunaPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const { data, isLoading, isError } = useQuery<UsersListResponse>({
    queryKey: ['admin-users', search, roleFilter],
    queryFn: () =>
      apiClient
        .get('/admin/users', { params: { search: search || undefined, role: roleFilter || undefined } })
        .then((r) => r.data?.data ? { data: r.data.data, meta: r.data.meta } : r.data),
  });

  return (
    <Box sx={{ p: { xs: 3, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Pengguna
      </Typography>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Gagal memuat data pengguna. Coba refresh halaman.
        </Alert>
      )}

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari email pengguna..."
        filters={[
          {
            label: 'Role',
            value: roleFilter,
            options: [
              { label: 'Semua', value: '' },
              { label: 'Super Admin', value: 'superadmin' },
              { label: 'Owner', value: 'owner' },
              { label: 'Admin User', value: 'admin_user' },
            ],
            onChange: setRoleFilter,
          },
        ]}
        activeChips={[
          ...(search ? [{ label: `Pencarian: "${search}"`, onRemove: () => setSearch('') }] : []),
          ...(roleFilter ? [{ label: `Role: ${roleFilter}`, onRemove: () => setRoleFilter('') }] : []),
        ]}
        onClearAll={() => { setSearch(''); setRoleFilter(''); }}
      />

      {isLoading ? (
        <Paper variant="outlined">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Dibuat</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton width="60%" /></TableCell>
                    <TableCell><Skeleton width="50%" /></TableCell>
                    <TableCell><Skeleton width="80%" /></TableCell>
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
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Dibuat</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data?.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <StatusPill
                      status={user.role.replace('_', ' ').toUpperCase()}
                      variant={roleVariant[user.role] || 'info'}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusPill
                      status={user.is_active ? 'AKTIF' : 'NONAKTIF'}
                      variant={user.is_active ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString('id-ID')}</TableCell>
                </TableRow>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Tidak ada pengguna ditemukan.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
