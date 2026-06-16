'use client';

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
  return (
    <Card sx={{ borderRadius: '22px', border: '1px solid #e8eaf0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
      <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #f0f1f5' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1a1d2e' }}>Tenant List</Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: '#f8f9fc' }}>
            <TableRow>
              <TableCell sx={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7084', py: 1.5 }}>Tenant</TableCell>
              <TableCell sx={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7084', py: 1.5 }}>Paket</TableCell>
              <TableCell sx={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7084', py: 1.5 }}>Status</TableCell>
              <TableCell sx={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7084', py: 1.5 }}>Aktivitas Terakhir</TableCell>
              <TableCell sx={{ py: 1.5 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography sx={{ color: '#a0a4b8', fontSize: 14 }}>Belum ada tenant</Typography>
                </TableCell>
              </TableRow>
            ) : (
              tenants.map((tenant) => (
                <TableRow key={tenant.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell>
                    <Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1a1d2e' }}>{tenant.name}</Typography>
                      <Typography sx={{ fontSize: 12, color: '#8b8fa3' }}>{tenant.admin_user_count} admin • {tenant.active_transactions} transaksi aktif</Typography>
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
                      {tenant.last_activity ? new Date(tenant.last_activity).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      <Box component="span" sx={{ fontSize: 11, color: '#a0a4b8', ml: 0.5 }}>({formatRelative(tenant.last_activity)})</Box>
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>more_vert</span>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {tenants.length > 0 && (
        <Box sx={{ px: 2.5, py: 1.5, borderTop: '1px solid #f0f1f5', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Typography sx={{ fontSize: 12, color: '#8b8fa3', mr: 2, alignSelf: 'center' }}>Halaman 1 dari 1</Typography>
          <IconButton size="small" disabled sx={{ width: 28, height: 28 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_left</span>
          </IconButton>
          <IconButton size="small" disabled sx={{ width: 28, height: 28 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
          </IconButton>
        </Box>
      )}
    </Card>
  );
}
