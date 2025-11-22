import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Clock, TrendingUp, AlertTriangle, Camera, Monitor, Globe, Image as ImageIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useGetActivitiesQuery, useGetActivitiesSummaryQuery } from '@/store/api/monitorApi';
import { useGetTopAppsQuery, useGetWebsiteUsageQuery } from '@/store/api/appsWebsitesApi';
import { useGetMonitorScreenshotsQuery } from '@/store/api/screenshotsApi';
import { format } from 'date-fns';

const StudentDetail = () => {
  const { id } = useParams();
  const studentId = id || 'student-1';

  // Using mock data (Students API not in contract)
  // In a real app, you would fetch student data from a contract-compliant endpoint
  const student = {
    id: studentId,
    name: 'Sarah Johnson',
    email: 'sarah.j@school.com',
    rollNumber: 'CS-2024-001',
    class: 'Computer Science',
    isOnline: true,
    currentActivity: 'VSCode - Working on React Project',
    productivityScore: 85,
    avatar: undefined,
  };

  // Mock stats (Students API not in contract)
  const stats = {
    focusTime: '4h 30m',
    productiveTime: 85,
    warnings: 2,
    screenshots: 32,
  };

  // Fetch analytics data using APIs (will use mock data if backend fails)
  const today = format(new Date(), 'yyyy-MM-dd');
  const { data: activitiesData } = useGetActivitiesQuery({
    startDate: today,
    endDate: today,
    limit: 20,
    offset: 0,
  });

  const { data: activitiesSummary } = useGetActivitiesSummaryQuery({
    startDate: today,
    endDate: today,
  });

  const { data: topAppsData } = useGetTopAppsQuery({
    startDate: today,
    endDate: today,
    limit: 10,
    userId: studentId,
  });

  const { data: websiteUsageData } = useGetWebsiteUsageQuery({
    startDate: today,
    endDate: today,
    limit: 10,
    userId: studentId,
  });

  const { data: screenshotsData } = useGetMonitorScreenshotsQuery({
    startDate: today,
    endDate: today,
    limit: 20,
    offset: 0,
  });

  // Extract data from API responses
  const activities = activitiesData?.data?.activities || [];
  const summary = activitiesSummary?.data;
  const topApps = topAppsData?.data || [];
  const websites = websiteUsageData?.data || [];
  const screenshots = screenshotsData?.data?.screenshots || [];

  return (
    <div className="container py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/students">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students
          </Link>
        </Button>
      </div>

      {/* Student Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={student.avatar} alt={student.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {student.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div>
                  <h1 className="text-3xl font-bold">{student.name}</h1>
                  <p className="text-muted-foreground">{student.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{student.rollNumber}</Badge>
                  <Badge variant="outline">{student.class}</Badge>
                  <Badge
                    variant={student.isOnline ? 'default' : 'secondary'}
                    className={cn(
                      'gap-1.5',
                      student.isOnline && 'bg-success text-success-foreground'
                    )}
                  >
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full',
                        student.isOnline ? 'bg-success-foreground animate-pulse' : 'bg-muted-foreground'
                      )}
                    />
                    {student.isOnline ? 'Online' : 'Offline'}
                  </Badge>
                </div>
                {student.isOnline && student.currentActivity && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Current Activity:</span> {student.currentActivity}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Send Message</Button>
              <Button>Configure Settings</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Focus Time Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.focusTime}</div>
            <p className="text-xs text-muted-foreground">80% of daily goal</p>
            <Progress value={80} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productive Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productiveTime}%</div>
            <p className="text-xs text-muted-foreground">4h 58m productive</p>
            <Progress value={stats.productiveTime} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.warnings}</div>
            <p className="text-xs text-muted-foreground">1 high, 1 medium</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Screenshots</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.screenshots}</div>
            <p className="text-xs text-muted-foreground">32 today</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics & Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics & Activity</CardTitle>
          <CardDescription>
            Detailed analytics and activity tracking for {student.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="websites">Websites</TabsTrigger>
              <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 mt-4">
              {summary && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Productive Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {Math.round((summary.productiveTime / summary.totalTime) * 100)}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {Math.floor(summary.productiveTime / 3600)}h {Math.floor((summary.productiveTime % 3600) / 60)}m
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Neutral Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {Math.round((summary.neutralTime / summary.totalTime) * 100)}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {Math.floor(summary.neutralTime / 3600)}h {Math.floor((summary.neutralTime % 3600) / 60)}m
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Unproductive Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-destructive">
                        {Math.round((summary.unproductiveTime / summary.totalTime) * 100)}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {Math.floor(summary.unproductiveTime / 3600)}h {Math.floor((summary.unproductiveTime % 3600) / 60)}m
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {Math.floor(summary.totalTime / 3600)}h {Math.floor((summary.totalTime % 3600) / 60)}m
                      </div>
                      <p className="text-xs text-muted-foreground">Today</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Application</TableHead>
                          <TableHead>Activity</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Category</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activities.length > 0 ? (
                          activities.slice(0, 10).map((activity) => (
                            <TableRow key={activity.id}>
                              <TableCell className="text-sm">
                                {format(new Date(activity.timestamp), 'HH:mm')}
                              </TableCell>
                              <TableCell className="font-medium">{activity.appName}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {activity.windowTitle || activity.url || '-'}
                              </TableCell>
                              <TableCell>{Math.floor(activity.duration / 60)}m</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    activity.category === 'productive'
                                      ? 'default'
                                      : activity.category === 'unproductive'
                                      ? 'destructive'
                                      : 'secondary'
                                  }
                                >
                                  {activity.category}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                              No activities found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="applications" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Top Applications
                  </CardTitle>
                  <CardDescription>Most used applications today</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Application</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Sessions</TableHead>
                          <TableHead>Last Used</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topApps.length > 0 ? (
                          topApps.map((app, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{app.appName}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    app.category === 'productive'
                                      ? 'default'
                                      : app.category === 'unproductive'
                                      ? 'destructive'
                                      : 'secondary'
                                  }
                                >
                                  {app.category}
                                </Badge>
                              </TableCell>
                              <TableCell>{Math.floor(app.totalDuration / 3600)}h {Math.floor((app.totalDuration % 3600) / 60)}m</TableCell>
                              <TableCell>{app.sessionsCount}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {format(new Date(app.lastUsed), 'HH:mm')}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                              No application data available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Websites Tab */}
            <TabsContent value="websites" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Website Usage
                  </CardTitle>
                  <CardDescription>Most visited websites today</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Domain</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Visits</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Visit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {websites.length > 0 ? (
                          websites.map((website, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{website.domain}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    website.category === 'productive'
                                      ? 'default'
                                      : website.category === 'unproductive'
                                      ? 'destructive'
                                      : 'secondary'
                                  }
                                >
                                  {website.category}
                                </Badge>
                              </TableCell>
                              <TableCell>{Math.floor(website.totalDuration / 3600)}h {Math.floor((website.totalDuration % 3600) / 60)}m</TableCell>
                              <TableCell>{website.visitsCount}</TableCell>
                              <TableCell>
                                {website.isBlocked ? (
                                  <Badge variant="destructive">Blocked</Badge>
                                ) : (
                                  <Badge variant="default">Allowed</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {format(new Date(website.lastVisit), 'HH:mm')}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                              No website data available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Screenshots Tab */}
            <TabsContent value="screenshots" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Screenshots
                  </CardTitle>
                  <CardDescription>Activity screenshots captured today</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    {screenshots.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {screenshots.map((screenshot) => (
                          <Card key={screenshot.id} className="overflow-hidden">
                            <div className="aspect-video bg-muted relative">
                              <img
                                src={screenshot.thumbnailUrl || screenshot.url}
                                alt={screenshot.windowTitle}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EScreenshot%3C/text%3E%3C/svg%3E';
                                }}
                              />
                              {screenshot.isFlagged && (
                                <Badge variant="destructive" className="absolute top-2 right-2">
                                  Flagged
                                </Badge>
                              )}
                            </div>
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                <div className="font-medium text-sm">{screenshot.appName}</div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {screenshot.windowTitle}
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>{format(new Date(screenshot.timestamp), 'HH:mm')}</span>
                                  <Badge
                                    variant={
                                      screenshot.category === 'productive'
                                        ? 'default'
                                        : screenshot.category === 'unproductive'
                                        ? 'destructive'
                                        : 'secondary'
                                    }
                                    className="text-xs"
                                  >
                                    {screenshot.category}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-64 items-center justify-center text-muted-foreground">
                        No screenshots available
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetail;
