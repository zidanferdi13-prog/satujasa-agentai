'use client';

import { useState } from 'react';
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

interface TeamMember {
  id: string;
  email: string;
  name?: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface TeamResponse {
  data: TeamMember[];
  meta: { total: number };
}

export default function UserAdminTimPage() {
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery<TeamResponse>({
    queryKey: ['admin-user-team', search],
    queryFn: () =>
      apiClient
        .get('/admin-user/team', { params: { search: search || undefined } })
        .then((r) => r.data?.data ? { data: r.data.data, meta: r.data.meta } : r.data),
  });

  const filteredData = data?.data ?? [];

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
          Tim 👥
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
          Kelola anggota tim dan role mereka.
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
          Gagal memuat data tim. Coba refresh halaman.
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
          onSearchChange={setSearch}
          searchPlaceholder="Cari anggota tim..."
          filters={[]}
          activeChips={search ? [{ label: `Pencarian: "${search}"`, onRemove: () => setSearch('') }] : []}
          onClearAll={() => setSearch('')}
        />
      </Box>

      {/* Table Card */}
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
                  <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Nama</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Status</TableCell>
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
          icon="group"
          title={search ? 'Anggota tim tidak ditemukan' : 'Belum ada anggota tim'}
          description={search ? 'Coba gunakan kata kunci lain.' : 'Anggota tim akan ditampilkan di sini.'}
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
                  <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Nama</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: 11, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((member) => (
                  <TableRow
                    key={member.id}
                    hover
                    sx={{
                      '& td': { borderBottom: '1px solid #f0f1f5', py: 2.1 },
                      '&:hover': { bgcolor: '#f8f9fc' },
                      '&:last-child td': { borderBottom: 'none' },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 42,
                            height: 42,
                            borderRadius: '12px',
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: '#eef2ff',
                            color: '#4f46e5',
                            fontWeight: 800,
                            fontSize: 16,
                          }}
                        >
                          {(member.name || member.email).slice(0, 2).toUpperCase()}
                        </Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#1d2433' }}>
                          {member.name || '-'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: '#6b7280', fontSize: 14 }}>
                        {member.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusPill
                        status={member.role.replace('_', ' ').toUpperCase()}
                        variant="info"
                      />
                    </TableCell>
                    <TableCell>
                      <StatusPill
                        status={member.is_active ? 'AKTIF' : 'NONAKTIF'}
                        variant={member.is_active ? 'success' : 'error'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}
