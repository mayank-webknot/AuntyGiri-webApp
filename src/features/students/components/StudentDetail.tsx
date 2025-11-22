import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MessageSquare,
  Settings,
  Download,
} from 'lucide-react';
import { format, startOfDay, subDays } from 'date-fns';
import {
  useGetStudentDetailQuery,
  useGetStudentSummaryQuery,
  useGetStudentActivitiesQuery,
} from '../services/studentDetailApi';
import { websocketService } from '@/shared/services/websocket';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/tabs';
import { Input } from '@/shared/components/ui/input';
import { StudentSummaryCard } from './StudentSummaryCard';
import { ActivityTimelineChart } from './ActivityTimelineChart';
import { HourlyFocusChart } from './HourlyFocusChart';
import { ApplicationsTab } from './ApplicationsTab';
import { WebsitesTab } from './WebsitesTab';
import { ScreenshotsTab } from './ScreenshotsTab';
import { AlertsTab } from './AlertsTab';
import { useAppDispatch } from '@/app/store/hooks';
import { studentDetailApi } from '../services/studentDetailApi';

export const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('overview');

  if (!id) {
    return <div>Student ID not found</div>;
  }

  // Fetch student data
  const {
    data: studentData,
    isLoading: studentLoading,
  } = useGetStudentDetailQuery(id);

  const {
    data: summaryData,
    isLoading: summaryLoading,
  } = useGetStudentSummaryQuery(id);

  const {
    data: activitiesData,
    isLoading: activitiesLoading,
    refetch: refetchActivities,
  } = useGetStudentActivitiesQuery({
    userId: id,
    startDate: format(startOfDay(selectedDate), 'yyyy-MM-dd'),
    endDate: format(startOfDay(selectedDate), 'yyyy-MM-dd'),
  });

  const student = studentData?.data;
  const summary = summaryData?.data;
  const activities = activitiesData?.data?.activities || [];
  const hourlyFocus = activitiesData?.data?.hourlyFocus || [];

  // WebSocket real-time updates
  useEffect(() => {
    websocketService.connect();

    const handleStudentActivity = (data: {
      studentId: string;
      app: string;
      activity: string;
      status: 'online' | 'offline';
    }) => {
      if (data.studentId === id) {
        dispatch(
          studentDetailApi.util.updateQueryData('getStudentDetail', id, (draft) => {
            if (draft?.data) {
              draft.data.onlineStatus = data.status;
              if (data.status === 'online') {
                draft.data.currentActivity = {
                  app: data.app,
                  activity: data.activity,
                  startedAt: new Date().toISOString(),
                };
              } else {
                draft.data.currentActivity = undefined;
              }
            }
          })
        );
        refetchActivities();
      }
    };

    websocketService.on('student:activity', handleStudentActivity);
    websocketService.on('student:online', handleStudentActivity);
    websocketService.on('student:offline', handleStudentActivity);

    return () => {
      websocketService.off('student:activity', handleStudentActivity);
      websocketService.off('student:online', handleStudentActivity);
      websocketService.off('student:offline', handleStudentActivity);
    };
  }, [id, dispatch, refetchActivities]);

  if (studentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Skeleton className="h-32 w-full mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Student not found</p>
          <Button onClick={() => navigate('/students')} className="mt-4">
            Back to Students
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/students')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div className="h-12 w-px bg-gray-300" />
              <Avatar className="h-16 w-16">
                <AvatarImage src={student.avatar} alt={student.name} />
                <AvatarFallback>
                  {student.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-600">
                    {student.class} • #{student.rollNumber}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        student.onlineStatus === 'online'
                          ? 'bg-green-500 animate-pulse'
                          : 'bg-gray-400'
                      }`}
                    />
                    <span className="text-sm text-gray-600 capitalize">
                      {student.onlineStatus}
                    </span>
                  </div>
                </div>
                {student.currentActivity && (
                  <p className="text-sm text-gray-500 mt-1">
                    Active in {student.currentActivity.app} - {student.currentActivity.activity}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Send Message</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StudentSummaryCard
            title="Focus Time Today"
            isLoading={summaryLoading}
            data={summary?.focusTimeToday}
            type="focus"
          />
          <StudentSummaryCard
            title="Productive Time"
            isLoading={summaryLoading}
            data={summary?.productiveTime}
            type="productive"
          />
          <StudentSummaryCard
            title="Warnings Count"
            isLoading={summaryLoading}
            data={summary?.warningsCount}
            type="warnings"
          />
          <StudentSummaryCard
            title="Screenshots"
            isLoading={summaryLoading}
            data={summary?.screenshots}
            type="screenshots"
          />
        </div>

        {/* Date Picker */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Select Date:</label>
              <Input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                max={format(new Date(), 'yyyy-MM-dd')}
                className="w-48"
              />
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(subDays(new Date(), 1))}
                >
                  Yesterday
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(subDays(new Date(), 7))}
                >
                  Last Week
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="websites">Websites</TabsTrigger>
            <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                {activitiesLoading ? (
                  <Skeleton className="h-96 w-full" />
                ) : activities.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No activity data available for this date</p>
                  </div>
                ) : (
                  <ActivityTimelineChart activities={activities} />
                )}
              </CardContent>
            </Card>

            {/* Hourly Focus Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Hourly Focus Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {activitiesLoading ? (
                  <Skeleton className="h-96 w-full" />
                ) : hourlyFocus.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No focus data available for this date</p>
                  </div>
                ) : (
                  <HourlyFocusChart data={hourlyFocus} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <ApplicationsTab studentId={id} selectedDate={selectedDate} />
          </TabsContent>

          {/* Websites Tab */}
          <TabsContent value="websites">
            <WebsitesTab studentId={id} selectedDate={selectedDate} />
          </TabsContent>
          <TabsContent value="screenshots">
            <ScreenshotsTab studentId={id} selectedDate={selectedDate} />
          </TabsContent>
          <TabsContent value="alerts">
            <AlertsTab
              studentId={id}
              studentName={student?.name || 'Student'}
              selectedDate={selectedDate}
            />
          </TabsContent>
          <TabsContent value="recommendations">
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-500">Recommendations tab - Coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
