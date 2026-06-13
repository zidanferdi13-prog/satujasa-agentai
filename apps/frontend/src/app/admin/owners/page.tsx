'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
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

interface Owner {
  id: string;
  email: string;
  subscription_tier: string;
  total_tenants: number;
  total_admin_users: number;
  created_at: string;
}

interface OwnersListResponse {
  data: Owner[];
  meta: { total: number };
}

export default function OwnersListPage() {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('');

  const { data, isLoading, isError } = useQuery<OwnersListResponse>({
    queryKey: ['admin-owners', search, tierFilter],
    queryFn: () =>
      apiClient
        .get('/admin/owners', { params: { search: search || undefined } })
        .then((r) => r.data?.data ? { data: r.data.data, meta: r.data.meta } : r.data),
  });

  const getTierVariant = (tier: string): 'success' | 'warning' | 'info' | 'error' => {
    const variants: Record<string, 'success' | 'warning' | 'info' | 'error'> = {
      'free': 'info',
      'pro': 'info',
      'plus': 'warning',
      'expert': 'success',
    };
    const tierKey = (tier ?? 'FREE').toLowerCase();
    return variants[tierKey] || 'info';
  };

  return (
    <Box sx={{ p: { xs: 3, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Manage Owner
      </Typography>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Gagal memuat data owner. Coba refresh halaman.
        </Alert>
      )}

      <FilterBar
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); }}
        searchPlaceholder="Cari email owner..."
        filters={[
          {
            label: 'Tier',
            value: tierFilter,
            options: [
              { label: 'Semua', value: '' },
              { label: 'Free', value: 'free' },
              { label: 'Pro', value: 'pro' },
              { label: 'Plus', value: 'plus' },
              { label: 'Expert', value: 'expert' },
            ],
            onChange: (v) => { setTierFilter(v); },
          },
        ]}
        activeChips={[
          ...(search ? [{ label: `Pencarian: "${search}"`, onRemove: () => setSearch('') }] : []),
          ...(tierFilter ? [{ label: `Tier: ${tierFilter.charAt(0).toUpperCase() + tierFilter.slice(1)}`, onRemove: () => setTierFilter('') }] : []),
        ]}
        onClearAll={() => { setSearch(''); setTierFilter(''); }}
      />

      {isLoading ? (
        <Paper variant="outlined">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Tier</TableCell>
                  <TableCell align="right">Tenant</TableCell>
                  <TableCell align="right">Admin User</TableCell>
                  <TableCell>Dibuat</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton width="60%" /></TableCell>
                    <TableCell><Skeleton width="40%" /></TableCell>
                    <TableCell><Skeleton width="40%" /></TableCell>
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
                <TableCell sx={{ fontWeight: 600 }}>Subscription Tier</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Tenant</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Admin User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Dibuat</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data?.map((owner) => (
                <TableRow
                  key={owner.id}
                  hover
                  component={Link}
                  href={`/admin/owners/${owner.id}`}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{owner.email}</TableCell>
                  <TableCell>
                    <StatusPill
                      status={(owner.subscription_tier ?? 'FREE').toUpperCase()}
                      variant={getTierVariant(owner.subscription_tier)}
                    />
                  </TableCell>
                  <TableCell align="right">{owner.total_tenants}</TableCell>
                  <TableCell align="right">{owner.total_admin_users}</TableCell>
                  <TableCell>{new Date(owner.created_at).toLocaleDateString('id-ID')}</TableCell>
                </TableRow>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Tidak ada owner ditemukan.
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
