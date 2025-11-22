import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, TrendingUp, AlertTriangle, Camera } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const StudentDetail = () => {
  const { id } = useParams();

  // Using mock data (Students API not in contract)
  // In a real app, you would fetch student data from a contract-compliant endpoint
  const student = {
    id: id || '1',
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

      {/* Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics & Activity</CardTitle>
          <CardDescription>
            Detailed analytics tabs coming soon (Overview, Applications, Websites, Screenshots, Alerts)
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center text-muted-foreground">
          More detailed analytics will appear here
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetail;
