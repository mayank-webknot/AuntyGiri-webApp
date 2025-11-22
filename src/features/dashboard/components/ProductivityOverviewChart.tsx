import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Select } from '@/shared/components/ui/select';
import { Skeleton } from '@/shared/components/ui/skeleton';
import type { ProductivityData, DateRange } from '@/shared/types';
import { format, parseISO } from 'date-fns';

interface ProductivityOverviewChartProps {
  data: ProductivityData[];
  isLoading: boolean;
  onDateRangeChange?: (range: DateRange) => void;
}

const DateRangeSelector: React.FC<{
  value: DateRange;
  onChange: (range: DateRange) => void;
}> = ({ value, onChange }) => {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as DateRange)}
      className="w-48"
    >
      <option value="today">Today</option>
      <option value="last7days">Last 7 Days</option>
      <option value="last30days">Last 30 Days</option>
    </Select>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: <span className="font-semibold">{entry.value}%</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ProductivityOverviewChart: React.FC<ProductivityOverviewChartProps> = ({
  data,
  isLoading,
  onDateRangeChange,
}) => {
  const [dateRange, setDateRange] = useState<DateRange>('last7days');

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    if (onDateRangeChange) {
      onDateRangeChange(range);
    }
  };

  const formatChartData = () => {
    if (!data || data.length === 0) return [];

    return data.map((item) => {
      const date = parseISO(item.date);
      let formattedDate: string;

      if (dateRange === 'today') {
        formattedDate = format(date, 'HH:mm');
      } else if (dateRange === 'last7days') {
        formattedDate = format(date, 'EEE');
      } else {
        formattedDate = format(date, 'MMM dd');
      }

      return {
        date: formattedDate,
        'Class Average': item.classAverage,
        'Top Performers': item.topPerformers,
        'Needs Attention': item.needsAttention,
      };
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = formatChartData();

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Productivity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <p>No productivity data available</p>
            <p className="text-sm mt-2">Productivity data will appear here once available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Productivity Overview</CardTitle>
          <DateRangeSelector
            value={dateRange}
            onChange={handleDateRangeChange}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorClassAverage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorTopPerformers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorNeedsAttention" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
              label={{ value: 'Productivity %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="Class Average"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorClassAverage)"
            />
            <Area
              type="monotone"
              dataKey="Top Performers"
              stroke="#10B981"
              fillOpacity={1}
              fill="url(#colorTopPerformers)"
            />
            <Area
              type="monotone"
              dataKey="Needs Attention"
              stroke="#EF4444"
              fillOpacity={1}
              fill="url(#colorNeedsAttention)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
