import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Skeleton } from '@/shared/components/ui/skeleton';
import type { Activity } from '@/shared/types';
import { formatDistanceToNow } from 'date-fns';

interface LiveActivityFeedProps {
  activities: Activity[];
  isLoading: boolean;
  onActivityClick?: (activity: Activity) => void;
}

const ActivityItem: React.FC<{
  activity: Activity;
  onClick?: () => void;
}> = ({ activity, onClick }) => {
  const getIndicatorColor = () => {
    switch (activity.productivityIndicator) {
      case 'productive':
        return 'bg-green-500';
      case 'neutral':
        return 'bg-yellow-500';
      case 'flagged':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getIndicatorLabel = () => {
    switch (activity.productivityIndicator) {
      case 'productive':
        return 'Productive';
      case 'neutral':
        return 'Neutral';
      case 'flagged':
        return 'Flagged';
      default:
        return 'Unknown';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onClick={onClick}
      className={`p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${
        activity.productivityIndicator === 'flagged' ? 'bg-red-50' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className={`mt-1 h-3 w-3 rounded-full ${getIndicatorColor()}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 truncate">
              {activity.studentName}
            </p>
            <span className="text-xs text-gray-500 ml-2">
              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1 truncate">
            {activity.currentApp} - {activity.activity}
          </p>
          <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{activity.duration}</span>
            </div>
            <div className="flex items-center">
              <Circle className={`h-3 w-3 mr-1 ${getIndicatorColor()}`} />
              <span>{getIndicatorLabel()}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({
  activities,
  isLoading,
  onActivityClick,
}) => {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current && activities.length > 0) {
      scrollAreaRef.current.scrollTop = 0;
    }
  }, [activities]);

  const handleActivityClick = (activity: Activity) => {
    if (onActivityClick) {
      onActivityClick(activity);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="h-3 w-3 rounded-full mt-1" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <p>No activities to display</p>
            <p className="text-sm mt-2">Student activities will appear here as they happen</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Live Activity Feed</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]" ref={scrollAreaRef}>
          <AnimatePresence>
            {activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                onClick={() => handleActivityClick(activity)}
              />
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
