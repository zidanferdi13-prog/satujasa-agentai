'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import apiClient from '@/lib/axios';

interface ReportSummary {
  totalTransactions: number;
  revenue: number;
  active: number;
  completed: number;
  cancelled: number;
}

interface StatusRow {
  status: string;
  count: number;
  revenue?: number;
}

interface TenantRow {
  tenantName: string;
  transactionCount: number;
  revenue: number;
}

interface MonthlyRow {
  month: string;
  transactionCount?: number;
  revenue: number;
}

interface OwnerReport {
  summary: ReportSummary;
  statusDistribution: StatusRow[];
  tenantBreakdown: TenantRow[];
  monthlyRevenue: MonthlyRow[];
}

interface TenantOption {
  id: string;
  name?: string | null;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function LaporanPage() {
  const [period, setPeriod] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tenantId, setTenantId] = useState('');

  // Fetch tenant options
  const { data: tenants } = useQuery<TenantOption[]>({
    queryKey: ['owner-tenants'],
    queryFn: () => apiClient.get('/owner/tenants').then((r) => r.data?.data ?? r.data ?? []),
  });

  // Build query params
  const params: Record<string, string> = {};
  if (period === 'range' && startDate && endDate) {
    params.start_date = startDate;
    params.end_date = endDate;
  }
  if (tenantId) params.tenant_id = tenantId;

  // Fetch report data
  const { data, isLoading, isError, refetch } = useQuery<OwnerReport>({
    queryKey: ['owner-report', period, startDate, endDate, tenantId],
    queryFn: () => apiClient.get('/owner/report', { params }).then((r) => r.data?.data ?? r.data),
  });

  const summary = data?.summary;
  const statusDistribution = data?.statusDistribution ?? [];
  const tenantBreakdown = data?.tenantBreakdown ?? [];
  const monthlyRevenue = data?.monthlyRevenue ?? [];

  const hasData = Boolean(
    summary && (
      summary.totalTransactions > 0 ||
      summary.revenue > 0 ||
      statusDistribution.length > 0 ||
      tenantBreakdown.length > 0 ||
      monthlyRevenue.length > 0
    )
  );

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
          Laporan 📊
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
          Analisis performa bisnis dan transaksi tenant.
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
          Gagal memuat laporan. Coba refresh halaman.
        </Alert>
      )}

      {/* Filters */}
      <Box
        sx={{
          borderRadius: '18px',
          border: '1px solid #e5e9f3',
          boxShadow: '0 8px 20px rgba(30, 41, 59, 0.04)',
          background: 'rgba(255,255,255,0.94)',
          mb: 3,
          p: 3,
        }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1d2433', mb: 2 }}>
          Filter Laporan
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 2 }}>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#6b7280', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Periode
            </Typography>
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              fullWidth
              size="small"
              sx={{
                borderRadius: '12px',
                backgroundColor: '#f8f9fc',
                '&:hover': { backgroundColor: '#ffffff' },
                '&.Mui-focused': { borderColor: '#4f46e5' },
              }}
            >
              <MenuItem value="monthly">Bulan Ini</MenuItem>
              <MenuItem value="range">Rentang Tanggal</MenuItem>
            </Select>
          </Box>

          {period === 'range' && (
            <>
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#6b7280', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Tanggal Mulai
                </Typography>
                <TextField
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: '#f8f9fc',
                      '&:hover': { backgroundColor: '#ffffff' },
                      '&.Mui-focused': { borderColor: '#4f46e5' },
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#6b7280', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Tanggal Akhir
                </Typography>
                <TextField
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: '#f8f9fc',
                      '&:hover': { backgroundColor: '#ffffff' },
                      '&.Mui-focused': { borderColor: '#4f46e5' },
                    },
                  }}
                />
              </Box>
            </>
          )}

          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#6b7280', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tenant
            </Typography>
            <Select
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              fullWidth
              size="small"
              sx={{
                borderRadius: '12px',
                backgroundColor: '#f8f9fc',
                '&:hover': { backgroundColor: '#ffffff' },
                '&.Mui-focused': { borderColor: '#4f46e5' },
              }}
            >
              <MenuItem value="">Semua Tenant</MenuItem>
              {tenants?.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name || t.id}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={() => refetch()}
            startIcon={<span className="material-symbols-outlined">refresh</span>}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              bgcolor: 'var(--dash-primary)',
              px: 3,
              py: 1,
              fontWeight: 700,
              boxShadow: '0 8px 16px rgba(79, 70, 229, 0.2)',
              '&:hover': {
                bgcolor: 'var(--dash-primary-2)',
                boxShadow: '0 10px 20px rgba(79, 70, 229, 0.25)',
              },
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      {isLoading ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' }, gap: 2, mb: 3 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rounded" height={120} sx={{ borderRadius: '18px' }} />
          ))}
        </Box>
      ) : !hasData ? (
        <Card
          sx={{
            borderRadius: '22px',
            border: '1px solid #e5e9f3',
            boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
            background: 'rgba(255,255,255,0.94)',
            p: 6,
            textAlign: 'center',
          }}
        >
          <Box sx={{ width: 72, height: 72, borderRadius: '22px', display: 'grid', placeItems: 'center', bgcolor: '#f0f1f5', mx: 'auto', mb: 2 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#8a91a3' }}>analytics</span>
          </Box>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#1d2433', mb: 0.5 }}>
            Belum ada data laporan
          </Typography>
          <Typography sx={{ fontSize: 14, color: '#8a91a3' }}>
            Ubah filter atau tunggu transaksi baru
          </Typography>
        </Card>
      ) : (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' }, gap: 2, mb: 3 }}>
            <Card
              sx={{
                borderRadius: '22px',
                border: '1px solid #e5e9f3',
                boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
                background: 'rgba(255,255,255,0.94)',
                p: 2.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '12px', display: 'grid', placeItems: 'center', bgcolor: '#eef2ff', color: '#4f46e5' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22 }}>shopping_cart</span>
                </Box>
              </Box>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#6b7280', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Total Transaksi
              </Typography>
              <Typography sx={{ fontSize: 28, fontWeight: 800, color: '#1d2433' }}>
                {summary?.totalTransactions || 0}
              </Typography>
            </Card>

            <Card
              sx={{
                borderRadius: '22px',
                border: '1px solid #e5e9f3',
                boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
                background: 'rgba(255,255,255,0.94)',
                p: 2.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '12px', display: 'grid', placeItems: 'center', bgcolor: '#ecfdf3', color: '#22c55e' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22 }}>payments</span>
                </Box>
              </Box>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#6b7280', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Revenue
              </Typography>
              <Typography sx={{ fontSize: 28, fontWeight: 800, color: '#1d2433' }}>
                {formatCurrency(summary?.revenue || 0)}
              </Typography>
            </Card>

            <Card
              sx={{
                borderRadius: '22px',
                border: '1px solid #e5e9f3',
                boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
                background: 'rgba(255,255,255,0.94)',
                p: 2.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '12px', display: 'grid', placeItems: 'center', bgcolor: '#fff7ed', color: '#f59e0b' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22 }}>pending</span>
                </Box>
              </Box>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#6b7280', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Active
              </Typography>
              <Typography sx={{ fontSize: 28, fontWeight: 800, color: '#1d2433' }}>
                {summary?.active || 0}
              </Typography>
            </Card>

            <Card
              sx={{
                borderRadius: '22px',
                border: '1px solid #e5e9f3',
                boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
                background: 'rgba(255,255,255,0.94)',
                p: 2.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '12px', display: 'grid', placeItems: 'center', bgcolor: '#ecfdf3', color: '#22c55e' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22 }}>check_circle</span>
                </Box>
              </Box>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#6b7280', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Completed
              </Typography>
              <Typography sx={{ fontSize: 28, fontWeight: 800, color: '#1d2433' }}>
                {summary?.completed || 0}
              </Typography>
            </Card>

            <Card
              sx={{
                borderRadius: '22px',
                border: '1px solid #e5e9f3',
                boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
                background: 'rgba(255,255,255,0.94)',
                p: 2.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '12px', display: 'grid', placeItems: 'center', bgcolor: '#fef2f2', color: '#ef4444' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22 }}>cancel</span>
                </Box>
              </Box>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#6b7280', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Cancelled
              </Typography>
              <Typography sx={{ fontSize: 28, fontWeight: 800, color: '#1d2433' }}>
                {summary?.cancelled || 0}
              </Typography>
            </Card>
          </Box>

          {/* Status Distribution */}
          {statusDistribution.length > 0 && (
            <Card
              sx={{
                borderRadius: '22px',
                border: '1px solid #e5e9f3',
                boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
                background: 'rgba(255,255,255,0.94)',
                p: 3,
                mb: 3,
              }}
            >
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1d2433', mb: 2 }}>
                Distribusi Status
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
                {statusDistribution.map((row, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      borderRadius: '14px',
                      border: '1px solid #e5e9f3',
                      bgcolor: 'rgba(248, 249, 252, 0.5)',
                    }}
                  >
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#6b7280', mb: 1, textTransform: 'uppercase' }}>
                      {row.status}
                    </Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 800, color: '#1d2433', mb: 0.5 }}>
                      {row.count}
                    </Typography>
                    {row.revenue !== undefined && (
                      <Typography sx={{ fontSize: 13, color: '#8a91a3' }}>
                        {formatCurrency(row.revenue)}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Card>
          )}

          {/* Tenant Breakdown */}
          {tenantBreakdown.length > 0 && (
            <Card
              sx={{
                borderRadius: '22px',
                border: '1px solid #e5e9f3',
                boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
                background: 'rgba(255,255,255,0.94)',
                p: 3,
                mb: 3,
              }}
            >
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1d2433', mb: 2 }}>
                Breakdown per Tenant
              </Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                  <Box component="thead">
                    <Box component="tr" sx={{ borderBottom: '2px solid #e5e9f3' }}>
                      <Box component="th" sx={{ fontSize: 11, fontWeight: 800, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, textAlign: 'left' }}>
                        Tenant
                      </Box>
                      <Box component="th" sx={{ fontSize: 11, fontWeight: 800, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, textAlign: 'right' }}>
                        Transaksi
                      </Box>
                      <Box component="th" sx={{ fontSize: 11, fontWeight: 800, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, textAlign: 'right' }}>
                        Revenue
                      </Box>
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {tenantBreakdown.map((row, idx) => (
                      <Box
                        key={idx}
                        component="tr"
                        sx={{
                          transition: 'all 0.15s',
                          '&:hover': { bgcolor: '#f8f9fc' },
                          '& td': { borderBottom: '1px solid #f0f1f5', py: 2 },
                        }}
                      >
                        <Box component="td">
                          <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#1d2433' }}>
                            {row.tenantName}
                          </Typography>
                        </Box>
                        <Box component="td" sx={{ textAlign: 'right' }}>
                          <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#4f46e5' }}>
                            {row.transactionCount}
                          </Typography>
                        </Box>
                        <Box component="td" sx={{ textAlign: 'right' }}>
                          <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#22c55e' }}>
                            {formatCurrency(row.revenue)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Card>
          )}

          {/* Monthly Revenue */}
          {monthlyRevenue.length > 0 && (
            <Card
              sx={{
                borderRadius: '22px',
                border: '1px solid #e5e9f3',
                boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
                background: 'rgba(255,255,255,0.94)',
                p: 3,
                mb: 3,
              }}
            >
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1d2433', mb: 2 }}>
                Revenue Bulanan
              </Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                  <Box component="thead">
                    <Box component="tr" sx={{ borderBottom: '2px solid #e5e9f3' }}>
                      <Box component="th" sx={{ fontSize: 11, fontWeight: 800, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, textAlign: 'left' }}>
                        Bulan
                      </Box>
                      <Box component="th" sx={{ fontSize: 11, fontWeight: 800, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, textAlign: 'right' }}>
                        Transaksi
                      </Box>
                      <Box component="th" sx={{ fontSize: 11, fontWeight: 800, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, textAlign: 'right' }}>
                        Revenue
                      </Box>
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {monthlyRevenue.map((row, idx) => (
                      <Box
                        key={idx}
                        component="tr"
                        sx={{
                          transition: 'all 0.15s',
                          '&:hover': { bgcolor: '#f8f9fc' },
                          '& td': { borderBottom: '1px solid #f0f1f5', py: 2 },
                        }}
                      >
                        <Box component="td">
                          <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#1d2433' }}>
                            {row.month}
                          </Typography>
                        </Box>
                        <Box component="td" sx={{ textAlign: 'right' }}>
                          <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#4f46e5' }}>
                            {row.transactionCount || 0}
                          </Typography>
                        </Box>
                        <Box component="td" sx={{ textAlign: 'right' }}>
                          <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#22c55e' }}>
                            {formatCurrency(row.revenue)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Card>
          )}
        </>
      )}
    </Box>
  );
}
