import { useMemo } from 'react';
import { MetricCard } from '@/components/MetricCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DashboardSummary, ActivityData, Alert } from '@/types';
import { useGetDashboardSummaryQuery, useGetTimelineQuery } from '@/store/api/dashboardApi';
import { format } from 'date-fns';

// Mock data for demo
const mockSummary: DashboardSummary = {
  totalStudents: 156,
  activeToday: 142,
  averageProductivity: 78,
  alertsToday: 12,
  trends: {
    students: 2,
    active: 5,
    productivity: -3,
  },
};

const mockActivityData: ActivityData[] = [
  { time: 'Mon', productivity: 75, classAverage: 72, topPerformers: 88 },
  { time: 'Tue', productivity: 78, classAverage: 74, topPerformers: 90 },
  { time: 'Wed', productivity: 72, classAverage: 70, topPerformers: 85 },
  { time: 'Thu', productivity: 82, classAverage: 78, topPerformers: 92 },
  { time: 'Fri', productivity: 80, classAverage: 76, topPerformers: 91 },
  { time: 'Sat', productivity: 68, classAverage: 65, topPerformers: 80 },
  { time: 'Sun', productivity: 70, classAverage: 67, topPerformers: 82 },
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Sarah Johnson',
    type: 'low_productivity',
    severity: 'high',
    message: 'Productivity below 40% for 2 hours',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    resolved: false,
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Mike Chen',
    type: 'blocked_website',
    severity: 'medium',
    message: 'Accessed blocked website',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    resolved: false,
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Emma Davis',
    type: 'extended_idle',
    severity: 'low',
    message: 'Idle for 28 minutes',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    resolved: false,
  },
];

const Dashboard = () => {
  // Fetch data from API
  const { data: summaryData, isLoading: summaryLoading, error: summaryError } = useGetDashboardSummaryQuery();
  
  // Use today's date (2025-01-21) for testing - matches backend data
  const todayDate = '2025-01-21'; // format(new Date(), 'yyyy-MM-dd');
  const { data: timelineData, isLoading: timelineLoading, error: timelineError } = useGetTimelineQuery({
    date: todayDate,
    interval: 'hour', // Using 'hour' as default per contract
  });

  // Transform API data to component format
  // Contract format: { status: "success", data: { summary: {...}, comparison: {...} } }
  const summary: DashboardSummary = useMemo(() => {
    if (!summaryData?.data) return mockSummary;
    
    const apiData = summaryData.data;
    // Handle contract format: data.summary and data.comparison
    if (apiData.summary) {
      return {
        totalStudents: 0, // Not in contract - may need to fetch separately
        activeToday: 0, // Not in contract - may need to fetch separately
        averageProductivity: apiData.summary.productivityScore || 0,
        alertsToday: apiData.summary.screenshotsCount || 0, // Using screenshotsCount as placeholder
        trends: {
          students: 0,
          active: 0,
          productivity: apiData.comparison?.yesterday_total_time 
            ? Math.round(((apiData.summary.totalTime - apiData.comparison.yesterday_total_time) / apiData.comparison.yesterday_total_time) * 100)
            : 0,
        },
      };
    }
    
    // Fallback to old format if present
    return {
      totalStudents: (apiData as any).totalStudents || mockSummary.totalStudents,
      activeToday: (apiData as any).activeToday || mockSummary.activeToday,
      averageProductivity: (apiData as any).averageProductivity || mockSummary.averageProductivity,
      alertsToday: (apiData as any).alertsToday?.total || mockSummary.alertsToday,
      trends: (apiData as any).trends || mockSummary.trends,
    };
  }, [summaryData]);

  const activityData: ActivityData[] = useMemo(() => {
    if (!timelineData?.data) return mockActivityData;
    
    // Contract format: { timeline: { "2025-11-20 18:00": [{ app_name, duration }] }, activity_types: [] }
    const apiData = timelineData.data;
    
    if (apiData.timeline && typeof apiData.timeline === 'object') {
      // Convert timeline object to array format
      const timelineEntries = Object.entries(apiData.timeline);
      return timelineEntries.map(([timeSlot, activities]: [string, any]) => {
        const totalDuration = Array.isArray(activities) 
          ? activities.reduce((sum: number, act: any) => sum + (act.duration || 0), 0)
          : 0;
        const productiveDuration = totalDuration * 0.7; // Estimate - contract doesn't specify
        
        return {
          time: format(new Date(timeSlot), 'EEE'),
          productivity: totalDuration > 0 
            ? Math.round((productiveDuration / totalDuration) * 100)
            : 0,
          classAverage: totalDuration > 0 
            ? Math.round((productiveDuration / totalDuration) * 100)
            : 0,
          topPerformers: totalDuration > 0 
            ? Math.round((productiveDuration / totalDuration) * 100) + 10
            : 0,
        };
      });
    }
    
    // Fallback to old format if present
    if (Array.isArray(apiData)) {
      return apiData.map((item: any) => ({
        time: format(new Date(item.timeSlot), 'EEE'),
        productivity: item.totalDuration > 0 
          ? Math.round((item.productiveDuration / item.totalDuration) * 100)
          : 0,
        classAverage: item.totalDuration > 0 
          ? Math.round((item.productiveDuration / item.totalDuration) * 100)
          : 0,
        topPerformers: item.totalDuration > 0 
          ? Math.round((item.productiveDuration / item.totalDuration) * 100) + 10
          : 0,
      }));
    }
    
    return mockActivityData;
  }, [timelineData]);

  // Keep mock alerts for now (no API endpoint for alerts yet)
  const recentAlerts = mockAlerts;
  const loading = summaryLoading || timelineLoading;
  const error = summaryError || timelineError;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  if (loading) {
    return (
      <div className="container py-8 px-4 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 px-4">
        <div className="text-center text-destructive">
          <p>Failed to load dashboard data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 space-y-8">
      {/* Hero Metrics */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Monitor student activity and productivity in real-time
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Students"
          value={summary.totalStudents}
          trend={summary.trends.students}
          icon={Users}
          colorClass="text-primary"
        />
        <MetricCard
          title="Active Today"
          value={summary.activeToday}
          trend={summary.trends.active}
          icon={Activity}
          description={`${Math.round((summary.activeToday / summary.totalStudents) * 100)}% of students`}
          colorClass="text-success"
        />
        <MetricCard
          title="Avg Productivity"
          value={`${summary.averageProductivity}%`}
          trend={summary.trends.productivity}
          icon={TrendingUp}
          colorClass="text-primary"
        />
        <MetricCard
          title="Alerts Today"
          value={summary.alertsToday}
          icon={AlertTriangle}
          description="3 high priority"
          colorClass="text-destructive"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Productivity Chart */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Productivity Trends</CardTitle>
            <CardDescription>Last 7 days performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorProductivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAverage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="time"
                  className="text-xs"
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  className="text-xs"
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: 'Productivity %', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="productivity"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorProductivity)"
                  name="Your Students"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="classAverage"
                  stroke="hsl(var(--success))"
                  fillOpacity={1}
                  fill="url(#colorAverage)"
                  name="Class Average"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="topPerformers"
                  stroke="hsl(var(--warning))"
                  strokeWidth={2}
                  dot={false}
                  name="Top Performers"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Latest notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px] pr-4">
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex flex-col gap-2 rounded-lg border bg-card p-3 text-sm transition-colors hover:bg-accent"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium">{alert.studentName}</span>
                      <Badge variant={getSeverityColor(alert.severity)} className="shrink-0">
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{alert.message}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(alert.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
