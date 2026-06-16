'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import MetricCard from '@/components/shared/MetricCard';
import StatusPill from '@/components/shared/StatusPill';
import apiClient from '@/lib/axios';

interface OwnerDetail {
  id: string;
  email: string;
  phone: string;
  company_name: string | null;
  role: string;
  subscription_tier: string | null;
  total_tenants: number;
  total_admin_users: number;
  subscription_status: string | null;
  mrr: string;
  created_at: string;
}

interface Subscription {
  id: string;
  tier: string;
  max_tenants: number;
  max_admin_users: number;
  activated_at: string | null;
}

interface UpdateSubscriptionPayload {
  owner_id: string;
  tier: string;
  max_tenants: number;
  max_admin_users: number;
}

const TIERS = [
  { value: 'free', label: 'Free', default_tenants: 1, default_admin_users: 1 },
  { value: 'pro', label: 'Pro', default_tenants: 5, default_admin_users: 10 },
  { value: 'plus', label: 'Plus', default_tenants: 20, default_admin_users: 50 },
  { value: 'expert', label: 'Expert', default_tenants: 100, default_admin_users: 500 },
];

export default function OwnerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({ tier: '', max_tenants: 0, max_admin_users: 0 });
  const [error, setError] = useState('');

  const { data: owner, isLoading } = useQuery<OwnerDetail>({
    queryKey: ['admin-owner', id],
    queryFn: () =>
      apiClient.get(`/admin/owners/${id}`).then((r) => r.data?.data ?? r.data),
  });

  // Fetch separate subscription data for max_tenants/max_admin_users
  const { data: subscription } = useQuery<Subscription>({
    queryKey: ['admin-owner-subscription', id],
    queryFn: () =>
      apiClient.get(`/admin/owners/${id}/subscription`).then((r) => r.data),
    enabled: !!id,
    retry: false,
  });

  // Initialize form when subscription data loads
  useEffect(() => {
    if (subscription) {
      setForm({
        tier: subscription.tier ?? 'free',
        max_tenants: subscription.max_tenants ?? 0,
        max_admin_users: subscription.max_admin_users ?? 0,
      });
    } else if (owner) {
      // Fallback: use defaults based on tier
      const tierConfig = TIERS.find((t) => t.value === (owner.subscription_tier ?? 'free'));
      setForm({
        tier: owner.subscription_tier ?? 'free',
        max_tenants: tierConfig?.default_tenants ?? 1,
        max_admin_users: tierConfig?.default_admin_users ?? 1,
      });
    }
  }, [subscription, owner]);

  const { mutate: updateSubscription, isPending } = useMutation({
    mutationFn: (payload: UpdateSubscriptionPayload) =>
      apiClient.post(`/admin/owners/${id}/subscription`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-owner', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-owners'] });
      queryClient.invalidateQueries({ queryKey: ['admin-owner-subscription', id] });
      setError('');
      alert('Subscription berhasil diupdate');
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(message ?? 'Gagal update subscription');
    },
  });

  function handleTierChange(newTier: string) {
    const tierConfig = TIERS.find((t) => t.value === newTier);
    setForm({
      tier: newTier,
      max_tenants: tierConfig?.default_tenants ?? 1,
      max_admin_users: tierConfig?.default_admin_users ?? 1,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.tier) {
      setError('Pilih subscription tier');
      return;
    }
    updateSubscription({
      owner_id: id,
      tier: form.tier,
      max_tenants: form.max_tenants,
      max_admin_users: form.max_admin_users,
    });
  }

  if (isLoading) {
    return <Box sx={{ p: { xs: 3, md: 4 } }}><Typography sx={{ textAlign: 'center', py: 4 }}>Loading...</Typography></Box>;
  }

  if (!owner) {
    return <Box sx={{ p: { xs: 3, md: 4 } }}><Typography sx={{ textAlign: 'center', py: 4 }}>Owner tidak ditemukan.</Typography></Box>;
  }

  const tierStatusVariant: Record<string, 'success' | 'warning' | 'info' | 'error'> = {
    free: 'info', pro: 'success', plus: 'warning', expert: 'success',
  };

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 800 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Button variant="text" onClick={() => router.back()} sx={{ minWidth: 0 }}>
          <span className="material-symbols-outlined">arrow_back</span>
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, flex: 1 }}>
          {owner.email || 'Owner tanpa email'}
        </Typography>
        <StatusPill
          status={(owner.subscription_tier ?? 'FREE').toUpperCase()}
          variant={tierStatusVariant[owner.subscription_tier ?? 'free'] ?? 'info'}
        />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* MetricCards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, mb: 4 }}>
        <MetricCard label="Tenant Terpakai" value={owner.total_tenants ?? 0} />
        <MetricCard label="Max Tenant" value={subscription?.max_tenants ?? '-'} />
        <MetricCard label="Max Admin User" value={subscription?.max_admin_users ?? '-'} />
      </Box>

      {/* Subscription Form */}
      <Card variant="outlined" sx={{ mb: 4, borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Manajemen Subscription
          </Typography>

          <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth required>
            <InputLabel>Subscription Tier</InputLabel>
            <Select
              value={form.tier}
              label="Subscription Tier"
              onChange={(e) => handleTierChange(e.target.value)}
            >
              {TIERS.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Max Tenant"
            type="number"
            fullWidth
            value={form.max_tenants}
            onChange={(e) => setForm({ ...form, max_tenants: parseInt(e.target.value) || 0 })}
            slotProps={{ htmlInput: { min: 1 } }}
          />

          <TextField
            label="Max Admin User"
            type="number"
            fullWidth
            value={form.max_admin_users}
            onChange={(e) => setForm({ ...form, max_admin_users: parseInt(e.target.value) || 0 })}
            slotProps={{ htmlInput: { min: 1 } }}
          />

          <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
            <Button variant="outlined" onClick={() => router.back()} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" variant="contained" disabled={isPending}>
              {isPending ? 'Menyimpan...' : 'Simpan Subscription'}
            </Button>
          </Box>
          </Box>
        </form>
      </CardContent>
      </Card>
    </Box>
  );
}
