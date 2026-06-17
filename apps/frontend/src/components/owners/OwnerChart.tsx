'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

interface ChartPoint {
  date: string;
  count: number;
}

interface OwnerChartProps {
  data?: ChartPoint[];
}

export default function OwnerChart({ data = [] }: OwnerChartProps) {
  const chartData = data;

  const maxCount = Math.max(...chartData.map((d) => d.count), 1);
  const totalTransactions = chartData.reduce((s, d) => s + d.count, 0);
  const avgDaily = Math.round(totalTransactions / (chartData.length || 1));

  const width = 400;
  const height = 160;
  const padding = 20;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2;

  const points = chartData.map((d, i) => {
    const x = padding + (i / (chartData.length - 1)) * chartW;
    const y = padding + chartH - (d.count / maxCount) * chartH;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({
    y: padding + chartH * (1 - pct),
    label: Math.round(maxCount * pct),
  }));

  const lastPoint = points[points.length - 1];

  // Date labels: show ~4 labels evenly spaced
  const dateStep = Math.max(1, Math.floor(chartData.length / 4));
  const dateLabels = chartData.filter((_, i) => i % dateStep === 0 || i === chartData.length - 1).map((d, _, arr) => {
    const idx = chartData.indexOf(d);
    return {
      label: new Date(d.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      x: padding + (idx / (chartData.length - 1)) * chartW,
    };
  });

  return (
    <Card sx={{ borderRadius: '22px', border: '1px solid #e5e9f3', boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)', background: 'rgba(255,255,255,0.94)', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1d2433', mb: 0.25 }}>Trend Transaksi</Typography>
          <Typography sx={{ fontSize: 13, color: '#8a91a3' }}>Performa transaksi 30 hari terakhir</Typography>
        </Box>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.5, py: 0.5, borderRadius: '10px', bgcolor: '#f0eeff', border: '1px solid rgba(98, 84, 243, 0.12)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#6254f3' }}>schedule</span>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#6254f3' }}>30 hari terakhir</Typography>
        </Box>
      </Box>

      {/* Mini Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3, p: 2, borderRadius: '14px', bgcolor: '#f8f9fc', border: '1px solid #eef0f6' }}>
        <Box>
          <Typography sx={{ fontSize: 11, color: '#8b8fa3', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>Total Transaksi</Typography>
          <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#1d2433' }}>{totalTransactions}</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 11, color: '#8b8fa3', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>Rata-rata Harian</Typography>
          <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#1d2433' }}>{avgDaily}</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 11, color: '#8b8fa3', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>Transaksi Sukses</Typography>
          <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#22c7b8' }}>98.2%</Typography>
        </Box>
      </Box>

      {/* Chart */}
      <Box sx={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6254f3" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6254f3" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridLines.map((gl) => (
            <g key={gl.y}>
              <line x1={padding} y1={gl.y} x2={width - padding} y2={gl.y} stroke="#f0f1f5" strokeWidth="1" />
              <text x={padding - 4} y={gl.y + 4} textAnchor="end" fill="#a0a4b8" fontSize="9" fontFamily="Inter, sans-serif">
                {gl.label}
              </text>
            </g>
          ))}

          {/* Area */}
          <path d={areaPath} fill="url(#chartGradient)" />

          {/* Line */}
          <path d={linePath} fill="none" stroke="#6254f3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data points */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={i === points.length - 1 ? 5 : 3} fill={i === points.length - 1 ? '#6254f3' : 'white'} stroke="#6254f3" strokeWidth={i === points.length - 1 ? 2 : 1.5} />
          ))}

          {/* Tooltip on last point */}
          {lastPoint && (
            <g>
              <line x1={lastPoint.x} y1={padding} x2={lastPoint.x} y2={height - padding} stroke="#6254f3" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
              <rect x={lastPoint.x - 32} y={lastPoint.y - 28} width="64" height="22" rx="6" fill="#1a1d2e" />
              <text x={lastPoint.x} y={lastPoint.y - 13} textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif">
                {lastPoint.count} trx
              </text>
            </g>
          )}

          {/* Date labels */}
          {dateLabels.map((dl) => (
            <text key={dl.x} x={dl.x} y={height - 4} textAnchor="middle" fill="#a0a4b8" fontSize="9" fontFamily="Inter, sans-serif">
              {dl.label}
            </text>
          ))}
        </svg>
      </Box>
    </Card>
  );
}
