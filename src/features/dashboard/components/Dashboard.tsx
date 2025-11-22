import React from 'react';
import { useAppSelector } from '@/app/store/hooks';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { LogOut, User, Users, BookOpen, BarChart3 } from 'lucide-react';
import { UserRole } from '@/shared/types';

export const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { logout } = useAuth();

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-purple-100 text-purple-800';
      case UserRole.TEACHER:
        return 'bg-blue-100 text-blue-800';
      case UserRole.PARENT:
        return 'bg-green-100 text-green-800';
      case UserRole.STUDENT:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDashboardStats = () => {
    switch (user?.role) {
      case UserRole.ADMIN:
        return [
          { title: 'Total Users', value: '1,234', icon: Users, color: 'text-blue-600' },
          { title: 'Active Teachers', value: '45', icon: User, color: 'text-green-600' },
          { title: 'Total Students', value: '890', icon: BookOpen, color: 'text-purple-600' },
          { title: 'System Health', value: '98%', icon: BarChart3, color: 'text-orange-600' },
        ];
      case UserRole.TEACHER:
        return [
          { title: 'My Classes', value: '6', icon: BookOpen, color: 'text-blue-600' },
          { title: 'Total Students', value: '156', icon: Users, color: 'text-green-600' },
          { title: 'Assignments', value: '23', icon: BarChart3, color: 'text-purple-600' },
          { title: 'Avg Performance', value: '85%', icon: BarChart3, color: 'text-orange-600' },
        ];
      case UserRole.PARENT:
        return [
          { title: 'My Children', value: '2', icon: Users, color: 'text-blue-600' },
          { title: 'Active Classes', value: '8', icon: BookOpen, color: 'text-green-600' },
          { title: 'Assignments Due', value: '5', icon: BarChart3, color: 'text-purple-600' },
          { title: 'Avg Grade', value: 'A-', icon: BarChart3, color: 'text-orange-600' },
        ];
      case UserRole.STUDENT:
        return [
          { title: 'My Classes', value: '7', icon: BookOpen, color: 'text-blue-600' },
          { title: 'Assignments', value: '12', icon: BarChart3, color: 'text-green-600' },
          { title: 'Completed', value: '8', icon: BarChart3, color: 'text-purple-600' },
          { title: 'Current GPA', value: '3.7', icon: BarChart3, color: 'text-orange-600' },
        ];
      default:
        return [];
    }
  };

  const stats = getDashboardStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Analytics Dashboard
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user?.role || UserRole.STUDENT)}`}>
                {user?.role}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}!
          </h2>
          <p className="text-gray-600">
            Here's what's happening with your {user?.role.toLowerCase()} dashboard today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                <BookOpen className="h-6 w-6" />
                <span>View Classes</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span>Analytics</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Users className="h-6 w-6" />
                <span>Manage Users</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Notice */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-blue-800">
                <strong>Demo Mode:</strong> This is a demonstration of the authentication and dashboard system. 
                The API endpoints are not connected to a real backend.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
