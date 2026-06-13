'use client';

import { useMemo, useState } from 'react';
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
import EmptyState from '@/components/shared/EmptyState';
import apiClient from '@/lib/axios';

interface PermintaanItem {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

interface PermintaanListResponse {
  data: PermintaanItem[];
  meta: { total: number };
}

function getStatusVariant(status: string): 'success' | 'warning' | 'error' | 'info' {
  if (status === 'approved' || status === 'disetujui' || status === 'selesai') return 'success';
  if (status === 'rejected' || status === 'ditolak' || status === 'dibatalkan') return 'error';
  if (status === 'pending' || status === 'menunggu') return 'warning';
  return 'info';
}

export default function UserAdminPermintaanPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading, isError } = useQuery<PermintaanListResponse>({
    queryKey: ['user-admin-permintaan'],
    queryFn: () =>
      apiClient
        .get('/admin-user/requests')
        .then((r) => r.data?.data ? { data: r.data.data, meta: r.data.meta } : { data: r.data?.data ?? [], meta: r.data?.meta ?? { total: 0 } }),
  });

  const filteredData = useMemo(() => {
    if (!data?.data) return [];
    let items = data.data;
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (statusFilter) {
      items = items.filter((p) => p.status === statusFilter);
    }
    return items;
  }, [data, search, statusFilter]);

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Disetujui', value: 'approved' },
    { label: 'Ditolak', value: 'rejected' },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Permintaan
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Daftar permintaan yang masuk.
      </Typography>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Gagal memuat permintaan. Coba refresh halaman.
        </Alert>
      )}

      <FilterBar
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); }}
        searchPlaceholder="Cari permintaan..."
        filters={[
          {
            label: 'Status',
            value: statusFilter,
            options: [
              { label: 'Semua', value: '' },
              ...statusOptions,
            ],
            onChange: (v) => { setStatusFilter(v); },
          },
        ]}
        activeChips={[
          ...(search ? [{ label: `Pencarian: "${search}"`, onRemove: () => setSearch('') }] : []),
          ...(statusFilter ? [{ label: `Status: ${statusOptions.find((o) => o.value === statusFilter)?.label ?? statusFilter}`, onRemove: () => setStatusFilter('') }] : []),
        ]}
        onClearAll={() => { setSearch(''); setStatusFilter(''); }}
      />

      <Box sx={{ mt: 3 }}>
        {isLoading ? (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Judul</TableCell>
                  <TableCell>Deskripsi</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Tanggal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    {[1, 2, 3, 4].map((j) => (
                      <TableCell key={j}><Skeleton /></TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : filteredData.length === 0 ? (
          <EmptyState
            icon="assignment"
            title={search || statusFilter ? 'Permintaan tidak ditemukan' : 'Belum ada permintaan'}
            description={search || statusFilter ? 'Coba gunakan filter yang berbeda.' : 'Permintaan akan ditampilkan di sini.'}
          />
        ) : (
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
              boxShadow: 'none',
              '& .MuiTableRow-root:hover': { backgroundColor: 'action.hover' },
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#535768' }}>Judul</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#535768' }}>Deskripsi</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#535768' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#535768' }}>Tanggal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((permintaan) => (
                  <TableRow
                    key={permintaan.id}
                    hover
                    sx={{ '&:last-child td': { borderBottom: 'none' }, cursor: 'pointer' }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>{permintaan.title}</TableCell>
                    <TableCell sx={{ color: '#535768' }}>{permintaan.description}</TableCell>
                    <TableCell>
                      <StatusPill status={permintaan.status} variant={getStatusVariant(permintaan.status)} />
                    </TableCell>
                    <TableCell sx={{ color: '#535768' }}>{new Date(permintaan.created_at).toLocaleDateString('id-ID')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}
