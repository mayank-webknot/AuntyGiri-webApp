# RTK Query API Integration Examples

## Authentication

### Login
```typescript
import { useLoginMutation } from '@/store/api/authApi';

function LoginComponent() {
  const [login, { isLoading, error }] = useLoginMutation();

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login({ email, password }).unwrap();
      // Store token
      localStorage.setItem('auth_token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
    } catch (err) {
      console.error('Login failed:', err);
    }
  };
}
```

### Get Current User
```typescript
import { useGetMeQuery } from '@/store/api/authApi';

function ProfileComponent() {
  const { data, isLoading, error } = useGetMeQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;

  return <div>{data?.data.firstName} {data?.data.lastName}</div>;
}
```

### Logout
```typescript
import { useLogoutMutation } from '@/store/api/authApi';

function LogoutButton() {
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await logout().unwrap();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  };
}
```

## Dashboard

### Dashboard Summary
```typescript
import { useGetDashboardSummaryQuery } from '@/store/api/dashboardApi';

function Dashboard() {
  const { data, isLoading, error } = useGetDashboardSummaryQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading dashboard</div>;

  const summary = data?.data;
  return (
    <div>
      <h1>Total Students: {summary?.totalStudents}</h1>
      <p>Active Today: {summary?.activeToday}</p>
      <p>Avg Productivity: {summary?.averageProductivity}%</p>
    </div>
  );
}
```

### Timeline
```typescript
import { useGetTimelineQuery } from '@/store/api/dashboardApi';

function TimelineChart() {
  const { data, isLoading } = useGetTimelineQuery({
    date: '2025-01-15',
    interval: 'hour',
  });

  // Transform data for chart
  const chartData = data?.data.map(item => ({
    time: item.timeSlot,
    productivity: item.totalDuration > 0
      ? (item.productiveDuration / item.totalDuration) * 100
      : 0,
  }));
}
```

## Students

### Students List
```typescript
import { useGetStudentsQuery } from '@/store/api/studentsApi';

function StudentsList() {
  const { data, isLoading } = useGetStudentsQuery({
    page: 1,
    limit: 20,
    search: 'john',
    sortBy: 'firstName',
    sortOrder: 'ASC',
  });

  const students = data?.data.items || [];
  const totalPages = data?.data.totalPages || 0;

  return (
    <div>
      {students.map(student => (
        <div key={student.id}>
          {student.firstName} {student.lastName}
        </div>
      ))}
    </div>
  );
}
```

## Student Detail

### Student Information
```typescript
import { useGetStudentByIdQuery, useGetStudentSummaryQuery } from '@/store/api/studentDetailApi';

function StudentDetail({ studentId }: { studentId: string }) {
  const { data: student, isLoading: studentLoading } = useGetStudentByIdQuery(studentId);
  const { data: summary, isLoading: summaryLoading } = useGetStudentSummaryQuery(studentId);

  if (studentLoading || summaryLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{student?.data.firstName} {student?.data.lastName}</h1>
      <p>Focus Time: {summary?.data.focusTime}s</p>
      <p>Warnings: {summary?.data.warnings}</p>
    </div>
  );
}
```

## Activities

### Activities List
```typescript
import { useGetActivitiesQuery } from '@/store/api/monitorApi';

function ActivitiesList({ studentId }: { studentId?: string }) {
  const { data, isLoading } = useGetActivitiesQuery({
    studentId, // Changed from userId to match Swagger
    from: '2025-01-01', // Changed from startDate to match Swagger
    to: '2025-01-31',   // Changed from endDate to match Swagger
  });

  const activities = data?.data || [];

  return (
    <div>
      {activities.map(activity => (
        <div key={activity.id}>
          {activity.appName} - {activity.duration}s
        </div>
      ))}
    </div>
  );
}
```

### Activities Summary
```typescript
import { useGetActivitiesSummaryQuery } from '@/store/api/monitorApi';

function ActivitiesSummary({ userId }: { userId?: string }) {
  const { data } = useGetActivitiesSummaryQuery({ userId });

  const summary = data?.data;
  return (
    <div>
      <p>Productive: {summary?.productiveTime}s</p>
      <p>Unproductive: {summary?.unproductiveTime}s</p>
      <p>Total: {summary?.totalTime}s</p>
    </div>
  );
}
```

## Apps & Websites

### Top Apps
```typescript
import { useGetTopAppsQuery } from '@/store/api/appsWebsitesApi';

function TopApps({ userId }: { userId?: string }) {
  const { data } = useGetTopAppsQuery({
    limit: 10,
    userId,
    startDate: '2025-01-01',
    endDate: '2025-01-31',
  });

  const apps = data?.data || [];

  return (
    <div>
      {apps.map(app => (
        <div key={app.appName}>
          {app.appName}: {app.totalDuration}s
        </div>
      ))}
    </div>
  );
}
```

### Website Usage
```typescript
import { useGetWebsiteUsageQuery } from '@/store/api/appsWebsitesApi';

function WebsiteUsage({ userId }: { userId?: string }) {
  const { data } = useGetWebsiteUsageQuery({
    limit: 20,
    userId,
    startDate: '2025-01-01',
  });

  const websites = data?.data || [];

  return (
    <div>
      {websites.map(website => (
        <div key={website.domain}>
          {website.domain}: {website.totalDuration}s
          {website.isBlocked && <span> (Blocked)</span>}
        </div>
      ))}
    </div>
  );
}
```

## Screenshots

### Screenshots List
```typescript
import { useGetScreenshotsQuery } from '@/store/api/screenshotsApi';

function ScreenshotsList() {
  const { data, isLoading } = useGetScreenshotsQuery({
    page: 1,
    limit: 20,
    flaggedOnly: false,
    sortBy: 'timestamp',
  });

  const screenshots = data?.data.items || [];

  return (
    <div>
      {screenshots.map(screenshot => (
        <img
          key={screenshot.id}
          src={screenshot.thumbnailUrl}
          alt={screenshot.windowTitle}
        />
      ))}
    </div>
  );
}
```

### Get Screenshot by ID
```typescript
import { useGetScreenshotByIdQuery } from '@/store/api/screenshotsApi';

function ScreenshotDetail({ screenshotId }: { screenshotId: string }) {
  const { data, isLoading } = useGetScreenshotByIdQuery(screenshotId);

  if (isLoading) return <div>Loading...</div>;
  if (!data?.data) return <div>Screenshot not found</div>;

  const screenshot = data.data;

  return (
    <div>
      <img src={screenshot.url} alt={screenshot.windowTitle} />
      <p>App: {screenshot.appName}</p>
      <p>Window: {screenshot.windowTitle}</p>
      <p>Flagged: {screenshot.isFlagged ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

