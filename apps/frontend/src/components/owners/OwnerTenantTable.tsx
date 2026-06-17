'use client';

import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import StatusPill from '@/components/shared/StatusPill';

interface TenantRow {
  id: string;
  name: string;
  admin_user_count: number;
  active_transactions: number;
  last_activity: string | null;
  plan_tier: string;
}

interface OwnerTenantTableProps {
  tenants?: TenantRow[];
}

function getTierColor(tier: string): string {
  const t = tier?.toUpperCase() ?? '';
  if (t === 'ENTERPRISE') return '#6254f3';
  if (t === 'BUSINESS') return '#2388ff';
  if (t === 'STANDARD') return '#f6a326';
  return '#a0a4b8';
}

function getTierVariant(tier: string): 'info' | 'warning' | 'success' | 'error' {
  const t = tier?.toUpperCase() ?? '';
  if (t === 'ENTERPRISE') return 'info';
  if (t === 'BUSINESS') return 'info';
  if (t === 'STANDARD') return 'warning';
  return 'info';
}

function formatRelative(dateStr: string | null): string {
  if (!dateStr) return 'Belum ada aktivitas';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Baru saja';
  if (diffHours < 24) return `${diffHours} jam lalu`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} hari lalu`;
}

function isRecent(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const diffMs = Date.now() - new Date(dateStr).getTime();
  return diffMs < 24 * 60 * 60 * 1000;
}

export default function OwnerTenantTable({ tenants = [] }: OwnerTenantTableProps) {
  const [page, setPage] = useState(1);
  const limit = 5;
  const totalPages = Math.max(1, Math.ceil(tenants.length / limit));

  // Clamp page so it never exceeds totalPages (stays safe without render-phase setState)
  const safePage = useMemo(() => Math.min(page, totalPages), [page, totalPages]);
  const startIndex = (safePage - 1) * limit;
  const displayData = tenants.slice(startIndex, startIndex + limit);

  return (
    <Card sx={{ borderRadius: '22px', border: '1px solid #e5e9f3', boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)', background: 'rgba(255,255,255,0.94)', overflow: 'hidden' }}>
      <Box sx={{ px: 3, py: 2.25, borderBottom: '1px solid #f0f1f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1d2433', mb: 0.25 }}>Tenant List</Typography>
          <Typography sx={{ fontSize: 13, color: '#8a91a3' }}>Daftar tenant yang terdaftar pada akun Anda</Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: 12, color: '#8a91a3' }}>Terakhir diperbarui:</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#1d2433' }}>
            {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: '#f8f9fc' }}>
            <TableRow sx={{ borderBottom: '2px solid #e5e9f3' }}>
              <TableCell sx={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#394154', py: 2 }}>Tenant</TableCell>
              <TableCell sx={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#394154', py: 2 }}>Paket</TableCell>
              <TableCell sx={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#394154', py: 2 }}>Status</TableCell>
              <TableCell sx={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#394154', py: 2 }}>Aktivitas Terakhir</TableCell>
              <TableCell sx={{ py: 2 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 72, height: 72, borderRadius: '22px', display: 'grid', placeItems: 'center', bgcolor: '#f0f1f5' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#8a91a3' }}>domain</span>
                    </Box>
                    <Typography sx={{ color: '#1d2433', fontSize: 16, fontWeight: 800 }}>Belum ada tenant</Typography>
                    <Typography sx={{ color: '#8a91a3', fontSize: 13 }}>Tambahkan tenant baru untuk memulai.</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              displayData.map((tenant) => (
                <TableRow
                  key={tenant.id}
                  hover
                  sx={{
                    '& td': { borderBottom: '1px solid #f0f1f5', py: 2.1 },
                    '&:hover': { bgcolor: '#f8f9fc' },
                    '&:last-child td': { borderBottom: 0 },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 42, height: 42, borderRadius: '12px', display: 'grid', placeItems: 'center', bgcolor: '#eef2ff', color: '#4f46e5', fontWeight: 800, fontSize: 16 }}>
                        {(tenant.name || 'TN').slice(0, 2).toUpperCase()}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1d2433', lineHeight: 1.35 }}>{tenant.name}</Typography>
                        <Typography sx={{ fontSize: 12, color: '#8a91a3', lineHeight: 1.35, mt: 0.2 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle' }}>group</span>
                          {' '}{tenant.admin_user_count} admin
                          <Box component="span" sx={{ mx: 0.5 }}>•</Box>
                          <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle' }}>receipt</span>
                          {' '}{tenant.active_transactions} transaksi
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <StatusPill status={tenant.plan_tier ?? 'Free'} variant={getTierVariant(tenant.plan_tier)} />
                  </TableCell>
                  <TableCell>
                    <StatusPill
                      status={isRecent(tenant.last_activity) ? 'Aktif' : 'Nonaktif'}
                      variant={isRecent(tenant.last_activity) ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13, color: '#6b7084' }}>
                      {tenant.last_activity
                        ? new Date(tenant.last_activity).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: '#a0a4b8', mt: 0.15 }}>{formatRelative(tenant.last_activity)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      sx={{ width: 34, height: 34, borderRadius: '10px', color: '#8a91a3', '&:hover': { bgcolor: '#eef2ff', color: '#4f46e5' } }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>more_vert</span>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {tenants.length > 0 && (
        <Box sx={{ px: 3, py: 1.75, borderTop: '1px solid #f0f1f5', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1.5 }}>
          <Typography sx={{ fontSize: 13, color: '#8a91a3', mr: 1 }}>Halaman {page} dari {totalPages}</Typography>
          <IconButton
            size="small"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            sx={{ width: 32, height: 32, borderRadius: '8px', color: '#8a91a3', '&.Mui-disabled': { opacity: 0.4 }, '&:not(.Mui-disabled):hover': { bgcolor: '#eef2ff', color: '#4f46e5' } }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span>
          </IconButton>
          <IconButton
            size="small"
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            sx={{ width: 32, height: 32, borderRadius: '8px', color: '#8a91a3', '&.Mui-disabled': { opacity: 0.4 }, '&:not(.Mui-disabled):hover': { bgcolor: '#eef2ff', color: '#4f46e5' } }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
          </IconButton>
        </Box>
      )}
    </Card>
  );
}
