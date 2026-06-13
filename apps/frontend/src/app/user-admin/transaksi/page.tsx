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
import Pagination from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';
import FilterBar from '@/components/shared/FilterBar';
import StatusPill from '@/components/shared/StatusPill';
import apiClient from '@/lib/axios';
import type { Transaction, PaginatedResponse } from '@/types/transaction';
import type { TransactionStatus } from '@/types/transaction';
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
  if (status === 'document_check' || status === 'DOKUMEN_DITERIMA') return 'info';
  if (status === 'at_samsat' || status === 'PROSES_SAMSAT') return 'info';
  if (status === 'processing') return 'info';
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
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Transaksi
        </Typography>
        <Link href="/user-admin/transaksi/baru">
          <Button variant="contained" startIcon={<span className="material-symbols-outlined text-[20px]">add</span>}>
            Tambah Transaksi
          </Button>
        </Link>
      </Box>

      <FilterBar
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Cari nama/plat..."
        filters={[
          {
            label: 'Status',
            value: statusFilter,
            options: [{ label: 'Semua', value: '' }, ...STATUS_OPTIONS],
            onChange: (v) => { setStatusFilter(v); setPage(1); },
          },
        ]}
        activeChips={activeChips}
        onClearAll={() => { setSearch(''); setStatusFilter(''); setPage(1); }}
      />

      {/* Table */}
      <Box sx={{ mt: 3 }}>
        {isLoading ? (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Plat</TableCell>
                  <TableCell>Layanan</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Tanggal</TableCell>
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
        ) : (
          <>
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
                    <TableCell sx={{ fontWeight: 600, color: '#535768' }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#535768' }}>Plat</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#535768' }}>Layanan</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#535768' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#535768' }}>Tanggal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.data?.map((tx) => (
                    <TableRow
                      key={tx.id}
                      hover
                      sx={{ cursor: 'pointer', '&:last-child td': { borderBottom: 'none' } }}
                      component={Link}
                      href={`/user-admin/transaksi/${tx.id}`}
                    >
                      <TableCell>{tx.customer_name}</TableCell>
                      <TableCell>{tx.vehicle_plate ?? tx.plate_number ?? '-'}</TableCell>
                      <TableCell>{tx.service_name}</TableCell>
                      <TableCell>
                        <StatusPill status={STATUS_LABELS[tx.status]} variant={getStatusVariant(tx.status)} />
                      </TableCell>
                      <TableCell sx={{ color: '#535768' }}>{new Date(tx.created_at).toLocaleDateString('id-ID')}</TableCell>
                    </TableRow>
                  ))}
                  {(!data?.data || data.data.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                          Belum ada transaksi.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
