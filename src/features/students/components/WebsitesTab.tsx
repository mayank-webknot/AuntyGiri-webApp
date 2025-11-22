import React, { useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { useGetWebsiteUsageQuery } from '../services/appsWebsitesApi';
import type { Website } from '@/shared/types';
import { FLAGGED_WEBSITES } from '@/shared/types';
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
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, AlertTriangle, Eye } from 'lucide-react';

interface WebsitesTabProps {
  studentId: string;
  selectedDate: Date;
}

type SortField = 'domain' | 'duration' | 'visits' | 'category' | 'lastVisit';
type SortOrder = 'asc' | 'desc';
type FilterType = 'all' | 'productive' | 'flagged';

// Helper function to format seconds to "Xh Xm"
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Extract domain from URL
const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
};

export const WebsitesTab: React.FC<WebsitesTabProps> = ({
  studentId,
  selectedDate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 20;

  const dateStr = selectedDate.toISOString().split('T')[0];

  const {
    data: websitesData,
    isLoading,
  } = useGetWebsiteUsageQuery({
    limit: 100,
    startDate: dateStr,
    userId: studentId,
  });

  const websites = websitesData?.data || [];
  const top10Websites = websites.slice(0, 10);

  // Process websites: extract domains and determine categories
  const processedWebsites = useMemo(() => {
    return websites.map((website) => {
      const domain = website.domain || extractDomain(website.fullUrl);
      const isBlocked = FLAGGED_WEBSITES.some((flagged) =>
        domain.toLowerCase().includes(flagged.toLowerCase())
      );

      return {
        ...website,
        domain,
        isBlocked,
        category: isBlocked
          ? 'flagged'
          : website.category || 'neutral',
      };
    });
  }, [websites]);

  // Filter websites
  const filteredWebsites = useMemo(() => {
    let filtered = processedWebsites.filter((website) =>
      website.domain.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterType === 'productive') {
      filtered = filtered.filter((w) => w.category === 'productive');
    } else if (filterType === 'flagged') {
      filtered = filtered.filter((w) => w.category === 'flagged' || w.isBlocked);
    }

    if (selectedDomain) {
      filtered = filtered.filter((w) => w.domain === selectedDomain);
    }

    return filtered;
  }, [processedWebsites, searchTerm, filterType, selectedDomain]);

  // Sort websites
  const sortedWebsites = useMemo(() => {
    if (!sortField) return filteredWebsites;

    return [...filteredWebsites].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortField) {
        case 'domain':
          aVal = a.domain.toLowerCase();
          bVal = b.domain.toLowerCase();
          break;
        case 'duration':
          aVal = a.totalDuration;
          bVal = b.totalDuration;
          break;
        case 'visits':
          aVal = a.visitsCount;
          bVal = b.visitsCount;
          break;
        case 'category':
          aVal = a.category;
          bVal = b.category;
          break;
        case 'lastVisit':
          aVal = new Date(a.lastVisit).getTime();
          bVal = new Date(b.lastVisit).getTime();
          break;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredWebsites, sortField, sortOrder]);

  const paginatedWebsites = sortedWebsites.slice((page - 1) * limit, page * limit);

  // Generate heatmap data
  const heatmapData = useMemo(() => {
    const data: { [key: string]: { [hour: number]: number } } = {};
    const top15Domains = [...processedWebsites]
      .sort((a, b) => b.totalDuration - a.totalDuration)
      .slice(0, 15)
      .map((w) => w.domain);

    top15Domains.forEach((domain) => {
      data[domain] = {};
      for (let hour = 0; hour < 24; hour++) {
        data[domain][hour] = 0;
      }
    });

    // For demo purposes, distribute time across hours
    processedWebsites.forEach((website) => {
      if (top15Domains.includes(website.domain)) {
        const avgPerHour = website.totalDuration / 24;
        for (let hour = 0; hour < 24; hour++) {
          if (data[website.domain]) {
            data[website.domain][hour] = Math.floor(avgPerHour / 60); // Convert to minutes
          }
        }
      }
    });

    return { domains: top15Domains, data };
  }, [processedWebsites]);

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
        return '#3B82F6'; // blue
      case 'flagged':
        return '#EF4444'; // red
      default:
        return '#9CA3AF'; // gray
    }
  };

  // Donut Chart Data
  const donutChartData = top10Websites.map((website) => {
    const domain = website.domain || extractDomain(website.fullUrl);
    const isBlocked = FLAGGED_WEBSITES.some((flagged) =>
      domain.toLowerCase().includes(flagged.toLowerCase())
    );
    const category = isBlocked ? 'flagged' : website.category || 'neutral';

    return {
      name: domain,
      value: Math.floor(website.totalDuration / 60), // Convert to minutes
      category,
      fullDuration: website.totalDuration,
    };
  });

  const totalWebsites = processedWebsites.length;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-1">{data.name}</p>
          <p className="text-sm text-gray-600">
            Duration: <span className="font-medium">{formatDuration(data.fullDuration)}</span>
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
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (websites.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No website data available for this date</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Websites Donut Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Websites</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={donutChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => {
                  const shortName = (name || '').length > 15 ? (name || '').substring(0, 15) + '...' : (name || '');
                  return `${shortName}: ${((percent || 0) * 100).toFixed(0)}%`;
                }}
                outerRadius={120}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                onClick={(data) => {
                  setSelectedDomain(data.name);
                  setPage(1);
                }}
              >
                {donutChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-2xl font-bold fill-gray-900"
              >
                {totalWebsites}
              </text>
              <text
                x="50%"
                y="55%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm fill-gray-600"
              >
                websites today
              </text>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Website Timeline Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Website Timeline Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 text-left text-sm font-medium">
                      Domain
                    </th>
                    {Array.from({ length: 24 }, (_, i) => (
                      <th
                        key={i}
                        className="border border-gray-300 p-2 text-center text-xs font-medium"
                      >
                        {String(i).padStart(2, '0')}:00
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.domains.map((domain) => (
                    <tr key={domain}>
                      <td className="border border-gray-300 p-2 text-sm font-medium">
                        {domain.length > 20 ? domain.substring(0, 20) + '...' : domain}
                      </td>
                      {Array.from({ length: 24 }, (_, hour) => {
                        const duration = heatmapData.data[domain]?.[hour] || 0;
                        const intensity = Math.min(duration / 60, 1); // Normalize to 0-1
                        const opacity = 0.3 + intensity * 0.7;
                        const bgColor = intensity > 0.5 ? '#3B82F6' : '#9CA3AF';

                        return (
                          <td
                            key={hour}
                            className="border border-gray-300 p-1 text-center text-xs"
                            style={{
                              backgroundColor: `${bgColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`,
                            }}
                            title={`${domain} at ${String(hour).padStart(2, '0')}:00 - ${duration} min`}
                          >
                            {duration > 0 ? duration : ''}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Websites Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle>All Websites</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setFilterType('all');
                    setPage(1);
                  }}
                >
                  All
                </Button>
                <Button
                  variant={filterType === 'productive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setFilterType('productive');
                    setPage(1);
                  }}
                >
                  Productive
                </Button>
                <Button
                  variant={filterType === 'flagged' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setFilterType('flagged');
                    setPage(1);
                  }}
                >
                  Flagged
                </Button>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search websites..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedDomain && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <span className="text-sm text-blue-900">
                Filtered by: <strong>{selectedDomain}</strong>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDomain(null)}
              >
                Clear Filter
              </Button>
            </div>
          )}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort('domain')}
                      className="flex items-center space-x-1 hover:text-blue-600"
                    >
                      <span>Domain</span>
                      {getSortIcon('domain')}
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
                      onClick={() => handleSort('visits')}
                      className="flex items-center space-x-1 hover:text-blue-600"
                    >
                      <span>Visits</span>
                      {getSortIcon('visits')}
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
                      onClick={() => handleSort('lastVisit')}
                      className="flex items-center space-x-1 hover:text-blue-600"
                    >
                      <span>Last Visit</span>
                      {getSortIcon('lastVisit')}
                    </button>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedWebsites.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No websites found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedWebsites.map((website) => (
                    <TableRow key={website.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {website.isBlocked && (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                          <span>{website.domain}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDuration(website.totalDuration)}</TableCell>
                      <TableCell>{website.visitsCount}</TableCell>
                      <TableCell>
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium capitalize"
                          style={{
                            backgroundColor: `${getCategoryColor(website.category)}20`,
                            color: getCategoryColor(website.category),
                          }}
                        >
                          {website.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDistanceToNow(new Date(website.lastVisit), { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Show all URLs from this domain
                            console.log('View URLs for:', website.domain);
                          }}
                          className="flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View URLs</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {sortedWebsites.length > limit && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, sortedWebsites.length)} of{' '}
                {sortedWebsites.length} websites
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
                  disabled={page * limit >= sortedWebsites.length}
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
