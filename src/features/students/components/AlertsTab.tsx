import React, { useState, useMemo, useEffect } from 'react';
import { format, formatDistanceToNow, startOfDay, subDays, isToday, isYesterday } from 'date-fns';
import {
  AlertTriangle,
  Globe,
  Clock,
  TrendingDown,
  CheckCircle,
  XCircle,
  Eye,
  Send,
  UserPlus,
  Flag,
  Search,
} from 'lucide-react';
import {
  useGetStudentActivitiesQuery,
  useGetStudentActivitiesSummaryQuery,
} from '../services/studentDetailApi';
import { useGetWebsiteUsageQuery } from '../services/appsWebsitesApi';
import { detectAlerts } from '../services/alertDetection';
import type { Alert, AlertSeverity, AlertStatus } from '@/shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Select } from '@/shared/components/ui/select';

interface AlertsTabProps {
  studentId: string;
  studentName: string;
  selectedDate: Date;
}

export const AlertsTab: React.FC<AlertsTabProps> = ({
  studentId,
  studentName,
  selectedDate,
}) => {
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'all'>('all');
  const [startDate, setStartDate] = useState<string>(
    format(subDays(selectedDate, 7), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState<string>(
    format(selectedDate, 'yyyy-MM-dd')
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [resolvedAlerts, setResolvedAlerts] = useState<Set<string>>(new Set());

  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  // Fetch data for alert detection
  const { data: activitiesData } = useGetStudentActivitiesQuery({
    userId: studentId,
    startDate: format(subDays(selectedDate, 7), 'yyyy-MM-dd'),
    endDate: dateStr,
  });

  const { data: websitesData } = useGetWebsiteUsageQuery({
    limit: 100,
    startDate: format(subDays(selectedDate, 7), 'yyyy-MM-dd'),
    userId: studentId,
  });

  const { data: summaryData } = useGetStudentActivitiesSummaryQuery(studentId);

  // Detect alerts
  useEffect(() => {
    if (activitiesData?.data && websitesData?.data) {
      const detected = detectAlerts({
        studentId,
        studentName,
        websites: websitesData.data,
        activities: activitiesData.data.activities || [],
        productivityScore: undefined, // TODO: Get from summary API
      });
      setAlerts(detected);
    }
  }, [activitiesData, websitesData, summaryData, studentId, studentName]);

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    let filtered = alerts.filter((alert) => {
      const alertDate = format(new Date(alert.timestamp), 'yyyy-MM-dd');
      return alertDate >= startDate && alertDate <= endDate;
    });

    if (severityFilter !== 'all') {
      filtered = filtered.filter((a) => a.severity === severityFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((a) => {
        const status = resolvedAlerts.has(a.id) ? 'resolved' : 'unresolved';
        return status === statusFilter;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter((a) =>
        a.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [alerts, severityFilter, statusFilter, startDate, endDate, searchTerm, resolvedAlerts]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const today = startOfDay(new Date());
    const weekAgo = subDays(today, 7);
    const monthAgo = subDays(today, 30);

    const todayAlerts = alerts.filter((a) => {
      const alertDate = startOfDay(new Date(a.timestamp));
      return alertDate.getTime() === today.getTime();
    });

    const weekAlerts = alerts.filter((a) => {
      const alertDate = new Date(a.timestamp);
      return alertDate >= weekAgo && alertDate <= today;
    });

    const monthAlerts = alerts.filter((a) => {
      const alertDate = new Date(a.timestamp);
      return alertDate >= monthAgo && alertDate <= today;
    });

    const lastWeekAlerts = alerts.filter((a) => {
      const alertDate = new Date(a.timestamp);
      return alertDate >= subDays(weekAgo, 7) && alertDate < weekAgo;
    });

    const lastMonthAlerts = alerts.filter((a) => {
      const alertDate = new Date(a.timestamp);
      return alertDate >= subDays(monthAgo, 30) && alertDate < monthAgo;
    });

    const weekTrend =
      lastWeekAlerts.length > 0
        ? ((weekAlerts.length - lastWeekAlerts.length) / lastWeekAlerts.length) * 100
        : 0;

    const monthTrend =
      lastMonthAlerts.length > 0
        ? ((monthAlerts.length - lastMonthAlerts.length) / lastMonthAlerts.length) * 100
        : 0;

    return {
      today: {
        total: todayAlerts.length,
        high: todayAlerts.filter((a) => a.severity === 'high').length,
        medium: todayAlerts.filter((a) => a.severity === 'medium').length,
        low: todayAlerts.filter((a) => a.severity === 'low').length,
      },
      thisWeek: {
        total: weekAlerts.length,
        high: weekAlerts.filter((a) => a.severity === 'high').length,
        medium: weekAlerts.filter((a) => a.severity === 'medium').length,
        low: weekAlerts.filter((a) => a.severity === 'low').length,
        trend: weekTrend,
      },
      thisMonth: {
        total: monthAlerts.length,
        high: monthAlerts.filter((a) => a.severity === 'high').length,
        medium: monthAlerts.filter((a) => a.severity === 'medium').length,
        low: monthAlerts.filter((a) => a.severity === 'low').length,
        trend: monthTrend,
      },
    };
  }, [alerts]);

  // Group alerts by date
  const groupedAlerts = useMemo(() => {
    const groups: { [key: string]: Alert[] } = {};

    filteredAlerts.forEach((alert) => {
      const date = new Date(alert.timestamp);
      let groupKey: string;

      if (isToday(date)) {
        groupKey = 'Today';
      } else if (isYesterday(date)) {
        groupKey = 'Yesterday';
      } else if (date >= subDays(new Date(), 7)) {
        groupKey = 'This Week';
      } else if (date >= subDays(new Date(), 30)) {
        groupKey = 'This Month';
      } else {
        groupKey = format(date, 'MMMM yyyy');
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(alert);
    });

    return groups;
  }, [filteredAlerts]);

  const markResolved = (alertId: string) => {
    setResolvedAlerts((prev) => new Set([...prev, alertId]));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'bad_website':
        return <Globe className="h-5 w-5" />;
      case 'extended_idle':
        return <Clock className="h-5 w-5" />;
      case 'low_productivity':
        return <TrendingDown className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-600 text-white';
      case 'medium':
        return 'bg-orange-500 text-white';
      case 'low':
        return 'bg-yellow-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AlertStatsCard
          title="Today's Alerts"
          stats={statistics.today}
          isLoading={!activitiesData}
        />
        <AlertStatsCard
          title="This Week"
          stats={statistics.thisWeek}
          trend={statistics.thisWeek.trend}
          isLoading={!activitiesData}
        />
        <AlertStatsCard
          title="This Month"
          stats={statistics.thisMonth}
          trend={statistics.thisMonth.trend}
          isLoading={!activitiesData}
        />
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Severity
              </label>
              <Select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as AlertSeverity | 'all')}
              >
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status
              </label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as AlertStatus | 'all')}
              >
                <option value="all">All</option>
                <option value="unresolved">Unresolved</option>
                <option value="resolved">Resolved</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Timeline */}
      <div className="space-y-6">
        {Object.keys(groupedAlerts).length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No alerts found for selected filters</p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedAlerts).map(([groupKey, groupAlerts]) => (
            <div key={groupKey}>
              <h3 className="text-lg font-semibold mb-4">{groupKey}</h3>
              <div className="space-y-4">
                {groupAlerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    isResolved={resolvedAlerts.has(alert.id)}
                    onResolve={() => markResolved(alert.id)}
                    onViewStudent={() => console.log('View student:', alert.studentId)}
                    onViewScreenshot={() => console.log('View screenshot:', alert.details?.screenshotId)}
                    getAlertIcon={getAlertIcon}
                    getSeverityColor={getSeverityColor}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Alert Statistics Card Component
interface AlertStatsCardProps {
  title: string;
  stats: {
    total: number;
    high: number;
    medium: number;
    low: number;
    trend?: number;
  };
  trend?: number;
  isLoading: boolean;
}

const AlertStatsCard: React.FC<AlertStatsCardProps> = ({ title, stats, trend, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-48" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">{stats.total}</div>
        <div className="flex space-x-2 mb-2">
          <Badge variant="high" className="text-xs">
            {stats.high} High
          </Badge>
          <Badge variant="medium" className="text-xs">
            {stats.medium} Medium
          </Badge>
          <Badge variant="low" className="text-xs">
            {stats.low} Low
          </Badge>
        </div>
        {trend !== undefined && (
          <div className={`text-xs flex items-center ${trend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}% vs previous period
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Alert Card Component
interface AlertCardProps {
  alert: Alert;
  isResolved: boolean;
  onResolve: () => void;
  onViewStudent: () => void;
  onViewScreenshot: () => void;
  getAlertIcon: (type: string) => React.ReactNode;
  getSeverityColor: (severity: AlertSeverity) => string;
}

const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  isResolved,
  onResolve,
  onViewStudent,
  onViewScreenshot,
  getAlertIcon,
  getSeverityColor,
}) => {
  return (
    <Card className={isResolved ? 'opacity-60' : ''}>
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
            {getAlertIcon(alert.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Badge className={getSeverityColor(alert.severity)}>
                  {alert.severity.toUpperCase()}
                </Badge>
                {isResolved && (
                  <Badge variant="secondary">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Resolved
                  </Badge>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
              </span>
            </div>
            <p className="font-medium mb-1">{alert.studentName}</p>
            <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
            {alert.details && (
              <div className="text-xs text-gray-500 space-y-1 mb-3">
                {alert.details.websiteUrl && (
                  <p>Website: {alert.details.websiteUrl}</p>
                )}
                {alert.details.duration && (
                  <p>Duration: {alert.details.duration} minutes</p>
                )}
                {alert.details.productivityScore !== undefined && (
                  <p>Productivity: {alert.details.productivityScore}%</p>
                )}
              </div>
            )}
            {alert.details?.screenshotUrl && (
              <div className="mb-3">
                <img
                  src={alert.details.screenshotUrl}
                  alt="Alert screenshot"
                  className="w-32 h-20 object-cover rounded cursor-pointer"
                  onClick={onViewScreenshot}
                />
              </div>
            )}
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={onViewStudent}>
                <Eye className="h-4 w-4 mr-1" />
                View Student
              </Button>
              {alert.details?.screenshotId && (
                <Button variant="outline" size="sm" onClick={onViewScreenshot}>
                  View Screenshot
                </Button>
              )}
              {!isResolved && (
                <Button variant="outline" size="sm" onClick={onResolve}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark Resolved
                </Button>
              )}
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-1" />
                Assign Warning
              </Button>
              <Button variant="outline" size="sm">
                <Send className="h-4 w-4 mr-1" />
                Notify Parent
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
