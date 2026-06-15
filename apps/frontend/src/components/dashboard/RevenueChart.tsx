'use client';

import { useState, useMemo } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

type RevenueChartProps = {
  data?: Array<{ month: string; revenue: number }>;
};

const DEFAULT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

const DEFAULT_REVENUE = [18.5, 22.3, 28.1, 24.7, 32.4, 35.8, 30.2, 38.6, 42.1, 39.5, 45.3, 48.9];

function buildDefaultData(): Array<{ month: string; revenue: number }> {
  return DEFAULT_MONTHS.map((m, i) => ({ month: m, revenue: DEFAULT_REVENUE[i] }));
}

type PeriodKey = '12' | '6' | '30';

const PERIOD_LABELS: Record<PeriodKey, string> = {
  '12': '12 Bulan',
  '6': '6 Bulan',
  '30': '30 Hari',
};

function getYAxisLabels(maxVal: number): number[] {
  const roundedMax = Math.ceil(maxVal / 10) * 10;
  const step = roundedMax / 4;
  return [0, step, step * 2, step * 3, roundedMax];
}

function buildAreaPath(points: { x: number; y: number }[], height: number): string {
  if (points.length < 2) return '';
  const top = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const bottom = `L${points[points.length - 1].x.toFixed(1)},${height} L${points[0].x.toFixed(1)},${height} Z`;
  return `${top} ${bottom}`;
}

function buildLinePath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const [period, setPeriod] = useState<PeriodKey>('12');

  const chartData = useMemo(() => {
    const source = data ?? buildDefaultData();
    const count = period === '30' ? 1 : period === '6' ? 6 : 12;
    return source.slice(-count);
  }, [data, period]);

  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);

  const maxVal = useMemo(() => Math.max(...chartData.map((d) => d.revenue), 1), [chartData]);
  const yLabels = useMemo(() => getYAxisLabels(maxVal), [maxVal]);

  // Chart dimensions
  const chartHeight = 225;
  const paddingLeft = 38;
  const paddingBottom = 24;
  const paddingTop = 8;
  const paddingRight = 0;
  const innerH = chartHeight - paddingTop - paddingBottom;
  const innerW = 600; // SVG viewBox width

  const points = useMemo(() => {
    return chartData.map((d, i) => {
      const x = (i / Math.max(chartData.length - 1, 1)) * (innerW - paddingLeft - paddingRight) + paddingLeft;
      const y = paddingTop + innerH - ((d.revenue - 0) / (maxVal || 1)) * innerH;
      return { x, y };
    });
  }, [chartData, maxVal, innerW, innerH, paddingLeft, paddingRight, paddingTop]);

  const areaPath = useMemo(() => buildAreaPath(points, chartHeight), [points, chartHeight]);
  const linePath = useMemo(() => buildLinePath(points), [points]);

  const tooltipData = tooltipIndex !== null ? chartData[tooltipIndex] : null;

  return (
    <Card
      sx={{
        borderRadius: '22px',
        border: '1px solid var(--dash-line)',
        boxShadow: 'var(--dash-shadow-soft)',
        background: '#ffffff',
      }}
    >
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Header row */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16, color: 'var(--dash-text)' }}>
            Revenue
          </Typography>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value as PeriodKey)}
              sx={{
                fontSize: 13,
                borderRadius: '10px',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--dash-line)' },
              }}
            >
              <MenuItem value="12">12 Bulan</MenuItem>
              <MenuItem value="6">6 Bulan</MenuItem>
              <MenuItem value="30">30 Hari</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Chart area */}
        <Box sx={{ position: 'relative', pl: `${paddingLeft}px`, pb: `${paddingBottom}px`, height: `${chartHeight}px` }}>
          {/* Y-axis labels and grid lines */}
          {yLabels.map((label, i) => {
            const yPos = paddingTop + innerH - (label / (maxVal || 1)) * innerH;
            return (
              <Box key={label}>
                {/* Grid line */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: `${paddingLeft}px`,
                    right: 0,
                    top: `${yPos}px`,
                    height: '1px',
                    bgcolor: 'var(--dash-line)',
                    opacity: 0.5,
                  }}
                />
                {/* Y-axis label */}
                <Typography
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: `${yPos - 6}px`,
                    fontSize: 10,
                    color: '#8a91a3',
                    lineHeight: 1,
                    width: `${paddingLeft - 6}px`,
                    textAlign: 'right',
                  }}
                >
                  {label}
                </Typography>
              </Box>
            );
          })}

          {/* SVG chart */}
          <svg
            viewBox={`0 0 ${innerW} ${chartHeight}`}
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--dash-primary)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--dash-primary)" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Area fill */}
            {areaPath && (
              <path d={areaPath} fill="url(#revenueGradient)" />
            )}

            {/* Line */}
            {linePath && (
              <path
                d={linePath}
                stroke="var(--dash-primary)"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            )}

            {/* Data points */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={4}
                fill="#ffffff"
                stroke="var(--dash-primary)"
                strokeWidth={2.5}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setTooltipIndex(i)}
                onMouseLeave={() => setTooltipIndex(null)}
              />
            ))}
          </svg>

          {/* Tooltip */}
          {tooltipData && tooltipIndex !== null && points[tooltipIndex] && (
            <Box
              sx={{
                position: 'absolute',
                left: `${points[tooltipIndex].x - 30}px`,
                top: `${points[tooltipIndex].y - 34}px`,
                bgcolor: '#1f2937',
                color: '#ffffff',
                borderRadius: '10px',
                px: 1.5,
                py: 0.6,
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            >
              {tooltipData.month}: {tooltipData.revenue}
            </Box>
          )}
        </Box>

        {/* Month labels */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: `${paddingLeft}px`, mt: '-8px' }}>
          {chartData.map((d, i) => (
            <Typography
              key={i}
              sx={{ fontSize: 10, color: '#8a91a3', lineHeight: 1 }}
            >
              {d.month}
            </Typography>
          ))}
        </Box>
      </Box>
    </Card>
  );
}
