export type UserRole = 'STUDENT' | 'PARENT' | 'TEACHER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  class: string;
  avatar?: string;
  isOnline: boolean;
  currentActivity?: string;
  productivityScore: number;
  lastActive: string;
}

export interface DashboardSummary {
  totalStudents: number;
  activeToday: number;
  averageProductivity: number;
  alertsToday: number;
  trends: {
    students: number;
    active: number;
    productivity: number;
  };
}

export interface ActivityData {
  time: string;
  productivity: number;
  classAverage: number;
  topPerformers: number;
}

export interface Alert {
  id: string;
  studentId: string;
  studentName: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
  resolved: boolean;
}
