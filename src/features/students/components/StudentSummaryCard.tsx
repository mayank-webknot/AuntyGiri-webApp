import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Clock, Target, AlertTriangle, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';

interface SummaryCardProps {
  title: string;
  isLoading: boolean;
  type: 'focus' | 'productive' | 'warnings' | 'screenshots';
  data?: any;
}

export const StudentSummaryCard: React.FC<SummaryCardProps> = ({
  title,
  isLoading,
  type,
  data,
}) => {

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-3 w-48" />
        </CardContent>
      </Card>
    );
  }

  const getIcon = () => {
    switch (type) {
      case 'focus':
        return <Clock className="h-5 w-5 text-white" />;
      case 'productive':
        return <Target className="h-5 w-5 text-white" />;
      case 'warnings':
        return <AlertTriangle className="h-5 w-5 text-white" />;
      case 'screenshots':
        return <Camera className="h-5 w-5 text-white" />;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'focus':
        return 'bg-blue-500';
      case 'productive':
        return 'bg-green-500';
      case 'warnings':
        return 'bg-orange-500';
      case 'screenshots':
        return 'bg-purple-500';
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'focus':
        if (!data) return null;
        const focusHours = Math.floor(data.totalMinutes / 60);
        const focusMins = data.totalMinutes % 60;
        const progress = (data.totalMinutes / data.dailyGoal) * 100;
        const getTrendIcon = () => {
          if (data.trendType === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
          if (data.trendType === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
          return <Minus className="h-4 w-4 text-gray-600" />;
        };
        const getTrendColor = () => {
          if (data.trendType === 'up') return 'text-green-600';
          if (data.trendType === 'down') return 'text-red-600';
          return 'text-gray-600';
        };
        return (
          <>
            <div className="text-2xl font-bold">
              {focusHours}h {focusMins}m
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600">Progress: {data.totalMinutes}/{data.dailyGoal} min</span>
                <span className={getTrendColor()}>
                  {getTrendIcon()}
                  <span className="ml-1">{Math.abs(data.trend)}%</span>
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          </>
        );

      case 'productive':
        if (!data) return null;
        return (
          <>
            <div className="text-2xl font-bold">{data.percentage}%</div>
            <div className="mt-2">
              <div className="text-sm text-gray-600 mb-1">
                {data.hours}h {data.minutes}m productive
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${data.percentage}%` }}
                />
              </div>
            </div>
          </>
        );

      case 'warnings':
        if (!data) return null;
        return (
          <>
            <div className="text-2xl font-bold">{data.total}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="high">{data.high} High</Badge>
              <Badge variant="medium">{data.medium} Medium</Badge>
              <Badge variant="low">{data.low} Low</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full"
              onClick={() => {
                // Navigate to alerts tab
                console.log('View warnings');
              }}
            >
              View Details
            </Button>
          </>
        );

      case 'screenshots':
        if (!data) return null;
        return (
          <>
            <div className="text-2xl font-bold">{data.total}</div>
            <div className="mt-2 text-sm text-gray-600">
              {data.today} taken today
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full"
              onClick={() => {
                // Navigate to screenshots tab
                console.log('View gallery');
              }}
            >
              View Gallery
            </Button>
          </>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
          <div className={`h-8 w-8 rounded-full ${getIconColor()} flex items-center justify-center`}>
            {getIcon()}
          </div>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </motion.div>
  );
};
