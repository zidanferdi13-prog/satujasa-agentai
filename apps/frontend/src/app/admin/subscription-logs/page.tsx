'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Pagination from '@mui/material/Pagination';
import FilterBar from '@/components/shared/FilterBar';
import apiClient from '@/lib/axios';
import { SubscriptionLogsResponse } from '@/types/subscription';

export default function SubscriptionLogsPage() {
  const [page, setPage] = useState(1);
  const [tier, setTier] = useState('');
  const limit = 20;

  const { data, isLoading } = useQuery<SubscriptionLogsResponse>({
    queryKey: ['admin-subscription-logs', page, tier],
    queryFn: () =>
      apiClient.get('/admin/subscription-logs', { params: { page, limit, tier } }).then((r) => r.data),
  });

  const summary = data?.summary;
  const logs = data?.logs ?? [];
  const totalPages = data?.pagination.total_pages ?? 0;

  return (
    <Box sx={{ p: { xs: 3, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>Revenue & Subscription Logs</Typography>

      {/* Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" sx={{ color: '#6b7084' }}>Total Revenue</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Rp {(summary?.total_revenue ?? 0).toLocaleString('id-ID')}</Typography>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" sx={{ color: '#6b7084' }}>Total Subscription</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{summary?.total_subscriptions ?? 0}</Typography>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" sx={{ color: '#6b7084' }}>Active Subscription</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{summary?.active_subscriptions ?? 0}</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        <FilterBar
          searchValue=""
          onSearchChange={() => {}}
          filters={[
            {
              label: 'Tier',
              value: tier,
              onChange: (v) => { setTier(v); setPage(1); },
              options: [
                { label: 'All Tiers', value: '' },
                { label: 'Free', value: 'free' },
                { label: 'Pro', value: 'pro' },
                { label: 'Plus', value: 'plus' },
                { label: 'Expert', value: 'expert' },
              ]
            }
          ]}
          activeChips={[]}
          onClearAll={() => { setTier(''); setPage(1); }}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Card} variant="outlined">
        <Table>
          <TableHead sx={{ bgcolor: '#f8f9fc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Owner</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tier</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Expires At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} align="center">Loading...</TableCell></TableRow>
            ) : logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.owner_email}</TableCell>
                <TableCell>{log.tier.toUpperCase()}</TableCell>
                <TableCell>{log.duration_months} Mo</TableCell>
                <TableCell>Rp {log.total_price.toLocaleString('id-ID')}</TableCell>
                <TableCell>{log.expires_at ? new Date(log.expires_at).toLocaleDateString('id-ID') : '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} />
        </Box>
      )}
    </Box>
  );
}
