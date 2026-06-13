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
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import FilterBar from '@/components/shared/FilterBar';
import EmptyState from '@/components/shared/EmptyState';
import apiClient from '@/lib/axios';

interface Tenant {
  id: string;
  name: string;
  address: string;
  phone: string;
  admin_user_count: number;
  transaction_count: number;
  created_at: string;
}

interface TenantListResponse {
  data: Tenant[];
  meta: { total: number };
}

export default function TenantListPage() {
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery<TenantListResponse>({
    queryKey: ['owner-tenants'],
    queryFn: () =>
      apiClient
        .get('/owner/tenants')
        .then((r) => r.data?.data ? { data: r.data.data, meta: r.data.meta } : r.data),
  });

  const filteredTenants = useMemo(() => {
    if (!data?.data) return [];
    if (!search) return data.data;
    const q = search.toLowerCase();
    return data.data.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.address.toLowerCase().includes(q) ||
        t.phone.toLowerCase().includes(q),
    );
  }, [data, search]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Tenant Saya
        </Typography>
        <Link href="/owner/tenant/baru">
          <Button variant="contained" startIcon={<span className="material-symbols-outlined text-[20px]">add</span>}>
            Tambah Tenant
          </Button>
        </Link>
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Gagal memuat tenant. Coba refresh halaman.
        </Alert>
      )}

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari tenant..."
        filters={[]}
        activeChips={search ? [{ label: `Pencarian: "${search}"`, onRemove: () => setSearch('') }] : []}
        onClearAll={() => setSearch('')}
      />

      <Box sx={{ mt: 3 }}>
        {isLoading ? (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nama</TableCell>
                  <TableCell>Alamat</TableCell>
                  <TableCell>Telepon</TableCell>
                  <TableCell>Admin User</TableCell>
                  <TableCell>Transaksi</TableCell>
                  <TableCell>Dibuat</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <TableCell key={j}><Skeleton /></TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : filteredTenants.length === 0 ? (
          <EmptyState
            icon="store"
            title={search ? 'Tenant tidak ditemukan' : 'Belum ada tenant'}
            description={search ? 'Coba gunakan kata kunci lain.' : 'Buat tenant baru untuk memulai.'}
            action={search ? undefined : { label: 'Buat Tenant Pertama', onClick: () => window.location.href = '/owner/tenant/baru' }}
          />
        ) : (
          <TableContainer component={Paper} variant="outlined" sx={{ boxShadow: 'none', '& .MuiTableRow-root:hover': { backgroundColor: 'action.hover' } }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#535768' }}>Nama</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#535768' }}>Alamat</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#535768' }}>Telepon</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#535768' }} align="center">Admin User</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#535768' }} align="center">Transaksi</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#535768' }}>Dibuat</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTenants.map((tenant) => (
                  <TableRow
                    key={tenant.id}
                    hover
                    sx={{ cursor: 'pointer', '&:last-child td': { borderBottom: 'none' } }}
                    component={Link}
                    href={`/owner/tenant/${tenant.id}`}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>{tenant.name}</TableCell>
                    <TableCell sx={{ color: '#535768' }}>{tenant.address}</TableCell>
                    <TableCell sx={{ color: '#535768' }}>{tenant.phone}</TableCell>
                    <TableCell align="center">{tenant.admin_user_count}</TableCell>
                    <TableCell align="center">{tenant.transaction_count}</TableCell>
                    <TableCell sx={{ color: '#535768' }}>{new Date(tenant.created_at).toLocaleDateString('id-ID')}</TableCell>
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
