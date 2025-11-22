import { baseApi } from '../baseApi';
import type {
  ApiResponse,
  Activity,
  ActivitiesSummaryResponse,
  ActivitiesQueryParams,
} from '@/types/api';

export const monitorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivities: builder.query<ApiResponse<{ total: number; activities: Activity[] }>, ActivitiesQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        // Contract format: startDate, endDate, limit, offset, appName
        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.offset) searchParams.append('offset', params.offset.toString());
        if (params.appName) searchParams.append('appName', params.appName);
        
        // Legacy support (fallback to from/to if startDate/endDate not provided)
        if (!params.startDate && params.from) searchParams.append('startDate', params.from);
        if (!params.endDate && params.to) searchParams.append('endDate', params.to);
        if (params.studentId) searchParams.append('studentId', params.studentId);
        
        return {
          url: `/monitor/activities?${searchParams.toString()}`,
        };
      },
      providesTags: ['Activities'],
    }),
    
    getActivitiesSummary: builder.query<ApiResponse<ActivitiesSummaryResponse>, { startDate?: string; endDate?: string }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        // Contract format: startDate, endDate
        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);
        
        return {
          url: `/monitor/activities/summary?${searchParams.toString()}`,
        };
      },
      providesTags: ['Activities'],
    }),
  }),
});

export const {
  useGetActivitiesQuery,
  useGetActivitiesSummaryQuery,
} = monitorApi;

