import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useAppSelector } from '@/app/store/hooks';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  useGetDashboardSummaryQuery,
  useGetDashboardTimelineQuery,
} from '../services/dashboardApi';
import { HeroMetrics } from './HeroMetrics';
import { LiveActivityFeed } from './LiveActivityFeed';
import { RecentAlertsPanel } from './RecentAlertsPanel';
import { ProductivityOverviewChart } from './ProductivityOverviewChart';
import type { Activity, DashboardAlert, DateRange } from '@/shared/types';
import { format, startOfDay } from 'date-fns';

export const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { logout } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange>('last7days');
  const [selectedDate, setSelectedDate] = useState<string>(
    format(startOfDay(new Date()), 'yyyy-MM-dd')
  );

  // Fetch dashboard summary
  const {
    data: summaryData,
    isLoading: summaryLoading,
    refetch: refetchSummary,
  } = useGetDashboardSummaryQuery();

  // Fetch timeline data
  const {
    data: timelineData,
    isLoading: timelineLoading,
    refetch: refetchTimeline,
  } = useGetDashboardTimelineQuery({
    date: selectedDate,
    interval: dateRange === 'today' ? 'hour' : 'day',
  });

  // Auto-refresh data every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchSummary();
      refetchTimeline();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [refetchSummary, refetchTimeline]);

  // Transform timeline data into activities and alerts
  const activities: Activity[] = timelineData?.data?.activities || [];
  
  // Generate mock alerts from summary if available
  const alerts: DashboardAlert[] = useMemo(() => {
    if (!summaryData?.data) return [];
    
    const { alertsToday } = summaryData.data;
    const alertTypes = ['Productivity Drop', 'Inactive Session', 'App Usage Alert'];
    const students = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams', 'Charlie Brown'];
    const generatedAlerts: Alert[] = [];

    for (let i = 0; i < Math.min(5, alertsToday.total); i++) {
      generatedAlerts.push({
        id: `alert-${i}`,
        studentName: students[i % students.length],
        alertType: alertTypes[i % alertTypes.length],
        severity: i === 0 ? 'high' : i === 1 ? 'medium' : 'low',
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        message: `Alert for ${students[i % students.length]}`,
      });
    }
    
    return generatedAlerts;
  }, [summaryData]);

  const handleActivityClick = (_activity: Activity) => {
    // Navigate to student details
    console.log('View student details for:', activity.studentName);
    // navigate(`/students/${activity.id}`);
  };

  const handleViewAllAlerts = () => {
    // Navigate to alerts page
    console.log('View all alerts');
    // navigate('/alerts');
  };

  const handleDateRangeChange = (_range: DateRange) => {
    setDateRange(range);
    // Update selected date based on range
    if (range === 'today') {
      setSelectedDate(format(startOfDay(new Date()), 'yyyy-MM-dd'));
    } else if (range === 'last7days') {
      setSelectedDate(format(startOfDay(new Date()), 'yyyy-MM-dd'));
    } else {
      setSelectedDate(format(startOfDay(new Date()), 'yyyy-MM-dd'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <HeroMetrics
            data={summaryData?.data}
            isLoading={summaryLoading}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Productivity Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ProductivityOverviewChart
                data={timelineData?.data?.productivityData || []}
                isLoading={timelineLoading}
                onDateRangeChange={handleDateRangeChange}
              />
            </motion.div>

            {/* Live Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <LiveActivityFeed
                activities={activities}
                isLoading={timelineLoading}
                onActivityClick={handleActivityClick}
              />
            </motion.div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <RecentAlertsPanel
                alerts={alerts}
                isLoading={summaryLoading}
                onViewAll={handleViewAllAlerts}
              />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};
