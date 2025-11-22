import React, { useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useGetTopAppsQuery } from '../services/appsWebsitesApi';
import type { Application, ApplicationCategoryStats } from '@/shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';

interface ApplicationsTabProps {
  studentId: string;
  selectedDate: Date;
}

type SortField = 'name' | 'duration' | 'sessions' | 'category' | 'lastUsed';
type SortOrder = 'asc' | 'desc';

// Helper function to format seconds to "Xh Xm"
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Helper function to calculate category stats
const calculateCategoryStats = (apps: Application[]): ApplicationCategoryStats => {
  const productive = apps.filter((a) => a.category === 'productive');
  const neutral = apps.filter((a) => a.category === 'neutral');
  const unproductive = apps.filter((a) => a.category === 'unproductive');

    const productiveDuration = productive.reduce((sum, a) => sum + a.totalDuration, 0);
    const neutralDuration = neutral.reduce((sum, a) => sum + a.totalDuration, 0);
    const unproductiveDuration = unproductive.reduce((sum, a) => sum + a.totalDuration, 0);

  return {
    productive: {
      count: productive.length,
      percentage: apps.length > 0 ? (productive.length / apps.length) * 100 : 0,
      totalDuration: productiveDuration,
    },
    neutral: {
      count: neutral.length,
      percentage: apps.length > 0 ? (neutral.length / apps.length) * 100 : 0,
      totalDuration: neutralDuration,
    },
    unproductive: {
      count: unproductive.length,
      percentage: apps.length > 0 ? (unproductive.length / apps.length) * 100 : 0,
      totalDuration: unproductiveDuration,
    },
    totalApps: apps.length,
  };
};

export const ApplicationsTab: React.FC<ApplicationsTabProps> = ({
  studentId,
  selectedDate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const limit = 20;

  const dateStr = selectedDate.toISOString().split('T')[0];

  const {
    data: appsData,
    isLoading,
  } = useGetTopAppsQuery({
    limit: 100, // Get all apps for table
    startDate: dateStr,
    endDate: dateStr,
    userId: studentId,
  });

  const apps = appsData?.data || [];
  const top10Apps = apps.slice(0, 10);

  // Filter and sort apps
  const filteredAndSortedApps = useMemo(() => {
    let filtered = apps.filter((app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortField) {
      filtered.sort((a, b) => {
        let aVal: any;
        let bVal: any;

        switch (sortField) {
          case 'name':
            aVal = a.name.toLowerCase();
            bVal = b.name.toLowerCase();
            break;
          case 'duration':
            aVal = a.totalDuration;
            bVal = b.totalDuration;
            break;
          case 'sessions':
            aVal = a.sessionsCount;
            bVal = b.sessionsCount;
            break;
          case 'category':
            aVal = a.category;
            bVal = b.category;
            break;
          case 'lastUsed':
            aVal = new Date(a.lastUsed).getTime();
            bVal = new Date(b.lastUsed).getTime();
            break;
        }

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [apps, searchTerm, sortField, sortOrder]);

  const paginatedApps = filteredAndSortedApps.slice(
    (page - 1) * limit,
    page * limit
  );

  const categoryStats = useMemo(() => calculateCategoryStats(apps), [apps]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-blue-600" />
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'productive':
        return '#10B981'; // green
      case 'neutral':
        return '#F59E0B'; // yellow
      case 'unproductive':
        return '#EF4444'; // red
      default:
        return '#9CA3AF'; // gray
    }
  };

  // Top 10 Apps Bar Chart Data
  const barChartData = top10Apps.map((app) => ({
    name: app.name.length > 20 ? app.name.substring(0, 20) + '...' : app.name,
    fullName: app.name,
    duration: Math.floor(app.totalDuration / 60), // Convert to minutes
    category: app.category,
  }));

  // Pie Chart Data
  const pieChartData = [
    {
      name: 'Productive',
      value: categoryStats.productive.percentage,
      count: categoryStats.productive.count,
      color: '#10B981',
    },
    {
      name: 'Neutral',
      value: categoryStats.neutral.percentage,
      count: categoryStats.neutral.count,
      color: '#F59E0B',
    },
    {
      name: 'Unproductive',
      value: categoryStats.unproductive.percentage,
      count: categoryStats.unproductive.count,
      color: '#EF4444',
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-1">{data.fullName || data.name}</p>
          <p className="text-sm text-gray-600">
            Duration: <span className="font-medium">{formatDuration(data.duration * 60)}</span>
          </p>
          <p className="text-sm text-gray-600 capitalize">
            Category: <span className="font-medium">{data.category}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No application data available for this date</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top 10 Applications Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={barChartData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                width={90}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="duration" radius={[0, 4, 4, 0]}>
                {barChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Application Categories Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Application Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-2xl font-bold fill-gray-900"
              >
                {categoryStats.totalApps}
              </text>
              <text
                x="50%"
                y="55%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm fill-gray-600"
              >
                apps used today
              </text>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Applications Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Applications</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center space-x-1 hover:text-blue-600"
                    >
                      <span>Application Name</span>
                      {getSortIcon('name')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('duration')}
                      className="flex items-center space-x-1 hover:text-blue-600"
                    >
                      <span>Duration</span>
                      {getSortIcon('duration')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('sessions')}
                      className="flex items-center space-x-1 hover:text-blue-600"
                    >
                      <span>Sessions</span>
                      {getSortIcon('sessions')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('category')}
                      className="flex items-center space-x-1 hover:text-blue-600"
                    >
                      <span>Category</span>
                      {getSortIcon('category')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('lastUsed')}
                      className="flex items-center space-x-1 hover:text-blue-600"
                    >
                      <span>Last Used</span>
                      {getSortIcon('lastUsed')}
                    </button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedApps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No applications found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedApps.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.name}</TableCell>
                      <TableCell>{formatDuration(app.totalDuration)}</TableCell>
                      <TableCell>{app.sessionsCount}</TableCell>
                      <TableCell>
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium capitalize"
                          style={{
                            backgroundColor: `${getCategoryColor(app.category)}20`,
                            color: getCategoryColor(app.category),
                          }}
                        >
                          {app.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDistanceToNow(new Date(app.lastUsed), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {filteredAndSortedApps.length > limit && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, filteredAndSortedApps.length)} of{' '}
                {filteredAndSortedApps.length} applications
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * limit >= filteredAndSortedApps.length}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
