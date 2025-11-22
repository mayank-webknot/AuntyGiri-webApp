/**
 * Mock Data for API Fallback
 * 
 * This file contains mock data that matches the API contract response structures.
 * Used as fallback when backend is unavailable or returns errors.
 */

import type {
  ApiResponse,
  LoginResponse,
  UserResponse,
  Activity,
  ActivitiesSummaryResponse,
  TopApp,
  WebsiteUsage,
  Screenshot,
  SystemMetric,
  MetricsSummaryResponse,
  Keystroke,
  Recommendation,
  TrendingTopic,
  RecommendationsResponse,
  UserInteraction,
  ProductivityScoreResponse,
  ActivityReportResponse,
} from '@/types/api';

// Helper to create API response wrapper
const createApiResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
  status: 'success',
  success: true,
  data,
  message,
});

// ============================================================================
// AUTHENTICATION MOCK DATA
// ============================================================================

export const mockLoginResponse: ApiResponse<LoginResponse> = createApiResponse({
  token: 'mock-jwt-token-12345',
  refreshToken: 'mock-refresh-token-12345',
  user: {
    id: 'user-1',
    email: 'admin@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'admin',
    avatar: undefined,
  },
}, 'Login successful');

export const mockUserResponse: ApiResponse<{ user: UserResponse }> = createApiResponse({
  user: {
    id: 'user-1',
    email: 'admin@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'admin',
    avatar: undefined,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
});

export const mockRefreshTokenResponse: ApiResponse<{
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}> = createApiResponse({
  accessToken: 'new-mock-jwt-token-12345',
  refreshToken: 'new-mock-refresh-token-12345',
  expiresIn: '3600',
});

export const mockLogoutResponse: ApiResponse<null> = createApiResponse(null, 'Logout successful');

// ============================================================================
// DASHBOARD MOCK DATA
// ============================================================================

export const mockDashboardSummary: ApiResponse<{
  summary: {
    totalTime: number;
    productiveTime: number;
    productivityScore: number;
    screenshotsCount: number;
    avg_cpu_usage: number;
    avg_memory_usage: number;
    avg_disk_usage: number;
  };
  comparison: {
    yesterday_total_time: number;
  };
}> = createApiResponse({
  summary: {
    totalTime: 28800, // 8 hours in seconds
    productiveTime: 21600, // 6 hours in seconds
    productivityScore: 75,
    screenshotsCount: 142,
    avg_cpu_usage: 45.5,
    avg_memory_usage: 62.3,
    avg_disk_usage: 38.7,
  },
  comparison: {
    yesterday_total_time: 25200, // 7 hours
  },
});

export const mockTimeline: ApiResponse<{
  timeline: Record<string, Array<{ app_name: string; duration: number }>>;
  activity_types: string[];
}> = createApiResponse({
  timeline: {
    '2025-01-21 09:00': [
      { app_name: 'Google Chrome', duration: 1800 },
      { app_name: 'VS Code', duration: 1200 },
    ],
    '2025-01-21 10:00': [
      { app_name: 'Google Chrome', duration: 2400 },
      { app_name: 'VS Code', duration: 1200 },
    ],
    '2025-01-21 11:00': [
      { app_name: 'VS Code', duration: 3000 },
      { app_name: 'Terminal', duration: 600 },
    ],
    '2025-01-21 12:00': [
      { app_name: 'Google Chrome', duration: 1800 },
      { app_name: 'Slack', duration: 1200 },
    ],
    '2025-01-21 13:00': [
      { app_name: 'VS Code', duration: 2400 },
      { app_name: 'Google Chrome', duration: 1200 },
    ],
    '2025-01-21 14:00': [
      { app_name: 'Google Chrome', duration: 3000 },
    ],
    '2025-01-21 15:00': [
      { app_name: 'VS Code', duration: 2400 },
      { app_name: 'Terminal', duration: 1200 },
    ],
    '2025-01-21 16:00': [
      { app_name: 'Google Chrome', duration: 1800 },
      { app_name: 'VS Code', duration: 1800 },
    ],
  },
  activity_types: ['productive', 'neutral', 'unproductive'],
});

export const mockProductivityScore: ApiResponse<ProductivityScoreResponse> = createApiResponse({
  score: 75,
  breakdown: {
    productive: 21600, // 6 hours
    neutral: 3600, // 1 hour
    distracting: 3600, // 1 hour
  },
  totalTime: 28800, // 8 hours
});

export const mockActivityReport: ApiResponse<ActivityReportResponse> = createApiResponse({
  summary: {
    totalTime: 28800,
    totalSessions: 45,
    uniqueApps: 12,
    avgCpuUsage: 45.5,
    avgMemoryUsage: 62.3,
    avgDiskUsage: 38.7,
  },
  topApps: [
    { appName: 'VS Code', totalDuration: 10800, sessions: 15 },
    { appName: 'Google Chrome', totalDuration: 9000, sessions: 20 },
    { appName: 'Terminal', totalDuration: 3600, sessions: 8 },
    { appName: 'Slack', totalDuration: 1800, sessions: 2 },
  ],
  dailyActivity: [
    { date: '2025-01-15', totalDuration: 25200 },
    { date: '2025-01-16', totalDuration: 28800 },
    { date: '2025-01-17', totalDuration: 23400 },
    { date: '2025-01-18', totalDuration: 30600 },
    { date: '2025-01-19', totalDuration: 27000 },
    { date: '2025-01-20', totalDuration: 28800 },
    { date: '2025-01-21', totalDuration: 28800 },
  ],
  topWebsites: [
    { url: 'https://github.com', totalDuration: 3600, visits: 12 },
    { url: 'https://stackoverflow.com', totalDuration: 2400, visits: 8 },
    { url: 'https://docs.google.com', totalDuration: 1800, visits: 5 },
  ],
});

// ============================================================================
// MONITOR ACTIVITIES MOCK DATA
// ============================================================================

export const mockActivities: Activity[] = [
  {
    id: 'act-1',
    studentId: 'student-1',
    timestamp: '2025-01-21T09:00:00Z',
    type: 'application',
    appName: 'VS Code',
    windowTitle: 'index.tsx - Visual Studio Code',
    duration: 1800,
    category: 'productive',
    createdAt: '2025-01-21T09:00:00Z',
    class: '10A',
    firstName: 'John',
    lastName: 'Smith',
  },
  {
    id: 'act-2',
    studentId: 'student-1',
    timestamp: '2025-01-21T09:30:00Z',
    type: 'website',
    appName: 'Google Chrome',
    windowTitle: 'GitHub - Pull Requests',
    url: 'https://github.com/pulls',
    domain: 'github.com',
    duration: 1200,
    category: 'productive',
    createdAt: '2025-01-21T09:30:00Z',
    class: '10A',
    firstName: 'John',
    lastName: 'Smith',
  },
  {
    id: 'act-3',
    studentId: 'student-1',
    timestamp: '2025-01-21T09:50:00Z',
    type: 'website',
    appName: 'Google Chrome',
    windowTitle: 'YouTube - Watch',
    url: 'https://youtube.com/watch?v=123',
    domain: 'youtube.com',
    duration: 600,
    category: 'unproductive',
    createdAt: '2025-01-21T09:50:00Z',
    class: '10A',
    firstName: 'John',
    lastName: 'Smith',
  },
  {
    id: 'act-4',
    studentId: 'student-1',
    timestamp: '2025-01-21T10:00:00Z',
    type: 'application',
    appName: 'Terminal',
    windowTitle: 'Terminal - zsh',
    duration: 900,
    category: 'productive',
    createdAt: '2025-01-21T10:00:00Z',
    class: '10A',
    firstName: 'John',
    lastName: 'Smith',
  },
  {
    id: 'act-5',
    studentId: 'student-1',
    timestamp: '2025-01-21T10:15:00Z',
    type: 'website',
    appName: 'Google Chrome',
    windowTitle: 'Stack Overflow - Question',
    url: 'https://stackoverflow.com/questions/123',
    domain: 'stackoverflow.com',
    duration: 1800,
    category: 'productive',
    createdAt: '2025-01-21T10:15:00Z',
    class: '10A',
    firstName: 'John',
    lastName: 'Smith',
  },
];

export const mockActivitiesResponse: ApiResponse<{ total: number; activities: Activity[] }> = createApiResponse({
  total: 5,
  activities: mockActivities,
});

export const mockActivitiesSummary: ApiResponse<ActivitiesSummaryResponse> = createApiResponse({
  productiveTime: 21600, // 6 hours
  neutralTime: 3600, // 1 hour
  unproductiveTime: 3600, // 1 hour
  flaggedTime: 0,
  totalTime: 28800, // 8 hours
});

// ============================================================================
// APPS & WEBSITES MOCK DATA
// ============================================================================

export const mockTopApps: ApiResponse<TopApp[]> = createApiResponse([
  {
    appName: 'VS Code',
    totalDuration: 10800, // 3 hours
    sessionsCount: 15,
    category: 'productive',
    lastUsed: '2025-01-21T16:00:00Z',
  },
  {
    appName: 'Google Chrome',
    totalDuration: 9000, // 2.5 hours
    sessionsCount: 20,
    category: 'productive',
    lastUsed: '2025-01-21T15:45:00Z',
  },
  {
    appName: 'Terminal',
    totalDuration: 3600, // 1 hour
    sessionsCount: 8,
    category: 'productive',
    lastUsed: '2025-01-21T15:30:00Z',
  },
  {
    appName: 'Slack',
    totalDuration: 1800, // 30 minutes
    sessionsCount: 2,
    category: 'neutral',
    lastUsed: '2025-01-21T12:00:00Z',
  },
  {
    appName: 'Spotify',
    totalDuration: 1200, // 20 minutes
    sessionsCount: 1,
    category: 'neutral',
    lastUsed: '2025-01-21T11:00:00Z',
  },
]);

export const mockWebsiteUsage: ApiResponse<WebsiteUsage[]> = createApiResponse([
  {
    domain: 'github.com',
    totalDuration: 3600, // 1 hour
    visitsCount: 12,
    category: 'productive',
    isBlocked: false,
    lastVisit: '2025-01-21T15:00:00Z',
  },
  {
    domain: 'stackoverflow.com',
    totalDuration: 2400, // 40 minutes
    visitsCount: 8,
    category: 'productive',
    isBlocked: false,
    lastVisit: '2025-01-21T14:30:00Z',
  },
  {
    domain: 'docs.google.com',
    totalDuration: 1800, // 30 minutes
    visitsCount: 5,
    category: 'productive',
    isBlocked: false,
    lastVisit: '2025-01-21T13:00:00Z',
  },
  {
    domain: 'youtube.com',
    totalDuration: 1200, // 20 minutes
    visitsCount: 3,
    category: 'unproductive',
    isBlocked: false,
    lastVisit: '2025-01-21T09:50:00Z',
  },
  {
    domain: 'facebook.com',
    totalDuration: 600, // 10 minutes
    visitsCount: 2,
    category: 'unproductive',
    isBlocked: true,
    lastVisit: '2025-01-21T10:00:00Z',
  },
]);

// ============================================================================
// SCREENSHOTS MOCK DATA
// ============================================================================

export const mockScreenshots: Screenshot[] = [
  {
    id: 'screenshot-1',
    studentId: 'student-1',
    url: 'https://example.com/screenshots/screenshot-1.jpg',
    thumbnailUrl: 'https://example.com/screenshots/screenshot-1-thumb.jpg',
    timestamp: '2025-01-21T09:00:00Z',
    appName: 'VS Code',
    windowTitle: 'index.tsx - Visual Studio Code',
    fileSize: 245760, // 240 KB
    width: 1920,
    height: 1080,
    isFlagged: false,
    category: 'productive',
    createdAt: '2025-01-21T09:00:00Z',
    class: '10A',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
  },
  {
    id: 'screenshot-2',
    studentId: 'student-1',
    url: 'https://example.com/screenshots/screenshot-2.jpg',
    thumbnailUrl: 'https://example.com/screenshots/screenshot-2-thumb.jpg',
    timestamp: '2025-01-21T09:30:00Z',
    appName: 'Google Chrome',
    windowTitle: 'GitHub - Pull Requests',
    fileSize: 256000, // 250 KB
    width: 1920,
    height: 1080,
    isFlagged: false,
    category: 'productive',
    createdAt: '2025-01-21T09:30:00Z',
    class: '10A',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
  },
  {
    id: 'screenshot-3',
    studentId: 'student-1',
    url: 'https://example.com/screenshots/screenshot-3.jpg',
    thumbnailUrl: 'https://example.com/screenshots/screenshot-3-thumb.jpg',
    timestamp: '2025-01-21T09:50:00Z',
    appName: 'Google Chrome',
    windowTitle: 'YouTube - Watch',
    fileSize: 230400, // 225 KB
    width: 1920,
    height: 1080,
    isFlagged: true,
    category: 'unproductive',
    createdAt: '2025-01-21T09:50:00Z',
    class: '10A',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
  },
];

export const mockScreenshotsResponse: ApiResponse<{
  total: number;
  totalPages: number;
  currentPage: number;
  screenshots: Screenshot[];
}> = createApiResponse({
  total: 3,
  totalPages: 1,
  currentPage: 1,
  screenshots: mockScreenshots,
});

export const mockMonitorScreenshotsResponse: ApiResponse<{
  total: number;
  screenshots: Screenshot[];
}> = createApiResponse({
  total: 3,
  screenshots: mockScreenshots,
});

export const mockScreenshotById: ApiResponse<Screenshot> = createApiResponse(mockScreenshots[0]);

// ============================================================================
// SYSTEM METRICS MOCK DATA
// ============================================================================

export const mockSystemMetrics: SystemMetric[] = [
  {
    id: 'metric-1',
    userId: 'user-1',
    cpu_usage: 45.5,
    memory_usage: 62.3,
    disk_usage: 38.7,
    network_in: 1024000, // 1 MB
    network_out: 512000, // 512 KB
    cpu_temperature: 65.5,
    disk_read: 2048000, // 2 MB
    disk_write: 1024000, // 1 MB
    created_at: '2025-01-21T09:00:00Z',
  },
  {
    id: 'metric-2',
    userId: 'user-1',
    cpu_usage: 52.3,
    memory_usage: 68.1,
    disk_usage: 39.2,
    network_in: 1536000, // 1.5 MB
    network_out: 768000, // 768 KB
    cpu_temperature: 67.2,
    disk_read: 2560000, // 2.5 MB
    disk_write: 1280000, // 1.25 MB
    created_at: '2025-01-21T10:00:00Z',
  },
  {
    id: 'metric-3',
    userId: 'user-1',
    cpu_usage: 38.9,
    memory_usage: 58.7,
    disk_usage: 37.5,
    network_in: 819200, // 800 KB
    network_out: 409600, // 400 KB
    cpu_temperature: 63.8,
    disk_read: 1536000, // 1.5 MB
    disk_write: 768000, // 750 KB
    created_at: '2025-01-21T11:00:00Z',
  },
];

export const mockMetricsResponse: ApiResponse<{
  total: number;
  metrics: SystemMetric[];
}> = createApiResponse({
  total: 3,
  metrics: mockSystemMetrics,
});

export const mockMetricsSummary: ApiResponse<MetricsSummaryResponse> = createApiResponse({
  avg_cpu_usage: 45.57,
  avg_memory_usage: 63.03,
  avg_disk_usage: 38.47,
  avg_network_in: 1126400,
  avg_network_out: 563200,
  avg_cpu_temp: 65.5,
  avg_disk_read: 2048000,
  avg_disk_write: 1024000,
});

// ============================================================================
// KEYSTROKES MOCK DATA
// ============================================================================

export const mockKeystrokes: Keystroke[] = [
  {
    id: 'keystroke-1',
    userId: 'user-1',
    key_code: 72, // 'h'
    key_char: 'h',
    timestamp: '2025-01-21T09:00:00Z',
    app_name: 'VS Code',
  },
  {
    id: 'keystroke-2',
    userId: 'user-1',
    key_code: 69, // 'e'
    key_char: 'e',
    timestamp: '2025-01-21T09:00:01Z',
    app_name: 'VS Code',
  },
  {
    id: 'keystroke-3',
    userId: 'user-1',
    key_code: 76, // 'l'
    key_char: 'l',
    timestamp: '2025-01-21T09:00:02Z',
    app_name: 'VS Code',
  },
  {
    id: 'keystroke-4',
    userId: 'user-1',
    key_code: 76, // 'l'
    key_char: 'l',
    timestamp: '2025-01-21T09:00:03Z',
    app_name: 'VS Code',
  },
  {
    id: 'keystroke-5',
    userId: 'user-1',
    key_code: 79, // 'o'
    key_char: 'o',
    timestamp: '2025-01-21T09:00:04Z',
    app_name: 'VS Code',
  },
];

export const mockKeystrokesResponse: ApiResponse<{
  total: number;
  keystrokes: Keystroke[];
}> = createApiResponse({
  total: 5,
  keystrokes: mockKeystrokes,
});

// ============================================================================
// RECOMMENDATIONS MOCK DATA
// ============================================================================

export const mockRecommendations: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'Introduction to React Hooks',
    description: 'Learn how to use React Hooks effectively',
    content_type: 'video',
    url: 'https://example.com/react-hooks',
    thumbnail_url: 'https://example.com/thumbnails/react-hooks.jpg',
    category: 'programming',
    subcategory: 'web-development',
    target_standards: [9, 10, 11, 12],
    difficulty_level: 'beginner',
    duration_minutes: 45,
    language: 'en',
    source: 'YouTube',
    author: 'React Team',
    rating: 4.5,
    tags: ['react', 'hooks', 'javascript', 'frontend'],
    trending_score: 8.5,
    personalization_score: 9.2,
    created_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'rec-2',
    title: 'Python Data Structures',
    description: 'Master Python data structures and algorithms',
    content_type: 'course',
    url: 'https://example.com/python-ds',
    thumbnail_url: 'https://example.com/thumbnails/python-ds.jpg',
    category: 'programming',
    subcategory: 'data-science',
    target_standards: [10, 11, 12],
    difficulty_level: 'intermediate',
    duration_minutes: 120,
    language: 'en',
    source: 'Coursera',
    author: 'Python Institute',
    rating: 4.8,
    tags: ['python', 'data-structures', 'algorithms'],
    trending_score: 9.1,
    personalization_score: 8.7,
    created_at: '2025-01-14T00:00:00Z',
  },
  {
    id: 'rec-3',
    title: 'Machine Learning Basics',
    description: 'Introduction to machine learning concepts',
    content_type: 'article',
    url: 'https://example.com/ml-basics',
    thumbnail_url: 'https://example.com/thumbnails/ml-basics.jpg',
    category: 'ai-ml',
    subcategory: 'machine-learning',
    target_standards: [11, 12],
    difficulty_level: 'intermediate',
    duration_minutes: 30,
    language: 'en',
    source: 'Medium',
    author: 'ML Expert',
    rating: 4.3,
    tags: ['machine-learning', 'ai', 'data-science'],
    trending_score: 7.8,
    personalization_score: 8.5,
    created_at: '2025-01-13T00:00:00Z',
  },
];

export const mockRecommendationsResponse: ApiResponse<RecommendationsResponse> = createApiResponse({
  total: 3,
  recommendations: mockRecommendations,
  pagination: {
    limit: 20,
    offset: 0,
    total_pages: 1,
  },
});

export const mockTrendingTopics: TrendingTopic[] = [
  {
    id: 'topic-1',
    topic_name: 'Web Development',
    description: 'Modern web development technologies and frameworks',
    category: 'programming',
    target_age_groups: [14, 15, 16, 17, 18],
    target_standards: [9, 10, 11, 12],
    relevance_in_india: 'High demand in IT sector',
    future_prospects: 'Growing field with excellent career opportunities',
    trending_score: 9.5,
    growth_rate: 15.2,
    job_market_demand: 'Very High',
    salary_range: '₹5-20 LPA',
    skills_required: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
    related_careers: ['Frontend Developer', 'Full Stack Developer', 'Web Designer'],
    learning_path: ['HTML/CSS Basics', 'JavaScript Fundamentals', 'React Framework', 'Backend Development'],
    created_at: '2025-01-10T00:00:00Z',
  },
  {
    id: 'topic-2',
    topic_name: 'Data Science',
    description: 'Data analysis, visualization, and machine learning',
    category: 'data-science',
    target_age_groups: [15, 16, 17, 18],
    target_standards: [10, 11, 12],
    relevance_in_india: 'High demand in analytics and AI sectors',
    future_prospects: 'Rapidly growing field with high earning potential',
    trending_score: 9.2,
    growth_rate: 18.5,
    job_market_demand: 'Very High',
    salary_range: '₹6-25 LPA',
    skills_required: ['Python', 'SQL', 'Statistics', 'Machine Learning'],
    related_careers: ['Data Analyst', 'Data Scientist', 'ML Engineer'],
    learning_path: ['Python Basics', 'Data Analysis', 'Statistics', 'Machine Learning'],
    created_at: '2025-01-09T00:00:00Z',
  },
];

export const mockTrendingTopicsResponse: ApiResponse<{ trending_topics: TrendingTopic[] }> = createApiResponse({
  trending_topics: mockTrendingTopics,
});

export const mockUserInteractions: UserInteraction[] = [
  {
    id: 'interaction-1',
    interaction_type: 'viewed',
    rating: null,
    time_spent_minutes: 5,
    completion_percentage: null,
    feedback: null,
    recommended_at: '2025-01-20T10:00:00Z',
    interacted_at: '2025-01-20T10:05:00Z',
    Recommendation: {
      title: 'Introduction to React Hooks',
      content_type: 'video',
      category: 'programming',
      url: 'https://example.com/react-hooks',
      thumbnail_url: 'https://example.com/thumbnails/react-hooks.jpg',
    },
  },
  {
    id: 'interaction-2',
    interaction_type: 'liked',
    rating: 5,
    time_spent_minutes: 45,
    completion_percentage: 100,
    feedback: 'Great tutorial!',
    recommended_at: '2025-01-19T14:00:00Z',
    interacted_at: '2025-01-19T14:45:00Z',
    Recommendation: {
      title: 'Python Data Structures',
      content_type: 'course',
      category: 'programming',
      url: 'https://example.com/python-ds',
      thumbnail_url: 'https://example.com/thumbnails/python-ds.jpg',
    },
  },
];

export const mockUserInteractionsResponse: ApiResponse<{
  total: number;
  interactions: UserInteraction[];
  pagination: { limit: number; offset: number; total_pages: number };
}> = createApiResponse({
  total: 2,
  interactions: mockUserInteractions,
  pagination: {
    limit: 50,
    offset: 0,
    total_pages: 1,
  },
});

export const mockCategoriesResponse: ApiResponse<{
  categories: Array<{ value: string; label: string }>;
}> = createApiResponse({
  categories: [
    { value: 'programming', label: 'Programming' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'ai-ml', label: 'AI & Machine Learning' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-development', label: 'Mobile Development' },
  ],
});

export const mockContentTypesResponse: ApiResponse<{
  content_types: Array<{ value: string; label: string }>;
}> = createApiResponse({
  content_types: [
    { value: 'video', label: 'Video' },
    { value: 'article', label: 'Article' },
    { value: 'course', label: 'Course' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'documentation', label: 'Documentation' },
  ],
});

export const mockRecommendationStats: ApiResponse<{
  total_recommendations: number;
  total_trending_topics: number;
  total_interactions: number;
  popular_categories: Array<{ category: string; count: number }>;
  most_interacted: Array<{
    recommendation_id: string;
    interaction_count: number;
    Recommendation: {
      title: string;
      category: string;
      content_type: string;
    };
  }>;
}> = createApiResponse({
  total_recommendations: 150,
  total_trending_topics: 25,
  total_interactions: 342,
  popular_categories: [
    { category: 'programming', count: 45 },
    { category: 'data-science', count: 32 },
    { category: 'ai-ml', count: 28 },
  ],
  most_interacted: [
    {
      recommendation_id: 'rec-1',
      interaction_count: 45,
      Recommendation: {
        title: 'Introduction to React Hooks',
        category: 'programming',
        content_type: 'video',
      },
    },
    {
      recommendation_id: 'rec-2',
      interaction_count: 38,
      Recommendation: {
        title: 'Python Data Structures',
        category: 'programming',
        content_type: 'course',
      },
    },
  ],
});

// ============================================================================
// HEALTH CHECK MOCK DATA
// ============================================================================

export const mockHealthResponse = {
  status: 'ok' as const,
  timestamp: new Date().toISOString(),
  uptime: 3600, // 1 hour in seconds
};

// ============================================================================
// MOCK DATA MAPPER
// ============================================================================

/**
 * Get mock data for a specific endpoint
 * Handles both exact matches and pattern matching for dynamic routes
 */
export const getMockData = (endpoint: string, method: string = 'GET'): any => {
  // Normalize endpoint - remove query parameters
  const normalizedEndpoint = endpoint.split('?')[0];
  
  const endpointMap: Record<string, any> = {
    // Auth endpoints
    'POST /auth/login': mockLoginResponse,
    'GET /auth/me': mockUserResponse,
    'POST /auth/refresh-token': mockRefreshTokenResponse,
    'POST /auth/logout': mockLogoutResponse,

    // Dashboard endpoints
    'GET /dashboard/summary': mockDashboardSummary,
    'GET /dashboard/timeline': mockTimeline,
    'GET /dashboard/productivity-score': mockProductivityScore,
    'GET /dashboard/activity-report': mockActivityReport,
    'GET /dashboard/top-apps': mockTopApps,
    'GET /dashboard/website-usage': mockWebsiteUsage,
    'GET /dashboard/screenshots': mockScreenshotsResponse,

    // Monitor endpoints
    'GET /monitor/activities': mockActivitiesResponse,
    'GET /monitor/activities/summary': mockActivitiesSummary,
    'GET /monitor/metrics': mockMetricsResponse,
    'GET /monitor/metrics/summary': mockMetricsSummary,
    'GET /monitor/keystrokes': mockKeystrokesResponse,
    'GET /monitor/screenshots': mockMonitorScreenshotsResponse,

    // Recommendations endpoints
    'GET /recommendations': mockRecommendationsResponse,
    'GET /recommendations/trending-topics': mockTrendingTopicsResponse,
    'GET /recommendations/interactions': mockUserInteractionsResponse,
    'GET /recommendations/meta/categories': mockCategoriesResponse,
    'GET /recommendations/meta/content-types': mockContentTypesResponse,
    'GET /recommendations/stats': mockRecommendationStats,
  };

  // Try exact match first
  const key = `${method} ${normalizedEndpoint}`;
  if (endpointMap[key]) {
    return endpointMap[key];
  }

  // Handle dynamic routes (e.g., /monitor/screenshots/{id})
  if (method === 'GET' && normalizedEndpoint.startsWith('/monitor/screenshots/')) {
    // Extract ID from path (e.g., /monitor/screenshots/screenshot-1)
    return mockScreenshotById;
  }

  // Handle category routes (e.g., /recommendations/category/{category})
  if (method === 'GET' && normalizedEndpoint.startsWith('/recommendations/category/')) {
    return mockRecommendationsResponse;
  }

  // Handle topic routes (e.g., /recommendations/topic/{topicId})
  if (method === 'GET' && normalizedEndpoint.startsWith('/recommendations/topic/')) {
    return createApiResponse({
      topic: mockTrendingTopics[0],
      recommendations: mockRecommendations,
    });
  }

  // Handle search routes (e.g., /recommendations/search?q=...)
  if (method === 'GET' && normalizedEndpoint.startsWith('/recommendations/search')) {
    return mockRecommendationsResponse;
  }

  // Handle career recommendations
  if (method === 'GET' && normalizedEndpoint.startsWith('/recommendations/career')) {
    return createApiResponse({
      career_topics: mockTrendingTopics,
      recommendations: mockRecommendations,
    });
  }

  // Handle interaction recording (POST)
  if (method === 'POST' && normalizedEndpoint.startsWith('/recommendations/interactions/')) {
    return createApiResponse({
      interaction: {
        id: 'interaction-new',
        user_id: 'user-1',
        recommendation_id: normalizedEndpoint.split('/').pop() || 'rec-1',
        interaction_type: 'viewed',
        rating: null,
        time_spent_minutes: null,
        completion_percentage: null,
        feedback: null,
        recommended_at: new Date().toISOString(),
        interacted_at: new Date().toISOString(),
      },
    });
  }

  return null;
};

