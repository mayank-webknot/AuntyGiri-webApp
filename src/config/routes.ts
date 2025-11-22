export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  UNAUTHORIZED: '/unauthorized',
  
  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    ANALYTICS: '/admin/analytics',
  },
  
  // Teacher routes
  TEACHER: {
    DASHBOARD: '/teacher/dashboard',
    STUDENTS: '/teacher/students',
    CLASSES: '/teacher/classes',
    ANALYTICS: '/teacher/analytics',
  },
  
  // Parent routes
  PARENT: {
    DASHBOARD: '/parent/dashboard',
    CHILDREN: '/parent/children',
    PROGRESS: '/parent/progress',
  },
  
  // Student routes
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    ASSIGNMENTS: '/student/assignments',
    GRADES: '/student/grades',
  },
  STUDENTS: {
    LIST: '/students',
    DETAILS: (id: string) => `/students/${id}`,
  },
} as const;
