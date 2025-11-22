import { useEffect, useState } from 'react';
import { MetricCard } from '@/components/MetricCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
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
  const [summary, setSummary] = useState<DashboardSummary>(mockSummary);
  const [activityData, setActivityData] = useState<ActivityData[]>(mockActivityData);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>(mockAlerts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch real data from API
    // fetchDashboardData();
  }, []);

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
