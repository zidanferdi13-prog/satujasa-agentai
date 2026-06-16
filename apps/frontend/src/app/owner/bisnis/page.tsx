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
          Bisnis 🏪
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
          Kelola data bisnis dan pantau performa tenant.
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
          Gagal memuat data bisnis. Coba refresh halaman.
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
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Nama Bisnis</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, textAlign: 'center' }}>Tenant</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, textAlign: 'center' }}>Transaksi</TableCell>
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
        ) : filteredData.length === 0 ? (
          <EmptyState
            icon="storefront"
            title={search || statusFilter ? 'Bisnis tidak ditemukan' : 'Belum ada data bisnis'}
            description={search || statusFilter ? 'Coba gunakan filter yang berbeda.' : 'Data bisnis akan ditampilkan di sini.'}
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
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Nama Bisnis</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, textAlign: 'center' }}>Tenant</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, textAlign: 'center' }}>Transaksi</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Dibuat</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((bisnis) => (
                    <TableRow
                      key={bisnis.id}
                      hover
                      sx={{
                        transition: 'all 0.15s',
                        '&:hover': { bgcolor: '#f8f9fc' },
                        '& td': { borderBottom: '1px solid #f0f1f5', py: 2.1 },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ width: 42, height: 42, borderRadius: '12px', display: 'grid', placeItems: 'center', bgcolor: '#f5f3ff', color: '#8b5cf6', fontWeight: 800, fontSize: 16 }}>
                            {(bisnis.name || 'BI').slice(0, 2).toUpperCase()}
                          </Box>
                          <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#1d2433' }}>{bisnis.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <StatusPill status={bisnis.status} variant={getStatusVariant(bisnis.status)} />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.25, py: 0.6, borderRadius: '10px', bgcolor: '#f5f3ff', color: '#8b5cf6', fontSize: 12, fontWeight: 800 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>domain</span>
                          {bisnis.tenant_count}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.25, py: 0.6, borderRadius: '10px', bgcolor: '#ecfdf3', color: '#22c55e', fontSize: 12, fontWeight: 800 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>receipt</span>
                          {bisnis.transaction_count}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#8a91a3', fontSize: 14 }}>{new Date(bisnis.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</TableCell>
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
