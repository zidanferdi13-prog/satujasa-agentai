'use client';

import { useState } from 'react';
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
import StatusPill from '@/components/shared/StatusPill';
import { Owner } from '@/types/owner';

interface OwnersDataTableProps {
  data: Owner[];
  onSearch: (v: string) => void;
  onTierChange: (v: string) => void;
}

export default function OwnersDataTable({ data, onSearch, onTierChange }: OwnersDataTableProps) {
  const [search, setSearch] = useState('');

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
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Cari email atau perusahaan..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onSearch(e.target.value);
          }}
          sx={{ flex: 1, minWidth: 200, bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />
        <Select
          size="small"
          defaultValue="ALL"
          onChange={(e) => onTierChange(e.target.value)}
          sx={{ minWidth: 150, bgcolor: 'white', borderRadius: '12px' }}
        >
          <MenuItem value="ALL">Semua Tier</MenuItem>
          <MenuItem value="FREE">Free</MenuItem>
          <MenuItem value="PRO">Pro</MenuItem>
          <MenuItem value="PLUS">Plus</MenuItem>
          <MenuItem value="EXPERT">Expert</MenuItem>
        </Select>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: '22px', boxShadow: 'var(--dash-shadow-soft)', border: '1px solid var(--dash-line)', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Owner</TableCell>
              <TableCell sx={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Subscription</TableCell>
              <TableCell sx={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tenant</TableCell>
              <TableCell sx={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</TableCell>
              <TableCell sx={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>MRR</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <Typography sx={{ color: 'var(--dash-muted)' }}>Tidak ada owner ditemukan</Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((owner) => (
                <TableRow key={owner.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ 
                        width: 40, height: 40, fontSize: 14, fontWeight: 700,
                        background: 'linear-gradient(135deg, #6161ff 0%, #8b5cf6 100%)'
                      }}>
                        {owner.email.slice(0, 2).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{owner.email}</Typography>
                        <Typography sx={{ fontSize: 12, color: 'var(--dash-muted)' }}>{owner.company_name ?? '—'}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <StatusPill 
                      status={(owner.subscription_tier ?? 'FREE').toUpperCase()} 
                      variant={getTierVariant(owner.subscription_tier) as any} 
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'inline-flex', px: 1, py: 0.5, borderRadius: '6px', bgcolor: '#f1f5f9', fontSize: 12, fontWeight: 700 }}>
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
                    <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                      Rp {Number(owner.mrr ?? 0).toLocaleString('id-ID')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <span className="material-symbols-outlined">more_vert</span>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
