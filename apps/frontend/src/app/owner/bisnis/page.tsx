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

interface BisnisItem {
  id: string;
  name: string;
  status: string;
  tenant_count: number;
  transaction_count: number;
  created_at: string;
}

interface BisnisListResponse {
  data: BisnisItem[];
  meta: { total: number };
}

function getStatusVariant(status: string): 'success' | 'warning' | 'error' | 'info' {
  if (status === 'active' || status === 'aktif') return 'success';
  if (status === 'inactive' || status === 'nonaktif') return 'error';
  if (status === 'pending') return 'warning';
  return 'info';
}

export default function OwnerBisnisPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading, isError } = useQuery<BisnisListResponse>({
    queryKey: ['owner-bisnis'],
    queryFn: () =>
      apiClient
        .get('/owner/bisnis')
        .then((r) => r.data?.data ? { data: r.data.data, meta: r.data.meta } : { data: r.data?.data ?? [], meta: r.data?.meta ?? { total: 0 } }),
  });

  const filteredData = useMemo(() => {
    if (!data?.data) return [];
    let items = data.data;
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((b) => b.name.toLowerCase().includes(q));
    }
    if (statusFilter) {
      items = items.filter((b) => b.status === statusFilter);
    }
    return items;
  }, [data, search, statusFilter]);

  const statusOptions = [
    { label: 'Aktif', value: 'active' },
    { label: 'Nonaktif', value: 'inactive' },
    { label: 'Pending', value: 'pending' },
  ];

  return (
    <Box sx={{ p: { xs: 3, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Bisnis
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Kelola data bisnis Anda.
      </Typography>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Gagal memuat data bisnis. Coba refresh halaman.
        </Alert>
      )}

      <FilterBar
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); }}
        searchPlaceholder="Cari bisnis..."
        filters={[
          {
            label: 'Status',
            value: statusFilter,
            options: statusOptions,
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
                  <TableCell>Nama Bisnis</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Tenant</TableCell>
                  <TableCell>Transaksi</TableCell>
                  <TableCell>Dibuat</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    {[1, 2, 3, 4, 5].map((j) => (
                      <TableCell key={j}><Skeleton /></TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : filteredData.length === 0 ? (
          <EmptyState
            icon="storefront"
            title={search || statusFilter ? 'Bisnis tidak ditemukan' : 'Belum ada data bisnis'}
            description={search || statusFilter ? 'Coba gunakan filter yang berbeda.' : 'Data bisnis akan ditampilkan di sini.'}
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
                  <TableCell sx={{ fontWeight: 600, color: '#535768' }}>Nama Bisnis</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#535768' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#535768' }} align="center">Tenant</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#535768' }} align="center">Transaksi</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#535768' }}>Dibuat</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((bisnis) => (
                  <TableRow
                    key={bisnis.id}
                    hover
                    sx={{ '&:last-child td': { borderBottom: 'none' }, cursor: 'pointer' }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>{bisnis.name}</TableCell>
                    <TableCell>
                      <StatusPill status={bisnis.status} variant={getStatusVariant(bisnis.status)} />
                    </TableCell>
                    <TableCell align="center">{bisnis.tenant_count}</TableCell>
                    <TableCell align="center">{bisnis.transaction_count}</TableCell>
                    <TableCell sx={{ color: '#535768' }}>{new Date(bisnis.created_at).toLocaleDateString('id-ID')}</TableCell>
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
