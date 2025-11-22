import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Send,
  Download,
  Eye,
  LogOut,
} from 'lucide-react';
import { useGetStudentsQuery } from '../services/studentsApi';
import type { SortField, SortOrder, StudentsListParams } from '@/shared/types';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { websocketService } from '@/shared/services/websocket';
import { formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Select } from '@/shared/components/ui/select';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { studentsApi } from '../services/studentsApi';

interface SortConfig {
  field: SortField | null;
  order: SortOrder;
}

export const StudentsList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { logout } = useAuth();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'online' | 'offline' | 'all'>('all');
  const [productivityMin, setProductivityMin] = useState<number>(0);
  const [productivityMax, setProductivityMax] = useState<number>(100);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: null, order: 'asc' });
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

  // Debounce search term
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Build query params
  const queryParams: StudentsListParams = {
    page,
    limit,
    search: debouncedSearch || undefined,
    class: selectedClass !== 'all' ? selectedClass : undefined,
    status: statusFilter,
    productivityMin: productivityMin > 0 ? productivityMin : undefined,
    productivityMax: productivityMax < 100 ? productivityMax : undefined,
    sortBy: sortConfig.field || undefined,
    sortOrder: sortConfig.order,
  };

  // Fetch students
  const {
    data: studentsData,
    isLoading,
  } = useGetStudentsQuery(queryParams);

  const students = studentsData?.data?.students || [];
  const pagination = studentsData?.data?.pagination;

  // WebSocket real-time updates
  useEffect(() => {
    websocketService.connect();

    const handleStudentOnline = (data: { studentId: string }) => {
      dispatch(
        studentsApi.util.updateQueryData(
          'getStudents',
          queryParams,
          (draft) => {
            if (draft?.data) {
              const student = draft.data.students.find((s) => s.id === data.studentId);
              if (student) {
                student.onlineStatus = 'online';
                student.lastActive = new Date().toISOString();
              }
            }
          }
        )
      );
    };

    const handleStudentOffline = (data: { studentId: string }) => {
      dispatch(
        studentsApi.util.updateQueryData(
          'getStudents',
          queryParams,
          (draft) => {
            if (draft?.data) {
              const student = draft.data.students.find((s) => s.id === data.studentId);
              if (student) {
                student.onlineStatus = 'offline';
                student.lastActive = new Date().toISOString();
              }
            }
          }
        )
      );
    };

    websocketService.on('student:online', handleStudentOnline);
    websocketService.on('student:offline', handleStudentOffline);

    return () => {
      websocketService.off('student:online', handleStudentOnline);
      websocketService.off('student:offline', handleStudentOffline);
    };
  }, [dispatch, queryParams]);

  // Handle sorting
  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortConfig.order === 'asc' ? (
      <ArrowUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-blue-600" />
    );
  };

  // Handle row selection
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedStudents.size === students.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(students.map((s) => s.id)));
    }
  };

  // Bulk actions
  const handleBulkMessage = () => {
    console.log('Send message to:', Array.from(selectedStudents));
    // Implement bulk message functionality
  };

  const handleBulkExport = () => {
    console.log('Export data for:', Array.from(selectedStudents));
    // Implement export functionality
  };

  // Get available classes from students
  const availableClasses = Array.from(
    new Set(students.map((s) => s.class))
  ).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Students</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and monitor your students' activity and performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                size="sm"
              >
                Dashboard
              </Button>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search & Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, or roll number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Class Filter */}
              <div>
                <Select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">All Classes</option>
                  {availableClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <Select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as 'online' | 'offline' | 'all');
                    setPage(1);
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </Select>
              </div>

              {/* Productivity Range */}
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  min="0"
                  max="100"
                  value={productivityMin}
                  onChange={(e) => {
                    setProductivityMin(Number(e.target.value));
                    setPage(1);
                  }}
                  className="w-20"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  min="0"
                  max="100"
                  value={productivityMax}
                  onChange={(e) => {
                    setProductivityMax(Number(e.target.value));
                    setPage(1);
                  }}
                  className="w-20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedStudents.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between"
          >
            <span className="text-sm font-medium text-blue-900">
              {selectedStudents.size} student(s) selected
            </span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkMessage}
                className="flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkExport}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </Button>
            </div>
          </motion.div>
        )}

        {/* Students Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedStudents.size === students.length && students.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-16">Avatar</TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center space-x-1 hover:text-blue-600"
                      >
                        <span>Name</span>
                        {getSortIcon('name')}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort('class')}
                        className="flex items-center space-x-1 hover:text-blue-600"
                      >
                        <span>Class & Roll</span>
                        {getSortIcon('class')}
                      </button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort('productivityScore')}
                        className="flex items-center space-x-1 hover:text-blue-600"
                      >
                        <span>Productivity</span>
                        {getSortIcon('productivityScore')}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort('lastActive')}
                        className="flex items-center space-x-1 hover:text-blue-600"
                      >
                        <span>Last Active</span>
                        {getSortIcon('lastActive')}
                      </button>
                    </TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Loading skeletons
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-4" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-10 w-10 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : students.length === 0 ? (
                    // Empty state
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <p className="text-gray-500">No students found</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Try adjusting your search or filters
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Student rows
                    students.map((student) => (
                      <TableRow
                        key={student.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => navigate(`/students/${student.id}`)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedStudents.has(student.id)}
                            onChange={() => toggleStudentSelection(student.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Avatar>
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>
                              {student.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <span className="font-medium">{student.class}</span>
                            <span className="text-gray-500 ml-2">#{student.rollNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div
                              className={`h-2 w-2 rounded-full ${
                                student.onlineStatus === 'online'
                                  ? 'bg-green-500 animate-pulse'
                                  : 'bg-gray-400'
                              }`}
                            />
                            <span className="text-sm capitalize">{student.onlineStatus}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                              <div
                                className={`h-2 rounded-full ${
                                  student.productivityScore >= 70
                                    ? 'bg-green-500'
                                    : student.productivityScore >= 40
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${student.productivityScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-12">
                              {student.productivityScore}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {formatDistanceToNow(new Date(student.lastActive), {
                              addSuffix: true,
                            })}
                          </span>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/students/${student.id}`)}
                            className="flex items-center space-x-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <Select
                value={limit.toString()}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="w-20"
              >
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </Select>
              <span className="text-sm text-gray-600">
                Showing {pagination.page * pagination.limit - pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} students
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
