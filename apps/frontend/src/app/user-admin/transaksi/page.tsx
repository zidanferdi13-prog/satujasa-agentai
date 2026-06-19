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
import Pagination from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';
import FilterBar from '@/components/shared/FilterBar';
import StatusPill from '@/components/shared/StatusPill';
import EmptyState from '@/components/shared/EmptyState';
import apiClient from '@/lib/axios';
import type { Transaction, PaginatedResponse, TransactionStatus } from '@/types/transaction';
import { STATUS_LABELS } from '@/lib/stateMachine';

const STATUSES: TransactionStatus[] = [
  'received', 'document_check', 'needs_revision', 'payment_pending',
  'processing', 'at_samsat', 'done', 'cancelled',
];

const STATUS_OPTIONS = STATUSES.map((s) => ({
  label: STATUS_LABELS[s],
  value: s,
}));

function getStatusVariant(status: TransactionStatus): 'success' | 'warning' | 'error' | 'info' {
  if (status === 'done' || status === 'SELESAI') return 'success';
  if (status === 'cancelled' || status === 'DIBATALKAN') return 'error';
  if (status === 'needs_revision' || status === 'payment_pending' || status === 'MENUNGGU_PEMBAYARAN') return 'warning';
  if (status === 'document_check' || status === 'DOKUMEN_DITERIMA' || status === 'received') return 'info';
  if (status === 'at_samsat' || status === 'PROSES_SAMSAT' || status === 'processing') return 'info';
  return 'info';
}

export default function TransaksiListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const limit = 10;

  const { data, isLoading } = useQuery<PaginatedResponse<Transaction>>({
    queryKey: ['transactions', page, search, statusFilter],
    queryFn: () =>
      apiClient
        .get('/admin-user/transactions', {
          params: { page, limit, search: search || undefined, status: statusFilter || undefined },
        })
        .then((r) => r.data),
  });

  const totalPages = data ? Math.ceil(data.meta.total / limit) : 0;

  const activeChips = useMemo(() => {
    const chips: { label: string; onRemove: () => void }[] = [];
    if (search) {
      chips.push({ label: `Pencarian: "${search}"`, onRemove: () => { setSearch(''); setPage(1); } });
    }
    if (statusFilter) {
      chips.push({ label: `Status: ${STATUS_LABELS[statusFilter as TransactionStatus] ?? statusFilter}`, onRemove: () => { setStatusFilter(''); setPage(1); } });
    }
    return chips;
  }, [search, statusFilter]);

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
            Transaksi 📝
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
            Kelola dan pantau semua transaksi layanan STNK.
          </Typography>
        </Box>
        <Link href="/user-admin/transaksi/baru">
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
            Tambah Transaksi
          </Button>
        </Link>
      </Box>

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
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          searchPlaceholder="Cari nama pelanggan atau plat nomor..."
          filters={[
            {
              label: 'Status',
              value: statusFilter,
              options: [{ label: 'Semua Status', value: '' }, ...STATUS_OPTIONS],
              onChange: (v) => { setStatusFilter(v); setPage(1); },
            },
          ]}
          activeChips={activeChips}
          onClearAll={() => { setSearch(''); setStatusFilter(''); setPage(1); }}
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
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Plat</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Layanan</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Tanggal</TableCell>
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
        ) : !data?.data || data.data.length === 0 ? (
          <EmptyState
            icon="receipt_long"
            title={search || statusFilter ? 'Transaksi tidak ditemukan' : 'Belum ada transaksi'}
            description={search || statusFilter ? 'Coba gunakan kata kunci atau filter lain.' : 'Buat transaksi baru untuk memulai layanan.'}
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
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Plat</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Layanan</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Tanggal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.data.map((tx) => (
                    <TableRow
                      key={tx.id}
                      hover
                      sx={{
                        cursor: 'pointer',
                        '& td': { borderBottom: '1px solid #f0f1f5', py: 2.1 },
                        '&:hover': { bgcolor: '#f8f9fc' },
                        '&:last-child td': { borderBottom: 'none' },
                      }}
                      component={Link}
                      href={`/user-admin/transaksi/${tx.id}`}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ width: 42, height: 42, borderRadius: '12px', display: 'grid', placeItems: 'center', bgcolor: '#eef2ff', color: '#4f46e5', fontWeight: 800, fontSize: 16 }}>
                            {tx.customer_name.slice(0, 2).toUpperCase()}
                          </Box>
                          <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#1d2433' }}>{tx.customer_name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'inline-flex', px: 1.25, py: 0.6, borderRadius: '8px', bgcolor: '#f8f9fc', border: '1px solid #e5e9f3', color: '#1d2433', fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>
                          {tx.vehicle_plate ?? tx.plate_number ?? '-'}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#6b7280', fontSize: 14, fontWeight: 500 }}>{tx.service_name}</TableCell>
                      <TableCell>
                        <StatusPill status={STATUS_LABELS[tx.status]} variant={getStatusVariant(tx.status)} />
                      </TableCell>
                      <TableCell sx={{ color: '#8a91a3', fontSize: 14 }}>
                        {new Date(tx.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {totalPages > 1 && (
              <Box sx={{ p: 2.5, borderTop: '1px solid #f0f1f5', display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, p) => setPage(p)}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': { borderRadius: '10px', fontWeight: 700 },
                  }}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
