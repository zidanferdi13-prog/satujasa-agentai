'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import apiClient from '@/lib/axios';
import OwnersHero from '@/components/owners/OwnersHero';
import OwnersKpiGrid from '@/components/owners/OwnersKpiGrid';
import OwnersDataTable from '@/components/owners/OwnersDataTable';
import OwnersInsights from '@/components/owners/OwnersInsights';
import { OwnersListResponse, OwnersKpi } from '@/types/owner';

function OwnersPageSkeleton() {
  return (
    <Box sx={{ p: '32px 40px 48px' }}>
      <Skeleton variant="rounded" height={200} sx={{ borderRadius: '28px', mb: 3 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
        {[1,2,3,4].map(i => <Skeleton key={i} variant="rounded" height={112} sx={{ borderRadius: '22px' }} />)}
      </Box>
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Skeleton variant="rounded" height={500} sx={{ flex: 1, borderRadius: '22px' }} />
        <Skeleton variant="rounded" height={500} width={350} sx={{ borderRadius: '22px' }} />
      </Box>
    </Box>
  );
}

export default function OwnersListPage() {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');

  const { data, isLoading, isError } = useQuery<OwnersListResponse>({
    queryKey: ['admin-owners', search, tierFilter],
    queryFn: () =>
      apiClient
        .get('/admin/owners', { params: { search: search || undefined, tier: tierFilter !== 'ALL' ? tierFilter : undefined } })
        .then((r) => r.data?.data ? { data: r.data.data, meta: r.data.meta } : r.data),
  });

  if (isLoading) return <OwnersPageSkeleton />;

  const ownersData = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  
  // Mock KPI data derived from owners list or dashboard if available
  const kpiData: OwnersKpi = {
    total: total,
    active: ownersData.filter(o => (o.subscription_status ?? '').toLowerCase() === 'active').length,
    free: ownersData.filter(o => (o.subscription_tier ?? '').toUpperCase() === 'FREE').length,
    paid: ownersData.filter(o => (o.subscription_tier ?? '').toUpperCase() !== 'FREE').length,
    total_delta: '+12%',
    active_delta: '+8%',
    free_delta: '-5%',
    paid_delta: '+15%',
  };

  return (
    <Box sx={{
      p: { xs: '20px', sm: '24px 28px', lg: '32px 40px 48px' },
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 90% 0%, rgba(99, 102, 241, 0.13), transparent 35%),
        radial-gradient(circle at 0% 100%, rgba(34, 197, 94, 0.08), transparent 32%),
        #f6f8fc
      `
    }}>
      {isError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '14px' }}>
          Gagal memuat data owner. Coba refresh halaman.
        </Alert>
      )}

      {/* Hero Section */}
      <OwnersHero 
        count={total} 
        active={kpiData.active}
        tenants={ownersData.reduce((acc, o) => acc + (o.total_tenants ?? 0), 0)}
        admins={ownersData.reduce((acc, o) => acc + (o.total_admin_users ?? 0), 0)}
      />

      {/* KPI Grid */}
      <OwnersKpiGrid data={kpiData} />

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
        <OwnersDataTable 
          data={ownersData}
          onSearch={setSearch}
          onTierChange={setTierFilter}
        />
        <OwnersInsights />
      </Box>
    </Box>
  );
}
