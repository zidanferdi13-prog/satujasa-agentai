'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import apiClient from '@/lib/axios';
import type { Transaction, PaginatedResponse } from '@/types/transaction';
import type { TransactionStatus } from '@/types/transaction';
import StatusBadge from '@/components/transactions/StatusBadge';
import { STATUS_LABELS } from '@/lib/stateMachine';

const STATUSES: TransactionStatus[] = [
  'received', 'document_check', 'needs_revision', 'payment_pending',
  'processing', 'at_samsat', 'done', 'cancelled',
];

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

  return (
    <Box className="p-6 md:p-8">
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

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Cari nama/plat..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <MenuItem value="">Semua</MenuItem>
            {STATUSES.map((s) => (
              <MenuItem key={s} value={s}>{STATUS_LABELS[s]}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
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
                {data?.data?.map((tx) => (
                  <TableRow key={tx.id} hover sx={{ cursor: 'pointer' }} component={Link} href={`/user-admin/transaksi/${tx.id}`}>
                    <TableCell>{tx.customer_name}</TableCell>
                    <TableCell>{tx.vehicle_plate ?? tx.plate_number ?? '-'}</TableCell>
                    <TableCell>{tx.service_name}</TableCell>
                    <TableCell><StatusBadge status={tx.status} /></TableCell>
                    <TableCell>{new Date(tx.created_at).toLocaleDateString('id-ID')}</TableCell>
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
  );
}
