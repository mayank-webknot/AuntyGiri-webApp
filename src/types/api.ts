// API Response Types
// Note: Contract uses { status: "success" } but we'll handle both formats

export interface ApiResponse<T> {
  status?: 'success' | 'error'; // Contract format
  success?: boolean; // Alternative format
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
  date?: string; // ISO8601 date (YYYY-MM-DD)
  interval?: 'minute' | 'hour' | 'day'; // Contract allows: 'minute' | 'hour' | 'day'
}

export interface ActivitiesQueryParams {
  startDate?: string; // Contract format: ISO8601
  endDate?: string; // Contract format: ISO8601
  limit?: number; // Contract default: 100
  offset?: number; // Contract default: 0
  appName?: string; // Filter by app name
  // Legacy support (from Swagger)
  studentId?: string;
  from?: string;
  to?: string;
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
  endDate?: string;
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

// Monitor Screenshots Query (different from dashboard/screenshots)
export interface MonitorScreenshotsQueryParams {
  startDate?: string; // ISO8601
  endDate?: string; // ISO8601
  limit?: number; // default: 50
  offset?: number; // default: 0
}

// Keystrokes Types
export interface Keystroke {
  id: string;
  userId: string;
  key_code: number;
  key_char: string | null;
  timestamp: string; // ISO8601
  app_name: string;
}

export interface KeystrokesQueryParams {
  start_date?: string; // ISO8601 - NOTE: snake_case for monitor APIs
  end_date?: string; // ISO8601 - NOTE: snake_case for monitor APIs
  limit?: number; // default: 100
  offset?: number; // default: 0
  app_name?: string;
}

// System Metrics Types
export interface SystemMetric {
  id: string;
  userId: string;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_in: number | null;
  network_out: number | null;
  cpu_temperature: number | null;
  disk_read: number | null;
  disk_write: number | null;
  created_at: string; // ISO8601
}

export interface MetricsQueryParams {
  start_date?: string; // ISO8601 - NOTE: snake_case for monitor APIs
  end_date?: string; // ISO8601 - NOTE: snake_case for monitor APIs
  limit?: number; // default: 100
  offset?: number; // default: 0
}

export interface MetricsSummaryResponse {
  avg_cpu_usage: number;
  avg_memory_usage: number;
  avg_disk_usage: number;
  avg_network_in: number;
  avg_network_out: number;
  avg_cpu_temp: number;
  avg_disk_read: number;
  avg_disk_write: number;
}

// Dashboard Additional Types
export interface ProductivityScoreResponse {
  score: number; // 0-100
  breakdown: {
    productive: number; // seconds
    neutral: number; // seconds
    distracting: number; // seconds
  };
  totalTime: number; // seconds
}

export interface ActivityReportResponse {
  summary: {
    totalTime: number; // seconds
    totalSessions: number;
    uniqueApps: number;
    avgCpuUsage: number;
    avgMemoryUsage: number;
    avgDiskUsage: number;
  };
  topApps: Array<{
    appName: string;
    totalDuration: number; // seconds
    sessions: number;
  }>;
  dailyActivity: Array<{
    date: string; // ISO8601 date
    totalDuration: number; // seconds
  }>;
  topWebsites: Array<{
    url: string;
    totalDuration: number; // seconds
    visits: number;
  }>;
}

// Activity Predictions Types
export interface ActivityPredictionsResponse {
  user_profile: {
    username: string;
    student_standard: number;
    role: string;
  };
  activity_summary: {
    total_activities: number;
    time_range: {
      start: string; // ISO8601
      end: string; // ISO8601
      daysTracked: number;
    };
    total_time_hours: string;
    top_apps: Array<{
      app: string;
      usageHours: string;
      sessions: number;
    }>;
    category_breakdown: {
      productive_hours: string;
      neutral_hours: string;
      distracting_hours: string;
    };
  };
  ai_analysis: {
    predictions: {
      next_week: string[];
      next_month: string[];
    };
    behavioral_patterns: string[];
    recommendations: string[];
    concerns: string[];
    productivity_trend: 'increasing' | 'decreasing' | 'stable';
    confidence_score: number;
    analysis_date: string; // ISO8601
  };
}

// Recommendation Types
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  content_type: string;
  url: string;
  thumbnail_url: string;
  category: string;
  subcategory: string;
  target_standards: number[];
  difficulty_level: string;
  duration_minutes: number;
  language: string;
  source: string;
  author: string;
  rating: number;
  tags: string[];
  trending_score: number;
  personalization_score: number;
  created_at: string; // ISO8601
  user_interaction?: {
    interaction_type: string;
    rating: number;
    recommended_at: string; // ISO8601
  };
}

export interface TrendingTopic {
  id: string;
  topic_name: string;
  description: string;
  category: string;
  target_age_groups: number[];
  target_standards: number[];
  relevance_in_india: string;
  future_prospects: string;
  trending_score: number;
  growth_rate: number;
  job_market_demand: string;
  salary_range: string;
  skills_required: string[];
  related_careers: string[];
  learning_path: string[];
  created_at: string; // ISO8601
}

export interface RecommendationsQueryParams {
  limit?: number; // default: 20
  offset?: number; // default: 0
  category?: string;
  content_type?: string;
  difficulty_level?: string;
}

export interface RecommendationsResponse {
  total: number;
  recommendations: Recommendation[];
  pagination: {
    limit: number;
    offset: number;
    total_pages: number;
  };
}

export interface UserInteraction {
  id: string;
  interaction_type: string;
  rating: number | null;
  time_spent_minutes: number | null;
  completion_percentage: number | null;
  feedback: string | null;
  recommended_at: string; // ISO8601
  interacted_at: string; // ISO8601
  Recommendation: {
    title: string;
    content_type: string;
    category: string;
    url: string;
    thumbnail_url: string;
  };
}

export interface InteractionsQueryParams {
  limit?: number; // default: 50
  offset?: number; // default: 0
  interaction_type?: string;
}

