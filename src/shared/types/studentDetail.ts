export interface StudentDetail {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  class: string;
  avatar?: string;
  onlineStatus: 'online' | 'offline';
  currentActivity?: {
    app: string;
    activity: string;
    startedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StudentSummary {
  focusTimeToday: {
    hours: number;
    minutes: number;
    totalMinutes: number;
    dailyGoal: number; // minutes
    trend: number; // percentage change
    trendType: 'up' | 'down' | 'neutral';
  };
  productiveTime: {
    percentage: number;
    hours: number;
    minutes: number;
    totalMinutes: number;
  };
  warningsCount: {
    total: number;
    high: number;
    medium: number;
    low: number;
  };
  screenshots: {
    total: number;
    today: number;
  };
}

export interface ActivityTimelineItem {
  id: string;
  app: string;
  activity: string;
  startTime: string; // ISO timestamp
  endTime: string; // ISO timestamp
  duration: number; // minutes
  productivity: 'productive' | 'neutral' | 'unproductive' | 'idle';
}

export interface HourlyFocusData {
  hour: number; // 0-23
  focusedMinutes: number;
  idleMinutes: number;
  totalMinutes: number;
}

export interface StudentActivitiesParams {
  userId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export interface StudentActivitiesResponse {
  activities: ActivityTimelineItem[];
  hourlyFocus: HourlyFocusData[];
}
