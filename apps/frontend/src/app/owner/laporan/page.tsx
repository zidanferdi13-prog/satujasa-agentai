'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import apiClient from '@/lib/axios';

interface Summary {
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
  summary: Summary;
  statusDistribution: StatusRow[];
  tenantBreakdown: TenantRow[];
  monthlyRevenue: MonthlyRow[];
}

type PeriodMode = 'monthly' | 'range';

type RawRecord = Record<string, unknown>;

function asRecord(value: unknown): RawRecord {
  return value && typeof value === 'object' ? (value as RawRecord) : {};
}

function num(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number) {
  return `Rp${value.toLocaleString('id-ID')}`;
}

function normalizeReport(rawValue: unknown): OwnerReport {
  const raw = asRecord(rawValue);
  const summary = asRecord(raw.summary ?? raw.totals);
  const statusRows = (raw.statusDistribution ?? raw.status_distribution ?? raw.byStatus ?? []) as RawRecord[];
  const tenantRows = (raw.tenantBreakdown ?? raw.tenant_breakdown ?? raw.byTenant ?? []) as RawRecord[];
  const monthlyRows = (raw.monthlyRevenue ?? raw.monthly_revenue ?? raw.revenueByMonth ?? []) as RawRecord[];

  return {
    summary: {
      totalTransactions: num(summary.totalTransactions ?? summary.total_transactions ?? raw.total_transactions),
      revenue: num(summary.revenue ?? summary.totalRevenue ?? summary.total_revenue ?? raw.total_revenue),
      active: num(summary.active ?? summary.activeTransactions ?? summary.active_transactions),
      completed: num(summary.completed ?? summary.completedTransactions ?? summary.completed_transactions),
      cancelled: num(summary.cancelled ?? summary.cancelledTransactions ?? summary.cancelled_transactions),
    },
    statusDistribution: statusRows.map((row) => ({
      status: String(row.status ?? row.name ?? '-'),
      count: num(row.count ?? row.transaction_count),
      revenue: row.revenue === undefined ? undefined : num(row.revenue),
    })),
    tenantBreakdown: tenantRows.map((row) => ({
      tenantName: String(row.tenantName ?? row.tenant_name ?? row.name ?? '-'),
      transactionCount: num(row.transactionCount ?? row.transaction_count ?? row.count),
      revenue: num(row.revenue ?? row.total_revenue),
    })),
    monthlyRevenue: monthlyRows.map((row) => ({
      month: String(row.month ?? row.period ?? row.label ?? '-'),
      transactionCount: row.transactionCount === undefined && row.transaction_count === undefined
        ? undefined
        : num(row.transactionCount ?? row.transaction_count),
      revenue: num(row.revenue ?? row.total_revenue),
    })),
  };
}

export default function OwnerLaporanPage() {
  const [period, setPeriod] = useState<PeriodMode>('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const params = useMemo(() => {
    const next: Record<string, string> = { period };
    if (period === 'range') {
      if (startDate) next.startDate = startDate;
      if (endDate) next.endDate = endDate;
    }
    return next;
  }, [period, startDate, endDate]);

  const { data, isLoading, isError } = useQuery<OwnerReport>({
    queryKey: ['owner-report', params],
    queryFn: () => apiClient.get('/owner/report', { params }).then((r) => normalizeReport(r.data?.data ?? r.data)),
  });

  const summary = data?.summary;
  const hasData = Boolean(
    summary && (
      summary.totalTransactions > 0 ||
      summary.revenue > 0 ||
      data.statusDistribution.length > 0 ||
      data.tenantBreakdown.length > 0 ||
      data.monthlyRevenue.length > 0
    ),
  );

  return (
    <Box className="p-6 md:p-8">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Laporan</Typography>
          <Typography variant="body2" color="text.secondary">
            Ringkasan performa tenant dan transaksi.
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={(_, value) => value && setPeriod(value)}
          size="small"
        >
          <ToggleButton value="monthly">Bulanan</ToggleButton>
          <ToggleButton value="range">Rentang Tanggal</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {period === 'range' && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <TextField type="date" size="small" label="Mulai" value={startDate} onChange={(e) => setStartDate(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
          <TextField type="date" size="small" label="Selesai" value={endDate} onChange={(e) => setEndDate(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
        </Box>
      )}

      {isError && <Alert severity="error" sx={{ mb: 3 }}>Gagal memuat laporan. Coba refresh halaman.</Alert>}

      {isLoading ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, gap: 2 }}>
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} variant="rounded" height={112} />)}
        </Box>
      ) : (
        <>
          {!hasData && <Alert severity="info" sx={{ mb: 3 }}>Belum ada data laporan untuk periode ini.</Alert>}

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, gap: 2, mb: 4 }}>
            {[
              ['Total Transaksi', summary?.totalTransactions ?? 0],
              ['Revenue', formatCurrency(summary?.revenue ?? 0)],
              ['Active', summary?.active ?? 0],
              ['Completed', summary?.completed ?? 0],
              ['Cancelled', summary?.cancelled ?? 0],
            ].map(([label, value]) => (
              <Card key={label}>
                <CardContent>
                  <Typography color="text.secondary" sx={{ fontSize: 14 }}>{label}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          <ReportTable
            title="Distribusi Status"
            headers={['Status', 'Transaksi', 'Revenue']}
            rows={(data?.statusDistribution ?? []).map((row) => [row.status, row.count, row.revenue === undefined ? '—' : formatCurrency(row.revenue)])}
          />
          <ReportTable
            title="Breakdown Tenant"
            headers={['Tenant', 'Transaksi', 'Revenue']}
            rows={(data?.tenantBreakdown ?? []).map((row) => [row.tenantName, row.transactionCount, formatCurrency(row.revenue)])}
          />
          <ReportTable
            title="Revenue Bulanan"
            headers={['Bulan', 'Transaksi', 'Revenue']}
            rows={(data?.monthlyRevenue ?? []).map((row) => [row.month, row.transactionCount ?? '—', formatCurrency(row.revenue)])}
          />
        </>
      )}
    </Box>
  );
}

function ReportTable({ title, headers, rows }: { title: string; headers: string[]; rows: (string | number)[][] }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{title}</Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>{headers.map((header) => <TableCell key={header}>{header}</TableCell>)}</TableRow>
          </TableHead>
          <TableBody>
            {rows.length ? rows.map((row, index) => (
              <TableRow key={`${title}-${index}`}>{row.map((cell, cellIndex) => <TableCell key={cellIndex}>{cell}</TableCell>)}</TableRow>
            )) : (
              <TableRow><TableCell colSpan={headers.length}>Tidak ada data.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
