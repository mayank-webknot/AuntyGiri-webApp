export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    LIST: '/users',
    PROFILE: '/users/profile',
  },
  STUDENTS: {
    LIST: '/students',
    DETAILS: (id: string) => `/students/${id}`,
  },
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    PERFORMANCE: '/analytics/performance',
  },
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
    TIMELINE: '/dashboard/timeline',
  },
} as const;
