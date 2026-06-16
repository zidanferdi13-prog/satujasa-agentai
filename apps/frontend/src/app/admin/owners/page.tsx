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
import Card from '@mui/material/Card';
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
          Manage Owners 👥
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
          Kelola data owner dan subscription tier platform STNK SatuJasa.
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
          Gagal memuat data owner. Coba refresh halaman.
        </Alert>
      )}

      {/* Filter Bar */}
      <Card
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
      </Card>

      {/* Table Card */}
      <Card
        sx={{
          borderRadius: '22px',
          border: '1px solid #e5e9f3',
          boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
          background: 'rgba(255,255,255,0.94)',
          overflow: 'hidden',
        }}
      >
        {isLoading ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8f9fc', borderBottom: '2px solid #e5e9f3' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: 13, color: 'var(--dash-text)', textTransform: 'uppercase', letterSpacing: '0.06em', py: 2 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 13, color: 'var(--dash-text)', textTransform: 'uppercase', letterSpacing: '0.06em', py: 2 }}>Subscription Tier</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 13, color: 'var(--dash-text)', textTransform: 'uppercase', letterSpacing: '0.06em', py: 2, textAlign: 'right' }}>Tenant</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 13, color: 'var(--dash-text)', textTransform: 'uppercase', letterSpacing: '0.06em', py: 2, textAlign: 'right' }}>Admin User</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 13, color: 'var(--dash-text)', textTransform: 'uppercase', letterSpacing: '0.06em', py: 2 }}>Dibuat</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3].map((i) => (
                  <TableRow key={i} sx={{ borderBottom: '1px solid #f0f1f5' }}>
                    <TableCell sx={{ py: 2.5 }}><Skeleton variant="rounded" height={20} sx={{ borderRadius: '8px' }} /></TableCell>
                    <TableCell sx={{ py: 2.5 }}><Skeleton variant="rounded" width="60%" height={28} sx={{ borderRadius: '10px' }} /></TableCell>
                    <TableCell sx={{ py: 2.5 }}><Skeleton variant="rounded" width="40%" height={20} sx={{ borderRadius: '8px', ml: 'auto' }} /></TableCell>
                    <TableCell sx={{ py: 2.5 }}><Skeleton variant="rounded" width="40%" height={20} sx={{ borderRadius: '8px', ml: 'auto' }} /></TableCell>
                    <TableCell sx={{ py: 2.5 }}><Skeleton variant="rounded" width="80%" height={20} sx={{ borderRadius: '8px' }} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8f9fc', borderBottom: '2px solid #e5e9f3' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: 13, color: 'var(--dash-text)', textTransform: 'uppercase', letterSpacing: '0.06em', py: 2 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 13, color: 'var(--dash-text)', textTransform: 'uppercase', letterSpacing: '0.06em', py: 2 }}>Subscription Tier</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 13, color: 'var(--dash-text)', textTransform: 'uppercase', letterSpacing: '0.06em', py: 2, textAlign: 'right' }}>Tenant</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 13, color: 'var(--dash-text)', textTransform: 'uppercase', letterSpacing: '0.06em', py: 2, textAlign: 'right' }}>Admin User</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 13, color: 'var(--dash-text)', textTransform: 'uppercase', letterSpacing: '0.06em', py: 2 }}>Dibuat</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data?.map((owner) => (
                  <TableRow
                    key={owner.id}
                    hover
                    component={Link}
                    href={`/admin/owners/${owner.id}`}
                    sx={{
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f1f5',
                      transition: 'all 0.15s',
                      '&:hover': {
                        bgcolor: '#f8f9fc',
                      },
                      '&:last-child': {
                        borderBottom: 'none',
                      },
                    }}
                  >
                    <TableCell sx={{ py: 2.5, fontSize: 14, fontWeight: 600, color: 'var(--dash-text)' }}>{owner.email}</TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <StatusPill
                        status={(owner.subscription_tier ?? 'FREE').toUpperCase()}
                        variant={getTierVariant(owner.subscription_tier)}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2.5, fontSize: 14, fontWeight: 600, color: 'var(--dash-text)', textAlign: 'right' }}>{owner.total_tenants}</TableCell>
                    <TableCell sx={{ py: 2.5, fontSize: 14, fontWeight: 600, color: 'var(--dash-text)', textAlign: 'right' }}>{owner.total_admin_users}</TableCell>
                    <TableCell sx={{ py: 2.5, fontSize: 14, color: '#8a91a3' }}>{new Date(owner.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</TableCell>
                  </TableRow>
                ))}
                {(!data?.data || data.data.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            bgcolor: '#f0f1f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#8a91a3' }}>
                            person_off
                          </span>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography sx={{ fontSize: 16, fontWeight: 700, color: 'var(--dash-text)', mb: 0.5 }}>
                            Tidak ada owner
                          </Typography>
                          <Typography sx={{ fontSize: 14, color: '#8a91a3' }}>
                            Belum ada owner yang terdaftar atau sesuai filter.
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Box>
  );
}
