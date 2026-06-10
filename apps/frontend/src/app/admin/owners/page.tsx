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
import Chip from '@mui/material/Chip';
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

  const { data, isLoading, isError } = useQuery<OwnersListResponse>({
    queryKey: ['admin-owners', search],
    queryFn: () =>
      apiClient
        .get('/admin/owners', { params: { search: search || undefined } })
        .then((r) => r.data?.data ? { data: r.data.data, meta: r.data.meta } : r.data),
  });

  const getTierColor = (tier: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      'free': 'default',
      'pro': 'info',
      'plus': 'warning',
      'expert': 'success',
    };
    const tierKey = (tier ?? 'FREE').toLowerCase();
    return colors[tierKey] || 'default';
  };

  return (
    <Box className="p-6 md:p-8">
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Manage Owner
      </Typography>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Gagal memuat data owner. Coba refresh halaman.
        </Alert>
      )}

      <TextField
        size="small"
        placeholder="Cari email owner..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, minWidth: 300 }}
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
                    <Chip
                      label={(owner.subscription_tier ?? 'FREE').toUpperCase()}
                      color={getTierColor(owner.subscription_tier)}
                      size="small"
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
