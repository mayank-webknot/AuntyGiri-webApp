import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Users, Activity, Target, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import type { DashboardSummary } from '@/shared/types';

interface HeroMetricsProps {
  data: DashboardSummary | undefined;
  isLoading: boolean;
}

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  trend?: number;
  trendType?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  iconColor: string;
  trendLabel?: string;
  subtitle?: string;
  showProgressBar?: boolean;
  progressValue?: number;
}> = ({ title, value, trend, trendType, icon, iconColor, trendLabel, subtitle, showProgressBar, progressValue }) => {
  const getTrendIcon = () => {
    if (!trendType || trendType === 'neutral') return <Minus className="h-4 w-4" />;
    return trendType === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getTrendColor = () => {
    if (!trendType || trendType === 'neutral') return 'text-gray-600';
    return trendType === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <div className={`h-8 w-8 rounded-full ${iconColor} flex items-center justify-center`}>
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {showProgressBar && progressValue !== undefined && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressValue}%` }}
                />
              </div>
            </div>
          )}
          {trend !== undefined && trendLabel && (
            <div className={`flex items-center mt-2 text-xs ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="ml-1">
                {Math.abs(trend)}% {trendLabel}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const HeroMetrics: React.FC<HeroMetricsProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            No data available
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Students"
        value={data.totalStudents.count.toLocaleString()}
        trend={data.totalStudents.trend}
        trendType={data.totalStudents.trendType}
        trendLabel="vs last week"
        icon={<Users className="h-5 w-5 text-white" />}
        iconColor="bg-blue-500"
      />
      
      <MetricCard
        title="Active Today"
        value={data.activeToday.count}
        subtitle={`${data.activeToday.percentage}% of total`}
        trend={data.activeToday.trend}
        trendType={data.activeToday.trendType}
        trendLabel="vs yesterday"
        icon={<Activity className="h-5 w-5 text-white" />}
        iconColor="bg-green-500"
      />
      
      <MetricCard
        title="Average Productivity Score"
        value={`${data.averageProductivity.score}%`}
        trend={data.averageProductivity.trend}
        trendType={data.averageProductivity.trendType}
        trendLabel="vs yesterday"
        icon={<Target className="h-5 w-5 text-white" />}
        iconColor="bg-purple-500"
        showProgressBar={true}
        progressValue={data.averageProductivity.score}
      />
      
      <MetricCard
        title="Alerts Today"
        value={data.alertsToday.total}
        subtitle={`${data.alertsToday.high} High, ${data.alertsToday.medium} Medium, ${data.alertsToday.low} Low`}
        icon={<AlertTriangle className="h-5 w-5 text-white" />}
        iconColor="bg-orange-500"
      />
    </div>
  );
};
