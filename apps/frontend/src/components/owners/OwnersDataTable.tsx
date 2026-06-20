'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import StatusPill from '@/components/shared/StatusPill';
import { Owner } from '@/types/owner';

interface OwnersDataTableProps {
  data: Owner[];
  onSearch: (v: string) => void;
  onTierChange: (v: string) => void;
}

export default function OwnersDataTable({ data, onSearch, onTierChange }: OwnersDataTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getTierVariant = (tier: string | null): 'info' | 'success' | 'warning' | 'error' => {
    const t = (tier ?? 'FREE').toUpperCase();
    if (t === 'PRO') return 'success';
    if (t === 'PLUS') return 'warning';
    if (t === 'EXTREME' || t === 'EXPERT') return 'success';
    return 'info';
  };

  const getStatusVariant = (status: string | null): 'success' | 'warning' | 'error' | 'info' => {
    const s = (status ?? 'pending').toLowerCase();
    if (s === 'active') return 'success';
    if (s === 'trial') return 'warning';
    return 'warning'; // pending
  };

  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexWrap: 'wrap',
          p: 2.5,
          borderRadius: '18px',
          border: '1px solid #e5e9f3',
          background: 'rgba(255,255,255,0.94)',
          boxShadow: '0 8px 20px rgba(30, 41, 59, 0.04)',
        }}
      >
        <TextField
          size="small"
          placeholder="Cari email atau perusahaan..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onSearch(e.target.value);
          }}
          sx={{
            flex: 1,
            minWidth: 240,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: '#f8f9fc',
              border: '1px solid #e5e9f3',
              '&:hover': { backgroundColor: '#ffffff', borderColor: '#d0d4e4' },
              '&.Mui-focused': { backgroundColor: '#ffffff', borderColor: '#4f46e5', boxShadow: '0 0 0 3px rgba(79,70,229,0.10)' },
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            },
          }}
        />
        <Select
          size="small"
          defaultValue="ALL"
          onChange={(e) => onTierChange(e.target.value)}
          sx={{
            minWidth: 160,
            borderRadius: '12px',
            backgroundColor: '#f8f9fc',
            border: '1px solid #e5e9f3',
            '&:hover': { backgroundColor: '#ffffff', borderColor: '#d0d4e4' },
            '&.Mui-focused': { backgroundColor: '#ffffff', borderColor: '#4f46e5', boxShadow: '0 0 0 3px rgba(79,70,229,0.10)' },
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
          }}
        >
          <MenuItem value="ALL">Semua Tier</MenuItem>
          <MenuItem value="FREE">Free</MenuItem>
          <MenuItem value="PRO">Pro</MenuItem>
          <MenuItem value="PLUS">Plus</MenuItem>
          <MenuItem value="EXPERT">Expert</MenuItem>
        </Select>
      </Box>

      {/* Table Desktop View */}
      {!isMobile && (
      <TableContainer component={Paper} sx={{ borderRadius: '22px', boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)', border: '1px solid #e5e9f3', overflow: 'auto', background: 'rgba(255,255,255,0.94)' }}>
        <Table sx={{ minWidth: { xs: 640, sm: 860 } }}>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow sx={{ borderBottom: '2px solid #e5e9f3' }}>
              <TableCell sx={{ fontSize: 11, fontWeight: 800, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.1em', py: 2 }}>Owner</TableCell>
              <TableCell sx={{ fontSize: 11, fontWeight: 800, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.1em', py: 2 }}>Subscription</TableCell>
              <TableCell sx={{ fontSize: 11, fontWeight: 800, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.1em', py: 2 }}>Tenant</TableCell>
              <TableCell sx={{ fontSize: 11, fontWeight: 800, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.1em', py: 2 }}>Status</TableCell>
              <TableCell sx={{ fontSize: 11, fontWeight: 800, color: '#394154', textTransform: 'uppercase', letterSpacing: '0.1em', py: 2 }}>MRR</TableCell>
              <TableCell sx={{ py: 2 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 9 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 72, height: 72, borderRadius: '22px', display: 'grid', placeItems: 'center', bgcolor: '#eef2ff', color: '#4f46e5' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 36 }}>person_search</span>
                    </Box>
                    <Typography sx={{ color: '#1d2433', fontSize: 16, fontWeight: 800 }}>Tidak ada owner ditemukan</Typography>
                    <Typography sx={{ color: 'var(--dash-muted)', fontSize: 13 }}>Coba ubah kata kunci pencarian atau filter tier.</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              data.map((owner) => (
                <TableRow
                  key={owner.id}
                  hover
                  sx={{
                    transition: 'all 0.16s ease',
                    '& td': { borderBottom: '1px solid #f0f1f5', py: 2.1 },
                    '&:hover': { bgcolor: '#f8f9fc' },
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{
                        width: 42, height: 42, fontSize: 14, fontWeight: 800,
                        background: 'linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)',
                        boxShadow: '0 8px 16px rgba(79,70,229,0.18)',
                      }}>
                        {(owner.email || 'OW').slice(0, 2).toUpperCase()}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1d2433', lineHeight: 1.35 }}>
                          {owner.email}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: 'var(--dash-muted)', lineHeight: 1.35 }}>
                          {owner.company_name ?? 'Belum ada nama perusahaan'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <StatusPill
                      status={(owner.subscription_tier ?? 'FREE').toUpperCase()}
                      variant={getTierVariant(owner.subscription_tier)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.25, py: 0.6, borderRadius: '10px', bgcolor: '#eef2ff', color: '#4f46e5', fontSize: 12, fontWeight: 800 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 15 }}>domain</span>
                      {owner.total_tenants}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <StatusPill
                      status={(owner.subscription_status ?? 'pending').toUpperCase()}
                      variant={getStatusVariant(owner.subscription_status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#1d2433' }}>
                      Rp {Number(owner.mrr ?? 0).toLocaleString('id-ID')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '10px',
                        color: '#8a91a3',
                        '&:hover': { bgcolor: '#eef2ff', color: '#4f46e5' },
                      }}
                      onClick={() => router.push(`/admin/owners/${owner.id}`)}
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
      )}

      {/* Mobile Card View */}
      {isMobile && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.map((owner) => (
            <Card key={owner.id} sx={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(30, 41, 59, 0.05)' }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography sx={{ fontWeight: 700 }}>{owner.email}</Typography>
                  <StatusPill status={(owner.subscription_tier ?? 'FREE').toUpperCase()} variant={getTierVariant(owner.subscription_tier)} />
                </Box>
                <Typography sx={{ fontSize: 12, color: 'var(--dash-muted)', mt: 0.5 }}>{owner.company_name}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography sx={{ fontSize: 12 }}>Tenants: {owner.total_tenants}</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 700 }}>MRR: Rp {Number(owner.mrr ?? 0).toLocaleString('id-ID')}</Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
