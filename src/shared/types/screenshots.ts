export interface Screenshot {
  id: string;
  url: string;
  thumbnailUrl: string;
  timestamp: string; // ISO timestamp
  appName: string;
  windowTitle: string;
  fileSize: number; // bytes
  width: number;
  height: number;
  isFlagged: boolean;
  category: 'productive' | 'neutral' | 'unproductive';
  studentId: string;
}

export interface ScreenshotsParams {
  page?: number;
  limit?: number;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  flaggedOnly?: boolean;
  productiveOnly?: boolean;
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'recentActivity';
  userId?: string;
}

export interface ScreenshotsResponse {
  screenshots: Screenshot[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
