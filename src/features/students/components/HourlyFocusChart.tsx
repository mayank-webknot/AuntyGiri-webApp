import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import type { HourlyFocusData } from '@/shared/types';

interface HourlyFocusChartProps {
  data: HourlyFocusData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{label}:00</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: <span className="font-semibold">{entry.value} min</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const HourlyFocusChart: React.FC<HourlyFocusChartProps> = ({ data }) => {
  // Ensure we have data for all 24 hours
  const chartData = Array.from({ length: 24 }, (_, hour) => {
    const existing = data.find((d) => d.hour === hour);
    return {
      hour,
      time: `${String(hour).padStart(2, '0')}:00`,
      focused: existing?.focusedMinutes || 0,
      idle: existing?.idleMinutes || 0,
      total: existing?.totalMinutes || 0,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorFocused" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorIdle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="time"
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
          interval={2}
        />
        <YAxis
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
          label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area
          type="monotone"
          dataKey="focused"
          stroke="#3B82F6"
          fillOpacity={1}
          fill="url(#colorFocused)"
          name="Focused"
        />
        <Area
          type="monotone"
          dataKey="idle"
          stroke="#9CA3AF"
          fillOpacity={1}
          fill="url(#colorIdle)"
          name="Idle"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
