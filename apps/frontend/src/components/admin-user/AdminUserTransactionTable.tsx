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
import type { AdminUserDashboardResponse } from '@/types/dashboard';

/* ── Map status to StatusPill variant ── */
function getStatusVariant(status: string): 'success' | 'warning' | 'error' | 'info' {
  const s = status.toLowerCase();
  if (s === 'selesai') return 'success';
  if (s === 'pending') return 'warning';
  if (s === 'diproses' || s === 'proses') return 'info';
  return 'info';
}

/* ── Format ISO date to readable ── */
function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const day = d.getDate();
    const month = months[d.getMonth()] ?? '';
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${hours}:${mins}`;
  } catch {
    return iso;
  }
}

/* ── Props ── */
interface AdminUserTransactionTableProps {
  transactions?: AdminUserDashboardResponse['recent_transactions'];
}

export default function AdminUserTransactionTable({ transactions }: AdminUserTransactionTableProps) {
  const items = transactions ?? [];
  const rows = items.slice(0, 5);

  return (
    <Card
      sx={{
        p: '22px',
        borderRadius: '22px',
        border: '1px solid #e5e9f3',
        boxShadow: '0 10px 24px rgba(30, 41, 59, 0.06)',
        bgcolor: '#fff',
        mb: 3,
      }}
    >
      {/* ── Header ── */}
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 700,
          color: '#1e293b',
          mb: 2,
        }}
      >
        Transaksi Terbaru
      </Typography>

      {/* ── Empty state ── */}
      {rows.length === 0 ? (
        <Box
          sx={{
            py: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8b8fa3',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 40, marginBottom: 8 }}>
            receipt_long
          </span>
          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
            Belum ada transaksi
          </Typography>
        </Box>
      ) : (
        <>
          {/* ── Table ── */}
          <TableContainer sx={{ mb: 2 }}>
            <Table size="small" sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#8b8fa3',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      borderBottom: '1px solid #f1f5f9',
                      py: 1,
                    }}
                  >
                    ID Transaksi
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#8b8fa3',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      borderBottom: '1px solid #f1f5f9',
                      py: 1,
                    }}
                  >
                    Tenant
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#8b8fa3',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      borderBottom: '1px solid #f1f5f9',
                      py: 1,
                    }}
                  >
                    Jenis Layanan
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#8b8fa3',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      borderBottom: '1px solid #f1f5f9',
                      py: 1,
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#8b8fa3',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      borderBottom: '1px solid #f1f5f9',
                      py: 1,
                    }}
                  >
                    Waktu
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#8b8fa3',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      borderBottom: '1px solid #f1f5f9',
                      py: 1,
                      width: 48,
                    }}
                    align="center"
                  >
                    Aksi
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, idx) => {
                  const isLast = idx === rows.length - 1;
                  return (
                    <TableRow
                      key={row.id}
                      sx={{
                        '&:hover': { bgcolor: '#f8fafc' },
                        '&:last-child td': { borderBottom: 'none' },
                      }}
                    >
                      {/* ID Transaksi — mono font */}
                      <TableCell
                        sx={{
                          borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
                          py: 1.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: '"SF Mono", "Fira Code", "Cascadia Code", monospace',
                            fontSize: 12,
                            fontWeight: 600,
                            color: '#6046f4',
                          }}
                        >
                          {row.trx_number}
                        </Typography>
                      </TableCell>

                      {/* Tenant */}
                      <TableCell
                        sx={{
                          borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
                          py: 1.5,
                        }}
                      >
                        <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1e293b' }}>
                          {row.tenant_name}
                        </Typography>
                      </TableCell>

                      {/* Jenis Layanan */}
                      <TableCell
                        sx={{
                          borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
                          py: 1.5,
                        }}
                      >
                        <Typography sx={{ fontSize: 13, fontWeight: 400, color: '#475569' }}>
                          {row.service_name}
                        </Typography>
                      </TableCell>

                      {/* Status Pill */}
                      <TableCell
                        sx={{
                          borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
                          py: 1.5,
                        }}
                      >
                        <StatusPill status={row.status} variant={getStatusVariant(row.status)} />
                      </TableCell>

                      {/* Waktu */}
                      <TableCell
                        sx={{
                          borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
                          py: 1.5,
                        }}
                      >
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: '#64748b', whiteSpace: 'nowrap' }}>
                          {formatTime(row.created_at)}
                        </Typography>
                      </TableCell>

                      {/* Aksi */}
                      <TableCell
                        align="center"
                        sx={{
                          borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
                          py: 1.5,
                        }}
                      >
                        <IconButton
                          size="small"
                          sx={{
                            color: '#94a3b8',
                            '&:hover': { color: '#6046f4', bgcolor: '#f3f0ff' },
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                            more_vert
                          </span>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* ── Bottom link ── */}
      {rows.length > 0 && (
        <Box
          component="a"
          href="#"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            textDecoration: 'none',
            color: '#6046f4',
            fontSize: 13,
            fontWeight: 600,
            py: 1,
            borderRadius: '10px',
            transition: 'background-color 0.15s ease',
            '&:hover': { bgcolor: '#f3f0ff' },
          }}
        >
          Lihat Semua
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            arrow_forward
          </span>
        </Box>
      )}
    </Card>
  );
}
