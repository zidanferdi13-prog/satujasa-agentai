'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
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

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: tenant, isLoading } = useQuery<TenantDetail>({
    queryKey: ['owner-tenant', id],
    queryFn: () =>
      apiClient.get(`/owner/tenants/${id}`).then((r) => r.data?.data ?? r.data),
  });

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
    </Box>
  );
}
