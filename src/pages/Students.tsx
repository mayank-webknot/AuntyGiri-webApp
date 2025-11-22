import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Search, Eye } from 'lucide-react';
import { Student } from '@/types';
import { cn } from '@/lib/utils';

// Mock data for demo
const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@school.com',
    rollNumber: 'CS-2024-001',
    class: 'Computer Science',
    isOnline: true,
    currentActivity: 'VSCode - Working on React Project',
    productivityScore: 85,
    lastActive: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike.c@school.com',
    rollNumber: 'CS-2024-002',
    class: 'Computer Science',
    isOnline: true,
    currentActivity: 'Chrome - Reading Documentation',
    productivityScore: 72,
    lastActive: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Emma Davis',
    email: 'emma.d@school.com',
    rollNumber: 'CS-2024-003',
    class: 'Computer Science',
    isOnline: false,
    productivityScore: 68,
    lastActive: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'james.w@school.com',
    rollNumber: 'CS-2024-004',
    class: 'Computer Science',
    isOnline: true,
    currentActivity: 'Terminal - Running Tests',
    productivityScore: 91,
    lastActive: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    email: 'lisa.a@school.com',
    rollNumber: 'CS-2024-005',
    class: 'Computer Science',
    isOnline: false,
    productivityScore: 78,
    lastActive: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
  },
];

const Students = () => {
  const [students] = useState<Student[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProductivityColor = (score: number) => {
    if (score >= 80) return 'productivity-high';
    if (score >= 60) return 'productivity-medium';
    return 'productivity-low';
  };

  const formatLastActive = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="container py-8 px-4 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Students</h1>
        <p className="text-muted-foreground">
          Monitor and manage all students in your class
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>All Students</CardTitle>
              <CardDescription>
                {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Current Activity</TableHead>
                  <TableHead>Productivity</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {student.name.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {student.rollNumber}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm">
                        {student.isOnline ? (
                          <span className="text-foreground">
                            {student.currentActivity || 'Active'}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={student.productivityScore} className="h-2 w-20" />
                        <span className={cn('text-sm font-medium', getProductivityColor(student.productivityScore))}>
                          {student.productivityScore}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatLastActive(student.lastActive)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Link to={`/students/${student.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Students;
