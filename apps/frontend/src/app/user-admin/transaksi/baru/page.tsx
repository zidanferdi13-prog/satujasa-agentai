'use client';

import { useEffect, useMemo, useState } from 'react';
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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import apiClient from '@/lib/axios';
import type { CreateTransactionPayload, DocRequirement, FeeRequirement } from '@/types/transaction';

interface Service {
  id: string;
  service_id: string;
  service_name: string;
  service_code: string;
  price: string;
  is_active: boolean;
}

interface RequirementsResponse {
  fees: FeeRequirement[];
  documents: DocRequirement[];
}

const VEHICLE_TYPES = [
  { code: 'MOTOR', name: 'Motor' },
  { code: 'MOBIL', name: 'Mobil' },
  { code: 'PICKUP', name: 'Pickup' },
  { code: 'TRUK', name: 'Truk' },
  { code: 'BUS', name: 'Bus' },
  { code: 'LAINNYA', name: 'Lainnya' },
];

const JAVA_LOCATIONS = [
  { provinceCode: 'JABAR', provinceName: 'Jawa Barat', cityCode: 'BDG', cityName: 'Bandung' },
  { provinceCode: 'JKT', provinceName: 'DKI Jakarta', cityCode: 'JKT', cityName: 'Jakarta' },
  { provinceCode: 'JATENG', provinceName: 'Jawa Tengah', cityCode: 'SMG', cityName: 'Semarang' },
  { provinceCode: 'JATIM', provinceName: 'Jawa Timur', cityCode: 'SBY', cityName: 'Surabaya' },
  { provinceCode: 'BANTEN', provinceName: 'Banten', cityCode: 'TGR', cityName: 'Tangerang' },
  { provinceCode: 'DIY', provinceName: 'DI Yogyakarta', cityCode: 'YK', cityName: 'Yogyakarta' },
];

function formatCurrency(value: number | string | null | undefined) {
  return Number(value ?? 0).toLocaleString('id-ID');
}

function normalizeFeeAmount(value: string | number | null | undefined) {
  const amount = Number(value ?? 0);
  return amount === 0 ? '' : String(value);
}

export default function TransaksiBaru() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    plate_number: '',
    vehicle_type_code: 'MOTOR',
    service_id: '',
    province_city: 'JABAR|BDG|Bandung',
    tax_due_date: '',
    notes: '',
  });
  const [feeRows, setFeeRows] = useState<FeeRequirement[]>([]);
  const [error, setError] = useState('');

  const selectedLocation = useMemo(() => {
    const [provinceCode, cityCode, cityName] = form.province_city.split('|');
    return { provinceCode, cityCode, cityName };
  }, [form.province_city]);

  const totalPreview = useMemo(
    () => feeRows.reduce((sum, row) => sum + Number(row.amount || 0), 0),
    [feeRows],
  );

  const requirementsReady = Boolean(form.service_id && form.vehicle_type_code && selectedLocation.provinceCode);

  const { data: services } = useQuery<Service[]>({
    queryKey: ['tenant-services'],
    queryFn: () => apiClient.get('/admin-user/services').then((r) => r.data?.data ?? r.data),
  });

  const { data: requirements, isFetching: isLoadingRequirements } = useQuery<RequirementsResponse>({
    queryKey: ['transaction-requirements', form.service_id, form.vehicle_type_code, selectedLocation.provinceCode, selectedLocation.cityCode],
    enabled: requirementsReady,
    queryFn: () =>
      apiClient
        .get('/admin-user/transactions/requirements', {
          params: {
            service_id: form.service_id,
            vehicle_type_code: form.vehicle_type_code,
            province_code: selectedLocation.provinceCode,
            city_code: selectedLocation.cityCode || undefined,
          },
        })
        .then((r) => r.data?.data ?? r.data),
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

  useEffect(() => {
    if (requirements?.fees) {
      setFeeRows(
        requirements.fees.map((fee) => ({
          ...fee,
          amount: normalizeFeeAmount(fee.amount ?? fee.defaultAmount),
        })),
      );
    }
  }, [requirements]);

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  }

  function handleFeeChange(componentCode: string, value: string) {
    setFeeRows((prev) =>
      prev.map((row) => (row.componentCode === componentCode ? { ...row, amount: value } : row)),
    );
  }

  function validate(): string | null {
    if (!form.customer_name.trim()) return 'Nama customer wajib diisi';
    if (!form.customer_phone.trim()) return 'Nomor HP wajib diisi';
    if (!form.plate_number.trim()) return 'Plat nomor wajib diisi';
    if (!form.vehicle_type_code) return 'Pilih jenis kendaraan';
    if (!form.service_id) return 'Pilih layanan';
    if (!feeRows.length) return 'Rincian biaya belum tersedia';
    if (feeRows.some((row) => Number.isNaN(Number(row.amount)) || Number(row.amount) < 0)) {
      return 'Nominal biaya tidak valid';
    }
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
      vehicle_type_code: form.vehicle_type_code,
      service_id: form.service_id,
      province_code: selectedLocation.provinceCode,
      city_code: selectedLocation.cityCode || undefined,
      city_name: selectedLocation.cityName || undefined,
      tax_due_date: form.tax_due_date || undefined,
      notes: form.notes.trim() || undefined,
      fee_details: feeRows.map((row) => ({
        component_code: row.componentCode,
        amount: Number(row.amount || 0),
      })),
    });
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 820 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Tambah Transaksi
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextField label="Nama Customer" fullWidth required value={form.customer_name} onChange={(e) => handleChange('customer_name', e.target.value)} />
          <TextField label="No. HP Customer" fullWidth required value={form.customer_phone} onChange={(e) => handleChange('customer_phone', e.target.value)} />
          <TextField label="Plat Nomor" fullWidth required placeholder="B 1234 ABC" value={form.plate_number} onChange={(e) => handleChange('plate_number', e.target.value)} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Jenis Kendaraan</InputLabel>
              <Select value={form.vehicle_type_code} label="Jenis Kendaraan" onChange={(e) => handleChange('vehicle_type_code', e.target.value)}>
                {VEHICLE_TYPES.map((type) => <MenuItem key={type.code} value={type.code}>{type.name}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Wilayah</InputLabel>
              <Select value={form.province_city} label="Wilayah" onChange={(e) => handleChange('province_city', e.target.value)}>
                {JAVA_LOCATIONS.map((loc) => (
                  <MenuItem key={`${loc.provinceCode}-${loc.cityCode}`} value={`${loc.provinceCode}|${loc.cityCode}|${loc.cityName}`}>
                    {loc.cityName}, {loc.provinceName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <FormControl fullWidth required>
            <InputLabel>Layanan</InputLabel>
            <Select value={form.service_id} label="Layanan" onChange={(e) => handleChange('service_id', e.target.value)}>
              {services?.map((svc) => <MenuItem key={svc.service_id} value={svc.service_id}>{svc.service_name}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField label="Jatuh Tempo Pajak (opsional)" fullWidth type="date" value={form.tax_due_date} onChange={(e) => handleChange('tax_due_date', e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />

          <Divider />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Rincian Biaya</Typography>
            {isLoadingRequirements && <Alert severity="info">Mengambil rincian biaya...</Alert>}
            {!isLoadingRequirements && !feeRows.length && <Alert severity="info">Pilih layanan dan kendaraan untuk melihat rincian biaya.</Alert>}
            {feeRows.map((fee) => (
              <Box key={fee.componentCode} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 180px' }, gap: 2, alignItems: 'center', py: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{fee.componentName}</Typography>
                  <Chip size="small" label={fee.isEditable ? 'Manual editable' : 'Tidak dapat diedit'} color={fee.isEditable ? 'success' : 'default'} variant="outlined" sx={{ mt: 0.75 }} />
                </Box>
                <TextField
                  type="number"
                  size="small"
                  value={fee.amount}
                  placeholder="Rp 0"
                  disabled={!fee.isEditable}
                  onChange={(e) => handleFeeChange(fee.componentCode, e.target.value)}
                  slotProps={{
                    input: { startAdornment: <InputAdornment position="start">Rp</InputAdornment> },
                    htmlInput: { min: 0 },
                  }}
                />
              </Box>
            ))}
            {!!feeRows.length && <Typography variant="h6" sx={{ mt: 2, textAlign: 'right', fontWeight: 800 }}>Preview Total: Rp{formatCurrency(totalPreview)}</Typography>}
          </Box>

          {!!requirements?.documents?.length && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Dokumen yang Dibutuhkan</Typography>
              {requirements.documents.map((doc) => <Chip key={doc.documentCode} label={doc.documentName} sx={{ mr: 1, mb: 1 }} />)}
            </Box>
          )}

          <TextField label="Catatan (opsional)" fullWidth multiline rows={3} value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} />

          <Button variant="outlined" onClick={() => router.back()} disabled={isPending} fullWidth sx={{ mb: 1 }}>Batal</Button>
          <Button type="submit" variant="contained" disabled={isPending || !feeRows.length} fullWidth>{isPending ? 'Menyimpan...' : 'Simpan Transaksi'}</Button>
        </form>
      </CardContent>
      </Card>
    </Box>
  );
}
