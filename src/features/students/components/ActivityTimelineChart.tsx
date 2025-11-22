import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { ActivityTimelineItem } from '@/shared/types';
import { format, parseISO, startOfDay, addMinutes } from 'date-fns';

interface ActivityTimelineChartProps {
  activities: ActivityTimelineItem[];
}

interface TimelineDataPoint {
  time: string; // HH:mm format
  hour: number;
  minute: number;
  activities: {
    app: string;
    duration: number;
    productivity: string;
    startTime: string;
    endTime: string;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {data.activities && data.activities.length > 0 ? (
          <div className="space-y-1">
            {data.activities.map((activity: any, index: number) => (
              <div key={index} className="text-sm">
                <span className="font-medium">{activity.app}</span>
                <span className="text-gray-600 ml-2">
                  ({activity.duration} min)
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No activity</p>
        )}
      </div>
    );
  }
  return null;
};

export const ActivityTimelineChart: React.FC<ActivityTimelineChartProps> = ({ activities }) => {
  // Generate 24-hour timeline data
  const timelineData = useMemo(() => {
    const data: TimelineDataPoint[] = [];
    const dayStart = startOfDay(new Date());

    // Initialize all hours with empty activities
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = addMinutes(dayStart, hour * 60 + minute);
        data.push({
          time: format(time, 'HH:mm'),
          hour,
          minute,
          activities: [],
        });
      }
    }

    // Map activities to time slots
    activities.forEach((activity) => {
      const start = parseISO(activity.startTime);
      const end = parseISO(activity.endTime);

      // Find matching time slots and add activity
      data.forEach((slot) => {
        const slotTime = addMinutes(dayStart, slot.hour * 60 + slot.minute);
        const slotEndTime = addMinutes(slotTime, 15);

        if (
          (slotTime >= start && slotTime < end) ||
          (slotEndTime > start && slotEndTime <= end) ||
          (slotTime <= start && slotEndTime >= end)
        ) {
          slot.activities.push({
            app: activity.app,
            duration: activity.duration,
            productivity: activity.productivity,
            startTime: activity.startTime,
            endTime: activity.endTime,
          });
        }
      });
    });

    // Group by hour for display
    const hourlyData: { [key: number]: TimelineDataPoint[] } = {};
    data.forEach((point) => {
      if (!hourlyData[point.hour]) {
        hourlyData[point.hour] = [];
      }
      hourlyData[point.hour].push(point);
    });

    // Convert to array and calculate average productivity per hour
    return Object.keys(hourlyData).map((hour) => {
      const hourPoints = hourlyData[Number(hour)];
      const hasActivity = hourPoints.some((p) => p.activities.length > 0);
      const totalDuration = hourPoints.reduce(
        (sum, p) => sum + p.activities.reduce((s, a) => s + a.duration, 0),
        0
      );
      const productivity = hourPoints.find((p) => p.activities.length > 0)?.activities[0]
        ?.productivity || 'idle';

      return {
        hour: Number(hour),
        time: `${String(hour).padStart(2, '0')}:00`,
        hasActivity,
        totalDuration,
        productivity,
        activities: hourPoints.flatMap((p) => p.activities),
      };
    });
  }, [activities]);

  const getBarColor = (productivity: string) => {
    switch (productivity) {
      case 'productive':
        return '#10B981'; // green
      case 'neutral':
        return '#F59E0B'; // yellow
      case 'unproductive':
        return '#EF4444'; // red
      default:
        return '#9CA3AF'; // gray (idle)
    }
  };

  const chartData = timelineData.map((point) => ({
    time: point.time,
    duration: point.hasActivity ? point.totalDuration : 0,
    productivity: point.productivity,
    activities: point.activities,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
        <Bar dataKey="duration" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.productivity)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
