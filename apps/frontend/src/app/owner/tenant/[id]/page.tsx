'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import StatusPill from '@/components/shared/StatusPill';
import { useToast } from '@/components/shared/ToastProvider';
import apiClient from '@/lib/axios';
import { TenantService, MasterService } from '@/types/service';

interface AdminUser {
  id: string;
  email: string;
  phone: string;
  created_at: string;
}

interface TenantDetail {
  id: string;
  name: string;
  address: string;
  phone: string;
  admin_users: AdminUser[];
  created_at: string;
}

interface AddServiceForm {
  service_id: string;
  price: number;
  is_active: boolean;
  custom_name?: string;
}

interface EditServiceForm {
  price: number;
  is_active: boolean;
}

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<TenantService | null>(null);
  const [addForm, setAddForm] = useState<AddServiceForm>({
    service_id: '',
    price: 0,
    is_active: true,
    custom_name: '',
  });
  const [editForm, setEditForm] = useState<EditServiceForm>({
    price: 0,
    is_active: true,
  });

  const { data: tenant, isLoading } = useQuery<TenantDetail>({
    queryKey: ['owner-tenant', id],
    queryFn: () =>
      apiClient.get(`/owner/tenants/${id}`).then((r) => r.data?.data ?? r.data),
  });

  const { data: services = [], refetch, isLoading: isServicesLoading } = useQuery<TenantService[]>({
    queryKey: ['tenant-services', id],
    queryFn: () => apiClient.get(`/owner/tenants/${id}/services`).then((r) => r.data?.data ?? r.data),
  });

  const { data: masterServices = [] } = useQuery<MasterService[]>({
    queryKey: ['master-services'],
    queryFn: () => apiClient.get(`/owner/services`).then((r) => r.data?.data ?? r.data),
  });

  const { mutate: addService, isPending: isAddPending } = useMutation({
    mutationFn: (payload: AddServiceForm) =>
      apiClient.post(`/owner/tenants/${id}/services`, payload),
    onSuccess: () => {
      toast.showSuccess('Service berhasil ditambahkan');
      refetch();
      setIsAddModalOpen(false);
      setAddForm({ service_id: '', price: 0, is_active: true, custom_name: '' });
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.showError(message ?? 'Gagal menambahkan service');
    },
  });

  const { mutate: updateService, isPending: isEditPending } = useMutation({
    mutationFn: (payload: { price: number; is_active: boolean }) =>
      apiClient.post(`/owner/tenants/${id}/services/${selectedService?.id}`, payload),
    onSuccess: () => {
      toast.showSuccess('Service berhasil diupdate');
      refetch();
      setIsEditModalOpen(false);
      setSelectedService(null);
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.showError(message ?? 'Gagal mengupdate service');
    },
  });

  const { mutate: toggleStatus } = useMutation({
    mutationFn: (svc: TenantService) =>
      apiClient.post(`/owner/tenants/${id}/services/${svc.id}`, {
        price: svc.price,
        is_active: !svc.is_active,
      }),
    onSuccess: () => {
      toast.showSuccess('Status service berhasil diubah');
      refetch();
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.showError(message ?? 'Gagal mengubah status service');
    },
  });

  function handleOpenEdit(svc: TenantService) {
    setSelectedService(svc);
    setEditForm({ price: svc.price, is_active: svc.is_active });
    setIsEditModalOpen(true);
  }

  function handleSubmitAdd() {
    if (!addForm.service_id && !addForm.custom_name?.trim()) {
      toast.showError('Pilih service dari daftar atau isi nama service custom');
      return;
    }

    addService({
      ...addForm,
      custom_name: addForm.custom_name?.trim() || undefined,
    });
  }

  function handleSubmitEdit() {
    if (!selectedService) return;
    updateService(editForm);
  }

  if (isLoading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 3, maxWidth: 800 }} />
      </Box>
    );
  }

  if (!tenant) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <Typography color="text.secondary">Tenant tidak ditemukan.</Typography>
      </Box>
    );
  }

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
      {/* Back Button + Header */}
      <Box sx={{ mb: '28px', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="text"
          onClick={() => router.back()}
          sx={{
            minWidth: 0,
            width: 40,
            height: 40,
            borderRadius: '12px',
            border: '1px solid #e5e9f3',
            bgcolor: 'rgba(255,255,255,0.94)',
            color: '#6b7280',
            '&:hover': {
              bgcolor: '#f8f9fc',
              borderColor: '#d0d4e4',
            },
          }}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Button>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontSize: { xs: 28, md: 32 },
              fontWeight: 800,
              color: 'var(--dash-text)',
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            {tenant.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: 15,
              color: 'var(--dash-muted)',
              fontWeight: 400,
            }}
          >
            Detail informasi tenant dan admin users
          </Typography>
        </Box>
        <StatusPill status="Aktif" variant="success" />
      </Box>

      {/* Metric Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box
          sx={{
            borderRadius: '22px',
            border: '1px solid #e5e9f3',
            boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
            background: 'rgba(255,255,255,0.94)',
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              display: 'grid',
              placeItems: 'center',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              boxShadow: '0 8px 16px rgba(79, 70, 229, 0.2)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#ffffff' }}>
              group
            </span>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
              Admin User
            </Typography>
            <Typography sx={{ fontSize: 32, fontWeight: 800, color: '#1d2433', lineHeight: 1 }}>
              {tenant.admin_users?.length ?? 0}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            borderRadius: '22px',
            border: '1px solid #e5e9f3',
            boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
            background: 'rgba(255,255,255,0.94)',
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              display: 'grid',
              placeItems: 'center',
              background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
              boxShadow: '0 8px 16px rgba(34, 197, 94, 0.2)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#ffffff' }}>
              calendar_month
            </span>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
              Dibuat
            </Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#1d2433', lineHeight: 1.2 }}>
              {new Date(tenant.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tenant Info Card */}
      <Box
        sx={{
          borderRadius: '22px',
          border: '1px solid #e5e9f3',
          boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
          background: 'rgba(255,255,255,0.94)',
          p: 3,
          mb: 4,
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1d2433', mb: 3 }}>
          Informasi Tenant
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
              Alamat
            </Typography>
            <Typography sx={{ fontSize: 15, color: '#1d2433', fontWeight: 500, lineHeight: 1.6 }}>
              {tenant.address || '-'}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
              Telepon
            </Typography>
            <Typography sx={{ fontSize: 15, color: '#1d2433', fontWeight: 500, lineHeight: 1.6 }}>
              {tenant.phone || '-'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Admin Users Section */}
      <Box
        sx={{
          borderRadius: '22px',
          border: '1px solid #e5e9f3',
          boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
          background: 'rgba(255,255,255,0.94)',
          p: 3,
          mb: 4,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1d2433', mb: 0.5 }}>
              Admin User ({tenant.admin_users?.length ?? 0})
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#6b7280' }}>
              Daftar admin yang memiliki akses ke tenant ini
            </Typography>
          </Box>
          <Link href={`/owner/admin-users/baru?tenant_id=${tenant.id}`}>
            <Button
              size="small"
              variant="contained"
              startIcon={<span className="material-symbols-outlined">person_add</span>}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                bgcolor: 'var(--dash-primary)',
                px: 2.5,
                py: 1,
                fontWeight: 700,
                boxShadow: '0 8px 16px rgba(79, 70, 229, 0.2)',
                '&:hover': {
                  bgcolor: 'var(--dash-primary-2)',
                  boxShadow: '0 10px 20px rgba(79, 70, 229, 0.25)',
                },
              }}
            >
              Tambah Admin
            </Button>
          </Link>
        </Box>

        {tenant.admin_users && tenant.admin_users.length > 0 ? (
          <Box sx={{ display: 'grid', gap: 1.5 }}>
            {tenant.admin_users.map((user) => (
              <Box
                key={user.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2.5,
                  borderRadius: '16px',
                  border: '1px solid #e5e9f3',
                  bgcolor: 'rgba(248, 249, 252, 0.5)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#f8f9fc',
                    borderColor: '#d0d4e4',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(30, 41, 59, 0.08)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '14px',
                    display: 'grid',
                    placeItems: 'center',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                    boxShadow: '0 6px 12px rgba(139, 92, 246, 0.2)',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#ffffff' }}>
                    person
                  </span>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#1d2433', mb: 0.25 }}>
                    {user.email}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: '#6b7280' }}>
                    {user.phone}
                  </Typography>
                </Box>
                <StatusPill status="Aktif" variant="success" />
              </Box>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              borderRadius: '16px',
              border: '2px dashed #e5e9f3',
              bgcolor: 'rgba(248, 249, 252, 0.3)',
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '20px',
                display: 'grid',
                placeItems: 'center',
                bgcolor: '#eef2ff',
                mx: 'auto',
                mb: 2,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#4f46e5' }}>
                person_off
              </span>
            </Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1d2433', mb: 0.5 }}>
              Belum ada admin user
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#6b7280' }}>
              Tambahkan admin untuk mengelola tenant ini
            </Typography>
          </Box>
        )}
      </Box>

      {/* ─── Services Section ─── */}
      <Box
        sx={{
          borderRadius: '22px',
          border: '1px solid #e5e9f3',
          boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
          background: 'rgba(255,255,255,0.94)',
          p: 3,
          mb: 4,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1d2433', mb: 0.5 }}>
              Daftar Jasa / Service
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#6b7280' }}>
              Jasa yang tersedia di tenant ini beserta harga
            </Typography>
          </Box>
          <Button
            size="small"
            variant="contained"
            onClick={() => setIsAddModalOpen(true)}
            startIcon={<span className="material-symbols-outlined">add</span>}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              bgcolor: 'var(--dash-primary)',
              px: 2.5,
              py: 1,
              fontWeight: 700,
              boxShadow: '0 8px 16px rgba(79, 70, 229, 0.2)',
              '&:hover': {
                bgcolor: 'var(--dash-primary-2)',
                boxShadow: '0 10px 20px rgba(79, 70, 229, 0.25)',
              },
            }}
          >
            + Tambah Service
          </Button>
        </Box>

        {isServicesLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : services.length > 0 ? (
          <TableContainer>
            <Table sx={{ minWidth: 600 }}>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow sx={{ borderBottom: '2px solid #e5e9f3' }}>
                  <TableCell sx={{ fontSize: 11, fontWeight: 800, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.1em', py: 2 }}>Nama Service</TableCell>
                  <TableCell sx={{ fontSize: 11, fontWeight: 800, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.1em', py: 2 }}>Harga (Rp)</TableCell>
                  <TableCell sx={{ fontSize: 11, fontWeight: 800, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.1em', py: 2 }}>Status</TableCell>
                  <TableCell sx={{ py: 2 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((svc) => (
                  <TableRow
                    key={svc.id}
                    hover
                    sx={{
                      '& td': { borderBottom: '1px solid #f0f1f5', py: 2 },
                      '&:hover': { bgcolor: '#f8f9fc' },
                      '&:last-child td': { border: 0 },
                    }}
                  >
                    <TableCell>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1d2433' }}>
                        {svc.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1d2433' }}>
                        Rp {Number(svc.price).toLocaleString('id-ID')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={svc.is_active}
                        onChange={() => toggleStatus(svc)}
                        size="small"
                        color="success"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenEdit(svc)}
                        startIcon={<span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>}
                        sx={{
                          borderRadius: '10px',
                          textTransform: 'none',
                          fontSize: 12,
                          fontWeight: 700,
                          borderColor: '#e5e9f3',
                          color: '#6b7280',
                          '&:hover': { borderColor: '#4f46e5', color: '#4f46e5', bgcolor: '#eef2ff' },
                        }}
                      >
                        Edit harga
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              borderRadius: '16px',
              border: '2px dashed #e5e9f3',
              bgcolor: 'rgba(248, 249, 252, 0.3)',
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '20px',
                display: 'grid',
                placeItems: 'center',
                bgcolor: '#eef2ff',
                mx: 'auto',
                mb: 2,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#4f46e5' }}>
                list_alt
              </span>
            </Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1d2433', mb: 0.5 }}>
              Belum ada service
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#6b7280' }}>
              Klik tombol di bawah untuk menambahkan.
            </Typography>
          </Box>
        )}
      </Box>

      {/* ─── Add Service Modal ─── */}
      <Dialog open={isAddModalOpen} onClose={() => !isAddPending && setIsAddModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800 }}>Tambah Service</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <FormControl fullWidth required>
            <InputLabel>Pilih Service</InputLabel>
            <Select
              value={addForm.service_id}
              label="Pilih Service"
              onChange={(e) => setAddForm({ ...addForm, service_id: e.target.value as string })}
            >
              {masterServices.map((ms) => (
                <MenuItem key={ms.id} value={ms.id}>
                  {ms.code} — {ms.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Nama Service (Custom)"
            placeholder="Kosongkan jika ingin pakai nama dari pilihan di atas"
            fullWidth
            value={addForm.custom_name ?? ''}
            onChange={(e) => setAddForm({ ...addForm, custom_name: e.target.value })}
          />
          <TextField
            label="Harga (Rp)"
            type="number"
            fullWidth
            value={addForm.price}
            onChange={(e) => setAddForm({ ...addForm, price: parseInt(e.target.value) || 0 })}
            slotProps={{ htmlInput: { min: 0 } }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Switch
              checked={addForm.is_active}
              onChange={(e) => setAddForm({ ...addForm, is_active: e.target.checked })}
              color="success"
            />
            <Typography sx={{ fontSize: 14, color: '#6b7280' }}>Aktif</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setIsAddModalOpen(false)} disabled={isAddPending}>Batal</Button>
          <Button onClick={handleSubmitAdd} variant="contained" disabled={isAddPending}>
            {isAddPending ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Edit Service Modal ─── */}
      <Dialog open={isEditModalOpen} onClose={() => !isEditPending && setIsEditModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800 }}>
          Edit Harga {selectedService?.name ?? ''}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Harga (Rp)"
            type="number"
            fullWidth
            value={editForm.price}
            onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) || 0 })}
            slotProps={{ htmlInput: { min: 0 } }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Switch
              checked={editForm.is_active}
              onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
              color="success"
            />
            <Typography sx={{ fontSize: 14, color: '#6b7280' }}>Aktif</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setIsEditModalOpen(false)} disabled={isEditPending}>Batal</Button>
          <Button onClick={handleSubmitEdit} variant="contained" disabled={isEditPending}>
            {isEditPending ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
