import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/store/hooks';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { UserRole } from '@/shared/types';
import { ROUTES } from '@/config/routes';

// Pages
import { LoginForm } from '@/features/auth/components/LoginForm';
import { DashboardHome } from '@/features/dashboard/components/DashboardHome';
import { StudentsList } from '@/features/students/components/StudentsList';
import { StudentDetail } from '@/features/students/components/StudentDetail';
import { UnauthorizedPage } from '@/shared/components/UnauthorizedPage';

export const AppRouter: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const getDashboardRoute = () => {
    if (!user) return ROUTES.LOGIN;
    
    switch (user.role) {
      case UserRole.ADMIN:
        return ROUTES.ADMIN.DASHBOARD;
      case UserRole.TEACHER:
        return ROUTES.TEACHER.DASHBOARD;
      case UserRole.PARENT:
        return ROUTES.PARENT.DASHBOARD;
      case UserRole.STUDENT:
        return ROUTES.STUDENT.DASHBOARD;
      default:
        return ROUTES.DASHBOARD;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route 
          path={ROUTES.LOGIN} 
          element={
            isAuthenticated ? (
              <Navigate to={getDashboardRoute()} replace />
            ) : (
              <LoginForm />
            )
          } 
        />
        
        <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />

        {/* Protected routes */}
        <Route
          path={ROUTES.HOME}
          element={
            <ProtectedRoute>
              <Navigate to={getDashboardRoute()} replace />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardHome />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path={ROUTES.ADMIN.DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <DashboardHome />
            </ProtectedRoute>
          }
        />

        {/* Teacher routes */}
        <Route
          path={ROUTES.TEACHER.DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
              <DashboardHome />
            </ProtectedRoute>
          }
        />

        {/* Parent routes */}
        <Route
          path={ROUTES.PARENT.DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[UserRole.PARENT]}>
              <DashboardHome />
            </ProtectedRoute>
          }
        />

        {/* Student routes */}
        <Route
          path={ROUTES.STUDENT.DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
              <DashboardHome />
            </ProtectedRoute>
          }
        />

        {/* Students routes */}
        <Route
          path={ROUTES.STUDENTS.LIST}
          element={
            <ProtectedRoute allowedRoles={[UserRole.TEACHER, UserRole.ADMIN]}>
              <StudentsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/:id"
          element={
            <ProtectedRoute allowedRoles={[UserRole.TEACHER, UserRole.ADMIN]}>
              <StudentDetail />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
};
