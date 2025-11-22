import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Skeleton } from '@/shared/components/ui/skeleton';
import type { DashboardAlert } from '@/shared/types';
import { formatDistanceToNow } from 'date-fns';

interface RecentAlertsPanelProps {
  alerts: DashboardAlert[];
  isLoading: boolean;
  onViewAll?: () => void;
}

const AlertItem: React.FC<{ alert: DashboardAlert }> = ({ alert }) => {
  const getSeverityBadge = () => {
    switch (alert.severity) {
      case 'high':
        return <Badge variant="high">High</Badge>;
      case 'medium':
        return <Badge variant="medium">Medium</Badge>;
      case 'low':
        return <Badge variant="low">Low</Badge>;
      default:
        return <Badge variant="secondary">{alert.severity}</Badge>;
    }
  };

  const getSeverityIconColor = () => {
    switch (alert.severity) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-600';
      case 'low':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-start justify-between space-x-2">
        <div className="flex items-start space-x-2 flex-1 min-w-0">
          <AlertTriangle className={`h-4 w-4 mt-0.5 ${getSeverityIconColor()} flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {alert.studentName}
              </p>
              {getSeverityBadge()}
            </div>
            <p className="text-xs text-gray-600 truncate">
              {alert.alertType}
            </p>
            {alert.message && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {alert.message}
              </p>
            )}
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const RecentAlertsPanel: React.FC<RecentAlertsPanelProps> = ({
  alerts,
  isLoading,
  onViewAll,
}) => {
  const recentAlerts = alerts.slice(0, 5);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-2">
                <Skeleton className="h-4 w-4 rounded-full mt-1" />
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

  if (!alerts || alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No alerts</p>
            <p className="text-xs mt-1">All clear! No alerts to display.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-0">
            {recentAlerts.map((alert) => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </div>
        </ScrollArea>
        {alerts.length > 5 && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={onViewAll}
            >
              <span>View All Alerts ({alerts.length})</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
