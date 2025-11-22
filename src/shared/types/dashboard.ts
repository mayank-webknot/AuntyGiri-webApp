export interface DashboardSummary {
  totalStudents: {
    count: number;
    trend: number; // percentage change vs last week
    trendType: 'up' | 'down' | 'neutral';
  };
  activeToday: {
    count: number;
    percentage: number;
    trend: number; // percentage change vs yesterday
    trendType: 'up' | 'down' | 'neutral';
  };
  averageProductivity: {
    score: number; // percentage (0-100)
    trend: number; // percentage change vs yesterday
    trendType: 'up' | 'down' | 'neutral';
  };
  alertsToday: {
    total: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface Activity {
  id: string;
  studentName: string;
  currentApp: string;
  activity: string;
  duration: string; // e.g., "15m"
  productivityIndicator: 'productive' | 'neutral' | 'flagged';
  timestamp: string;
}

export interface DashboardAlert {
  id: string;
  studentName: string;
  alertType: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  message?: string;
}

export interface ProductivityData {
  date: string;
  classAverage: number;
  topPerformers: number;
  needsAttention: number;
}

export interface DashboardTimeline {
  date: string;
  interval: 'hour' | 'day';
  activities: Activity[];
  productivityData: ProductivityData[];
}

export type DateRange = 'today' | 'last7days' | 'last30days';
