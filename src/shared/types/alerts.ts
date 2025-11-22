export type AlertSeverity = 'high' | 'medium' | 'low';
export type AlertStatus = 'unresolved' | 'resolved';
export type AlertType =
  | 'bad_website'
  | 'extended_idle'
  | 'low_productivity'
  | 'inappropriate_content'
  | 'excessive_gaming';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  studentId: string;
  studentName: string;
  message: string;
  timestamp: string; // ISO timestamp
  details?: {
    websiteUrl?: string;
    duration?: number; // minutes
    productivityScore?: number;
    screenshotId?: string;
    screenshotUrl?: string;
  };
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface AlertStatistics {
  today: {
    total: number;
    high: number;
    medium: number;
    low: number;
  };
  thisWeek: {
    total: number;
    high: number;
    medium: number;
    low: number;
    trend: number; // percentage change
  };
  thisMonth: {
    total: number;
    high: number;
    medium: number;
    low: number;
    trend: number;
  };
}

export interface AlertFilters {
  severity?: AlertSeverity | 'all';
  status?: AlertStatus | 'all';
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface BadWebsiteConfig {
  high: string[];
  medium: string[];
  low: string[];
}

export const BAD_WEBSITES: BadWebsiteConfig = {
  high: [
    'gambling-site.com',
    'inappropriate-content.com',
    'adult-content.com',
    'betting-site.com',
  ],
  medium: [
    'instagram.com',
    'facebook.com',
    'twitter.com',
    'tiktok.com',
    'snapchat.com',
    'discord.com',
  ],
  low: ['youtube.com', 'reddit.com', 'pinterest.com'],
};
