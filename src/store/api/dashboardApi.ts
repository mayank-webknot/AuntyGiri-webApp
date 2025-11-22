import { baseApi } from '../baseApi';
import type {
  ApiResponse,
  DashboardSummaryResponse,
  TimelineData,
  TimelineQueryParams,
} from '@/types/api';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<ApiResponse<DashboardSummaryResponse>, void>({
      query: () => '/dashboard/summary',
      providesTags: ['Dashboard'],
    }),
    
    getTimeline: builder.query<ApiResponse<TimelineData[]>, TimelineQueryParams>({
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
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useGetTimelineQuery,
} = dashboardApi;

