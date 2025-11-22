import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useGetActivitiesQuery } from '@/store/api/monitorApi';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Alert {
  id: string;
  studentId: string;
  studentName: string;
  type: 'low_productivity' | 'blocked_website' | 'extended_idle' | 'unproductive_app' | 'flagged_activity';
  severity: 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
  resolved: boolean;
  activityId?: string;
  appName?: string;
  website?: string;
}

const Alerts = () => {
  const [severityFilter, setSeverityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [resolvedFilter, setResolvedFilter] = useState<'all' | 'active' | 'resolved'>('active');

  // Fetch activities to generate alerts from flagged activities
  const today = format(new Date(), 'yyyy-MM-dd');
  const { data: activitiesData } = useGetActivitiesQuery({
    startDate: today,
    endDate: today,
    limit: 100,
    offset: 0,
  });

  // Generate alerts from activities and mock data
  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = [];
    const activities = activitiesData?.data?.activities || [];

    // Generate alerts from flagged activities
    activities
      .filter((activity) => activity.category === 'flagged' || activity.category === 'unproductive')
      .forEach((activity) => {
        alerts.push({
          id: `alert-${activity.id}`,
          studentId: activity.studentId || 'student-1',
          studentName: activity.firstName && activity.lastName
            ? `${activity.firstName} ${activity.lastName}`
            : 'Student',
          type: activity.category === 'flagged' ? 'flagged_activity' : 'unproductive_app',
          severity: activity.category === 'flagged' ? 'high' : 'medium',
          message:
            activity.category === 'flagged'
              ? `Flagged activity: ${activity.appName} - ${activity.windowTitle || activity.url || 'Unknown'}`
              : `Unproductive app usage: ${activity.appName} for ${Math.floor(activity.duration / 60)} minutes`,
          timestamp: activity.timestamp,
          resolved: false,
          activityId: activity.id,
          appName: activity.appName,
          website: activity.url,
        });
      });

    // Add mock alerts for demonstration
    alerts.push(
      {
        id: 'alert-1',
        studentId: 'student-1',
        studentName: 'Sarah Johnson',
        type: 'low_productivity',
        severity: 'high',
        message: 'Productivity below 40% for 2 hours',
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        resolved: false,
      },
      {
        id: 'alert-2',
        studentId: 'student-2',
        studentName: 'Mike Chen',
        type: 'blocked_website',
        severity: 'medium',
        message: 'Attempted to access blocked website: facebook.com',
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
        resolved: false,
        website: 'facebook.com',
      },
      {
        id: 'alert-3',
        studentId: 'student-3',
        studentName: 'Emma Davis',
        type: 'extended_idle',
        severity: 'low',
        message: 'Idle for 28 minutes',
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        resolved: false,
      },
      {
        id: 'alert-4',
        studentId: 'student-4',
        studentName: 'John Smith',
        type: 'unproductive_app',
        severity: 'medium',
        message: 'Excessive use of YouTube for 45 minutes',
        timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
        resolved: true,
        appName: 'YouTube',
      }
    );

    return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const allAlerts = generateAlerts();
  const filteredAlerts = allAlerts.filter((alert) => {
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
    if (resolvedFilter === 'active' && alert.resolved) return false;
    if (resolvedFilter === 'resolved' && !alert.resolved) return false;
    return true;
  });

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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'low_productivity':
        return 'Low Productivity';
      case 'blocked_website':
        return 'Blocked Website';
      case 'extended_idle':
        return 'Extended Idle';
      case 'unproductive_app':
        return 'Unproductive App';
      case 'flagged_activity':
        return 'Flagged Activity';
      default:
        return type;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const activeAlerts = allAlerts.filter((a) => !a.resolved);
  const highPriorityAlerts = activeAlerts.filter((a) => a.severity === 'high');
  const mediumPriorityAlerts = activeAlerts.filter((a) => a.severity === 'medium');
  const lowPriorityAlerts = activeAlerts.filter((a) => a.severity === 'low');

  return (
    <div className="container py-8 px-4 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Alerts</h1>
        <p className="text-muted-foreground">
          View and manage all student alerts and warnings
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground">{allAlerts.length - activeAlerts.length} resolved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{highPriorityAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Medium Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediumPriorityAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Review recommended</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowPriorityAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Informational</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Alerts Timeline</CardTitle>
              <CardDescription>All student alerts and warnings</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as any)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={resolvedFilter} onValueChange={(v) => setResolvedFilter(v as any)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.length > 0 ? (
                  filteredAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        {alert.resolved ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{alert.studentName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getTypeLabel(alert.type)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                      </TableCell>
                      <TableCell className="max-w-md">{alert.message}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatTimeAgo(alert.timestamp)}
                      </TableCell>
                      <TableCell>
                        {!alert.resolved && (
                          <Button variant="ghost" size="sm">
                            Resolve
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No alerts found matching the selected filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Alerts;
