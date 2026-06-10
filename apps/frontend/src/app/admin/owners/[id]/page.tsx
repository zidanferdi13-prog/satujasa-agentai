'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import apiClient from '@/lib/axios';

interface OwnerDetail {
  id: string;
  email: string;
  subscription?: {
    tier: string;
    max_tenants: number;
    max_admin_users: number;
  };
  tenants?: Array<{ id: string; name: string }>;
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

  // Initialize form when owner data loads
  useEffect(() => {
    if (owner) {
      setForm({
        tier: owner.subscription?.tier ?? 'free',
        max_tenants: owner.subscription?.max_tenants ?? 0,
        max_admin_users: owner.subscription?.max_admin_users ?? 0,
      });
    }
  }, [owner]);

  const { mutate: updateSubscription, isPending } = useMutation({
    mutationFn: (payload: UpdateSubscriptionPayload) =>
      apiClient.post(`/admin/owners/${id}/subscription`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-owner', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-owners'] });
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
    return <Box className="p-8"><Typography>Loading...</Typography></Box>;
  }

  if (!owner) {
    return <Box className="p-8"><Typography>Owner tidak ditemukan.</Typography></Box>;
  }

  return (
    <Box className="p-6 md:p-8" sx={{ maxWidth: 800 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Button variant="text" onClick={() => router.back()} sx={{ minWidth: 0 }}>
          <span className="material-symbols-outlined">arrow_back</span>
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {owner.email || 'Owner tanpa email'}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Subscription Form */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Manajemen Subscription
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-4">
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
        </form>
      </Paper>

      {/* Tenants List */}
      {owner.tenants && owner.tenants.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Tenant ({owner.tenants.length})
          </Typography>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {owner.tenants.map((tenant) => (
              <Card key={tenant.id} variant="outlined">
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {tenant.name || 'Tenant tanpa nama'}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
