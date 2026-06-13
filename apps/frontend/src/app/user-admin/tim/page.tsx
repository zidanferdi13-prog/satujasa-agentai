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

interface TeamMember {
  id: string;
  email: string;
  name?: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface TeamResponse {
  data: TeamMember[];
  meta: { total: number };
}

export default function UserAdminTimPage() {
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery<TeamResponse>({
    queryKey: ['admin-user-team', search],
    queryFn: () =>
      apiClient
        .get('/admin-user/team', { params: { search: search || undefined } })
        .then((r) => r.data?.data ? { data: r.data.data, meta: r.data.meta } : r.data),
  });

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Tim
      </Typography>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Gagal memuat data tim. Coba refresh halaman.
        </Alert>
      )}

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari anggota tim..."
        filters={[]}
        activeChips={search ? [{ label: `Pencarian: "${search}"`, onRemove: () => setSearch('') }] : []}
        onClearAll={() => setSearch('')}
      />

      {isLoading ? (
        <Paper variant="outlined">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nama</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton width="80%" /></TableCell>
                    <TableCell><Skeleton width="60%" /></TableCell>
                    <TableCell><Skeleton width="50%" /></TableCell>
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
                <TableCell sx={{ fontWeight: 600 }}>Nama</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data?.map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell>{member.name || '-'}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <StatusPill
                      status={member.role.replace('_', ' ').toUpperCase()}
                      variant="info"
                    />
                  </TableCell>
                  <TableCell>
                    <StatusPill
                      status={member.is_active ? 'AKTIF' : 'NONAKTIF'}
                      variant={member.is_active ? 'success' : 'error'}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Belum ada anggota tim.
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
