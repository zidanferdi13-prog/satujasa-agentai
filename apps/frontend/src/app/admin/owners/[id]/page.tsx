'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { useToast } from '@/components/shared/ToastProvider';
import { TIER_DEFAULTS, subscriptionTiers, type SubscriptionTier } from '@stnk/contracts';
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
  expires_at: string | null;
}

interface UpdateSubscriptionPayload {
  owner_id: string;
  tier: string;
  max_tenants: number;
  max_admin_users: number;
  expires_at: string | null;
  duration_months?: number;
}

const TIER_LABELS: Record<SubscriptionTier, string> = {
  free: 'Free',
  pro: 'Pro',
  plus: 'Plus',
  expert: 'Expert',
};

const PRICE_MAP: Record<string, number> = {
  free: 0,
  pro: 49.999,
  plus: 99.999,
  expert: 0,
};

const DURATION_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

function isActive(expiresAt: string | null): boolean {
  if (!expiresAt) return true; // permanent
  return new Date(expiresAt) > new Date();
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function OwnerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();

  const [form, setForm] = useState({
    tier: '',
    max_tenants: 0,
    max_admin_users: 0,
    duration_months: 1,
  });
  const [error, setError] = useState('');

  const { data: owner, isLoading } = useQuery<OwnerDetail>({
    queryKey: ['admin-owner', id],
    queryFn: () =>
      apiClient.get(`/admin/owners/${id}`).then((r) => r.data?.data ?? r.data),
  });

  const { data: subscription } = useQuery<Subscription>({
    queryKey: ['admin-owner-subscription', id],
    queryFn: () =>
      apiClient.get(`/admin/owners/${id}/subscription`).then((r) => r.data),
    enabled: !!id,
    retry: false,
  });

  useEffect(() => {
    if (subscription) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate form state from API subscription data
      setForm({
        tier: subscription.tier ?? 'free',
        max_tenants: subscription.max_tenants ?? 0,
        max_admin_users: subscription.max_admin_users ?? 0,
        duration_months: 1,
      });
    } else if (owner) {
      const tierConfig = TIER_DEFAULTS[owner.subscription_tier as SubscriptionTier ?? 'free'];
      setForm({
        tier: owner.subscription_tier ?? 'free',
        max_tenants: tierConfig?.max_tenants ?? 0,
        max_admin_users: tierConfig?.max_admin_users ?? 0,
        duration_months: 1,
      });
    }
  }, [subscription, owner]);

  const pricePerMonth = PRICE_MAP[form.tier] ?? 0;
  const totalPrice = useMemo(
    () => pricePerMonth * form.duration_months,
    [pricePerMonth, form.duration_months],
  );

  const estimatedExpiresAt = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + form.duration_months);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [form.duration_months]);

  const { mutate: updateSubscription, isPending } = useMutation({
    mutationFn: (payload: UpdateSubscriptionPayload) =>
      apiClient.post(`/admin/owners/${id}/subscription`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-owner', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-owners'] });
      queryClient.invalidateQueries({ queryKey: ['admin-owner-subscription', id] });
      setError('');
      toast.showSuccess('Subscription berhasil diupdate');
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(message ?? 'Gagal update subscription');
    },
  });

  function handleTierChange(newTier: string) {
    const tierConfig = TIER_DEFAULTS[newTier as SubscriptionTier];
    setForm({
      ...form,
      tier: newTier,
      max_tenants: tierConfig?.max_tenants ?? 0,
      max_admin_users: tierConfig?.max_admin_users ?? 0,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.tier) {
      setError('Pilih subscription tier');
      return;
    }
    
    // Calculate expires_at from duration_months
    const expiresDate = new Date();
    expiresDate.setMonth(expiresDate.getMonth() + form.duration_months);
    const expiresAtIso = expiresDate.toISOString();

    updateSubscription({
      owner_id: id,
      tier: form.tier,
      max_tenants: form.max_tenants,
      max_admin_users: form.max_admin_users,
      expires_at: expiresAtIso,
      duration_months: form.duration_months,
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

  const active = isActive(subscription?.expires_at ?? null);

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1000 }}>
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

      {/* Subscription Status Card */}
      {subscription && (
        <Card variant="outlined" sx={{ mb: 4, borderRadius: 2, bgcolor: '#f8fafc' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Status Subscription
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, auto)' },
                gap: 2,
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography sx={{ fontSize: 12, color: '#6b7084', fontWeight: 600, mb: 0.25 }}>Tier</Typography>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#1d2433' }}>
                  {(subscription.tier ?? '').toUpperCase()}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: '#6b7084', fontWeight: 600, mb: 0.25 }}>Aktif Sejak</Typography>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1d2433' }}>
                  {formatDate(subscription.activated_at)}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: '#6b7084', fontWeight: 600, mb: 0.25 }}>Berlaku Hingga</Typography>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1d2433' }}>
                  {formatDate(subscription.expires_at)}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: '#6b7084', fontWeight: 600, mb: 0.25 }}>Status</Typography>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.75,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '50px',
                    bgcolor: active ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                    color: active ? '#16a34a' : '#dc2626',
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: active ? '#16a34a' : '#dc2626' }} />
                  {active ? 'Active' : 'Expired'}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Subscription Form */}
      <Card variant="outlined" sx={{ mb: 4, borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
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
              {subscriptionTiers.map((t) => (
                <MenuItem key={t} value={t}>
                  {TIER_LABELS[t]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Duration dropdown 1-12 bulan */}
          <FormControl fullWidth required>
            <InputLabel>Durasi Berlangganan</InputLabel>
            <Select
              value={form.duration_months}
              label="Durasi Berlangganan"
              onChange={(e) =>
                setForm({ ...form, duration_months: e.target.value as number })
              }
            >
              {DURATION_OPTIONS.map((m) => (
                <MenuItem key={m} value={m}>
                  {m} Bulan
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Auto-calc: Total Price */}
          <TextField
            label="Total Price"
            fullWidth
            value={`Rp ${totalPrice.toLocaleString('id-ID')}`}
            slotProps={{ input: { readOnly: true } }}
            helperText={
              form.tier === 'expert' || form.tier === 'free'
                ? `${form.tier === 'expert' ? 'Harga Expert: custom' : 'Free: gratis'}`
                : `Rp ${PRICE_MAP[form.tier]?.toLocaleString('id-ID')} /bulan × ${form.duration_months} bulan`
            }
          />

          {/* Auto-calc: Expires At (read-only) */}
          <TextField
            label="Valid Until"
            fullWidth
            value={estimatedExpiresAt}
            slotProps={{ input: { readOnly: true } }}
            helperText={`Dihitung otomatis: sekarang + ${form.duration_months} bulan`}
          />

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
