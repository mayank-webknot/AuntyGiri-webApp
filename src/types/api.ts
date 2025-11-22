// API Response Types

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string;
  };
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Types
export interface DashboardSummaryResponse {
  totalStudents: number;
  activeToday: number;
  activeTodayPercentage: number;
  averageProductivity: number;
  alertsToday: {
    total: number;
    high: number;
    medium: number;
    low: number;
  };
  trends: {
    students: number;
    active: number;
    productivity: number;
  };
}

export interface TimelineData {
  timeSlot: string;
  count: number;
  totalDuration: number;
  productiveDuration: number;
}

// Student Types
export interface StudentListItem {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  rollNumber: string;
  class: string;
  avatar?: string;
  isOnline: boolean;
  productivity: number;
  lastActive: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudentDetailResponse {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  rollNumber: string;
  class: string;
  avatar?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentSummaryResponse {
  focusTime: number;
  productiveTime: number;
  warnings: number;
  screenshotsCount: number;
}

// Activity Types
export interface Activity {
  id: string;
  studentId: string;
  timestamp: string;
  type: 'application' | 'website';
  appName: string;
  windowTitle: string;
  url?: string;
  domain?: string;
  duration: number;
  category: 'productive' | 'neutral' | 'unproductive' | 'flagged';
  screenshotId?: string;
  createdAt: string;
  class?: string;
  firstName?: string;
  lastName?: string;
}

export interface ActivitiesSummaryResponse {
  productiveTime: number;
  neutralTime: number;
  unproductiveTime: number;
  flaggedTime: number;
  totalTime: number;
}

// Apps & Websites Types
export interface TopApp {
  appName: string;
  totalDuration: number;
  sessionsCount: number;
  category: string;
  lastUsed: string;
}

export interface WebsiteUsage {
  domain: string;
  totalDuration: number;
  visitsCount: number;
  category: string;
  isBlocked: boolean;
  lastVisit: string;
}

// Screenshot Types
export interface Screenshot {
  id: string;
  studentId: string;
  url: string;
  thumbnailUrl: string;
  timestamp: string;
  appName: string;
  windowTitle: string;
  fileSize: number;
  width: number;
  height: number;
  isFlagged: boolean;
  category: string;
  createdAt: string;
  class?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

// Query Parameters
export interface StudentsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  class?: string;
  status?: string;
  productivityMin?: number;
  productivityMax?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface TimelineQueryParams {
  date?: string; // YYYY-MM-DD
  interval?: 'hour' | 'day';
}

export interface ActivitiesQueryParams {
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export interface TopAppsQueryParams {
  limit?: number;
  startDate?: string;
  endDate?: string;
  userId?: string;
}

export interface WebsiteUsageQueryParams {
  limit?: number;
  startDate?: string;
  userId?: string;
}

export interface ScreenshotsQueryParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  flaggedOnly?: boolean;
  productiveOnly?: boolean;
  search?: string;
  sortBy?: string;
  userId?: string;
}

