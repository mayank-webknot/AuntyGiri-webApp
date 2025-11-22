import { baseApi } from '../baseApi';
import type {
  ApiResponse,
  DashboardSummaryResponse,
  TimelineData,
  TimelineQueryParams,
  ProductivityScoreResponse,
  ActivityReportResponse,
} from '@/types/api';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<ApiResponse<{
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
    }>, void>({
      query: () => '/dashboard/summary',
      providesTags: ['Dashboard'],
    }),
    
    getTimeline: builder.query<ApiResponse<{
      timeline: Record<string, Array<{ app_name: string; duration: number }>>;
      activity_types: string[];
    }>, TimelineQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.date) searchParams.append('date', params.date);
        if (params.interval) searchParams.append('interval', params.interval);
        
        return {
          url: `/dashboard/timeline?${searchParams.toString()}`,
        };
      },
      providesTags: ['Dashboard'],
    }),
    
    getProductivityScore: builder.query<ApiResponse<ProductivityScoreResponse>, { startDate?: string; endDate?: string }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);
        
        return {
          url: `/dashboard/productivity-score?${searchParams.toString()}`,
        };
      },
      providesTags: ['Dashboard'],
    }),
    
    getActivityReport: builder.query<ApiResponse<ActivityReportResponse>, { startDate?: string; endDate?: string; format?: string }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);
        if (params.format) searchParams.append('format', params.format);
        
        return {
          url: `/dashboard/activity-report?${searchParams.toString()}`,
        };
      },
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useGetTimelineQuery,
  useGetProductivityScoreQuery,
  useGetActivityReportQuery,
} = dashboardApi;

