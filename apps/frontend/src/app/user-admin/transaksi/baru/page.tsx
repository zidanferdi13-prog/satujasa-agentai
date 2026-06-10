'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import apiClient from '@/lib/axios';
import type { CreateTransactionPayload } from '@/types/transaction';

interface Service {
  id: string;
  service_id: string;
  service_name: string;
  service_code: string;
  price: string;
  is_active: boolean;
}

export default function TransaksiBaru() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    plate_number: '',
    vehicle_type: '',
    service_id: '',
    total_cost: '',
    notes: '',
  });
  const [error, setError] = useState('');

  const { data: services } = useQuery<Service[]>({
    queryKey: ['tenant-services'],
    queryFn: () => apiClient.get('/admin-user/services').then((r) => r.data?.data ?? r.data),
  });

  const { mutate: createTransaction, isPending } = useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      apiClient.post('/admin-user/transactions', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      router.push('/user-admin/transaksi');
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(message ?? 'Gagal membuat transaksi');
    },
  });

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'service_id' && services) {
      const svc = services.find((s) => s.service_id === value);
      if (svc) setForm((prev) => ({ ...prev, service_id: value, total_cost: String(parseFloat(svc.price)) }));
    }
  }

  function validate(): string | null {
    if (!form.customer_name.trim()) return 'Nama customer wajib diisi';
    if (!form.customer_phone.trim()) return 'Nomor HP wajib diisi';
    if (!form.plate_number.trim()) return 'Plat nomor wajib diisi';
    if (!form.service_id) return 'Pilih layanan';
    if (!form.total_cost || Number(form.total_cost) <= 0) return 'Total biaya harus > 0';
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    createTransaction({
      customer_name: form.customer_name.trim(),
      customer_phone: form.customer_phone.trim(),
      vehicle_plate: form.plate_number.trim().toUpperCase(),
      service_id: form.service_id,
      total_cost: Number(form.total_cost),
      notes: form.notes.trim() || undefined,
    } as unknown as CreateTransactionPayload);
  }

  return (
    <Box className="p-6 md:p-8" sx={{ maxWidth: 640 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Tambah Transaksi
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper variant="outlined" sx={{ p: 3 }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Nama Customer"
            fullWidth required
            value={form.customer_name}
            onChange={(e) => handleChange('customer_name', e.target.value)}
          />
          <TextField
            label="No. HP Customer"
            fullWidth required
            value={form.customer_phone}
            onChange={(e) => handleChange('customer_phone', e.target.value)}
          />
          <TextField
            label="Plat Nomor"
            fullWidth required
            placeholder="B 1234 ABC"
            value={form.plate_number}
            onChange={(e) => handleChange('plate_number', e.target.value)}
          />
          <TextField
            label="Jenis Kendaraan"
            fullWidth
            placeholder="Motor / Mobil"
            value={form.vehicle_type}
            onChange={(e) => handleChange('vehicle_type', e.target.value)}
          />

          <FormControl fullWidth required>
            <InputLabel>Layanan</InputLabel>
            <Select
              value={form.service_id}
              label="Layanan"
              onChange={(e) => handleChange('service_id', e.target.value)}
            >
              {services?.map((svc) => (
                <MenuItem key={svc.service_id} value={svc.service_id}>
                  {svc.service_name} — Rp{parseFloat(svc.price).toLocaleString('id-ID')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Total Biaya"
            fullWidth required
            type="number"
            value={form.total_cost}
            onChange={(e) => handleChange('total_cost', e.target.value)}
            slotProps={{ htmlInput: { min: 0 } }}
          />
          <TextField
            label="Catatan (opsional)"
            fullWidth multiline rows={3}
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
          />

          <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
            <Button variant="outlined" onClick={() => router.back()} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" variant="contained" disabled={isPending}>
              {isPending ? 'Menyimpan...' : 'Simpan Transaksi'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
