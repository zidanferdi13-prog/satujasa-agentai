'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

/* ── Helper: compute derived stats ── */
function computeStats(data: Array<{ date: string; count: number }>) {
  const counts = data.map((d) => d.count);
  const total = counts.reduce((a, b) => a + b, 0);
  const avg = counts.length > 0 ? total / counts.length : 0;
  const max = counts.length > 0 ? Math.max(...counts) : 0;
  const min = counts.length > 0 ? Math.min(...counts) : 0;
  return { total, avg, max, min };
}

/* ── Get abbreviated X-axis labels ── */
function getDayLabels(data: Array<{ date: string; count: number }>) {
  if (data.length === 0) return [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const indices = data.length <= 5
    ? data.map((_, i) => i)
    : [0, Math.floor((data.length - 1) / 4), Math.floor((data.length - 1) / 2), Math.floor(3 * (data.length - 1) / 4), data.length - 1];

  return indices.map((i) => {
    const d = data[i];
    if (!d) return '';
    const parts = d.date.split('-');
    const day = parseInt(parts[2] ?? '1', 10);
    const monthIdx = parseInt(parts[1] ?? '1', 10) - 1;
    return `${day} ${months[monthIdx] ?? ''}`;
  });
}

/* ── Props ── */
interface AdminUserChartProps {
  chartData?: Array<{ date: string; count: number }>;
}

export default function AdminUserChart({ chartData }: AdminUserChartProps) {
  const data = chartData ?? [];

  if (data.length === 0) {
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
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1e293b', mb: 2 }}>
          Grafik Transaksi 30 Hari
        </Typography>
        <Box sx={{ py: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#8b8fa3' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 40, marginBottom: 8 }}>bar_chart</span>
          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>Belum ada data transaksi</Typography>
        </Box>
      </Card>
    );
  }

  const stats = computeStats(data);

  /* ── SVG constants ── */
  const viewW = 700;
  const viewH = 240;
  const padLeft = 10;
  const padRight = 10;
  const padTop = 16;
  const padBottom = 36;
  const usableW = viewW - padLeft - padRight;
  const usableH = viewH - padTop - padBottom;

  const counts = data.map((d) => d.count);
  const maxVal = Math.max(...counts, 1);
  const minVal = Math.min(...counts, 0);
  const range = maxVal - minVal || 1;

  /* Build line points */
  const points = data.map((d, i) => {
    const x = padLeft + (i / Math.max(data.length - 1, 1)) * usableW;
    const y = padTop + usableH - ((d.count - minVal) / range) * usableH;
    return { x, y, count: d.count, date: d.date };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaD = `${pathD} L${points[points.length - 1]?.x.toFixed(1) ?? padLeft + usableW},${padTop + usableH} L${padLeft},${padTop + usableH} Z`;

  /* Grid lines: 5 horizontal */
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((frac) => ({
    y: padTop + usableH - frac * usableH,
    label: Math.round(minVal + frac * range),
  }));

  const dayLabels = getDayLabels(data);
  const lastPoint = points[points.length - 1];

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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
          Grafik Transaksi 30 Hari
        </Typography>
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: '8px',
            bgcolor: '#f3f0ff',
            color: '#6046f4',
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          30 hari terakhir
        </Box>
      </Box>

      {/* ── SVG Chart ── */}
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <svg
          viewBox={`0 0 ${viewW} ${viewH}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6046f4" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#6046f4" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridLines.map((gl) => (
            <g key={gl.y}>
              <line
                x1={padLeft}
                y1={gl.y}
                x2={padLeft + usableW}
                y2={gl.y}
                stroke="#e5e9f3"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padLeft - 2}
                y={gl.y + 4}
                textAnchor="end"
                fill="#8b8fa3"
                fontSize="10"
                fontFamily="inherit"
              >
                {gl.label}
              </text>
            </g>
          ))}

          {/* Area fill */}
          <path d={areaD} fill="url(#chartAreaGrad)" />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#6046f4"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dot markers */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === points.length - 1 ? 5 : 3.5}
              fill={i === points.length - 1 ? '#6046f4' : '#fff'}
              stroke="#6046f4"
              strokeWidth="2.5"
            />
          ))}

          {/* Tooltip box on last point */}
          {lastPoint && (
            <g>
              <rect
                x={lastPoint.x - 36}
                y={lastPoint.y - 34}
                width="72"
                height="24"
                rx="6"
                fill="#6046f4"
              />
              <text
                x={lastPoint.x}
                y={lastPoint.y - 17}
                textAnchor="middle"
                fill="#fff"
                fontSize="11"
                fontWeight="700"
                fontFamily="inherit"
              >
                {lastPoint.count} transaksi
              </text>
              {/* Triangle stem */}
              <polygon
                points={`${lastPoint.x - 4},${lastPoint.y - 10} ${lastPoint.x + 4},${lastPoint.y - 10} ${lastPoint.x},${lastPoint.y - 5}`}
                fill="#6046f4"
              />
            </g>
          )}

          {/* X-axis labels */}
          {dayLabels.map((label, i) => {
            const xOffsets = data.length <= 5
              ? (i / Math.max(data.length - 1, 1)) * usableW
              : [0, 0.25, 0.5, 0.75, 1].map((f) => f * usableW);
            const x = padLeft + (Array.isArray(xOffsets) ? xOffsets[i] ?? 0 : 0);
            return (
              <text
                key={i}
                x={x}
                y={viewH - 8}
                textAnchor="middle"
                fill="#8b8fa3"
                fontSize="10"
                fontFamily="inherit"
              >
                {label}
              </text>
            );
          })}
        </svg>
      </Box>

      {/* ── Stat boxes below chart ── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
          gap: 1.5,
          mt: 2,
        }}
      >
        {[
          { label: 'Total Transaksi', value: stats.total, color: '#6046f4' },
          { label: 'Rata-rata per Hari', value: stats.avg.toFixed(1), color: '#3b82f6' },
          { label: 'Transaksi Tertinggi', value: stats.max, color: '#22c55e' },
          { label: 'Transaksi Terendah', value: stats.min, color: '#f59e0b' },
        ].map((stat) => (
          <Box
            key={stat.label}
            sx={{
              p: 1.5,
              borderRadius: '14px',
              bgcolor: `${stat.color}0D`,
              border: `1px solid ${stat.color}22`,
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 500,
                color: '#8b8fa3',
                mb: 0.5,
              }}
            >
              {stat.label}
            </Typography>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 800,
                color: stat.color,
                lineHeight: 1.1,
              }}
            >
              {stat.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
