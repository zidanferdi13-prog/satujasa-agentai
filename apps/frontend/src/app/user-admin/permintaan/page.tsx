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
      <Box sx={{ mb: '28px' }}>
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
          Permintaan 📋
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
          Daftar permintaan yang masuk untuk approval.
        </Typography>
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
          Gagal memuat permintaan. Coba refresh halaman.
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
          searchPlaceholder="Cari permintaan..."
          filters={[
            {
              label: 'Status',
              value: statusFilter,
              options: [
                { label: 'Semua Status', value: '' },
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
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Judul</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Deskripsi</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Tanggal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[1, 2, 3].map((i) => (
                    <TableRow key={i} sx={{ borderBottom: '1px solid #f0f1f5' }}>
                      {[1, 2, 3, 4].map((j) => (
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
        ) : filteredData.length === 0 ? (
          <EmptyState
            icon="assignment"
            title={search || statusFilter ? 'Permintaan tidak ditemukan' : 'Belum ada permintaan'}
            description={search || statusFilter ? 'Coba gunakan filter yang berbeda.' : 'Permintaan akan ditampilkan di sini.'}
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
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Judul</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Deskripsi</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Tanggal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((permintaan) => (
                    <TableRow
                      key={permintaan.id}
                      hover
                      sx={{
                        '& td': { borderBottom: '1px solid #f0f1f5', py: 2.1 },
                        '&:hover': { bgcolor: '#f8f9fc' },
                        '&:last-child td': { borderBottom: 'none' },
                        cursor: 'pointer',
                      }}
                    >
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#1d2433' }}>
                          {permintaan.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: '#6b7280', fontSize: 14, lineHeight: 1.5 }}>
                          {permintaan.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusPill status={permintaan.status} variant={getStatusVariant(permintaan.status)} />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: '#8a91a3', fontSize: 14 }}>
                          {new Date(permintaan.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </Typography>
                      </TableCell>
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
