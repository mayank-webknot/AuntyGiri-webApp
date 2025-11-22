import { baseApi } from '../baseApi';
import type {
  ApiResponse,
  Activity,
  ActivitiesSummaryResponse,
  ActivitiesQueryParams,
} from '@/types/api';

export const monitorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivities: builder.query<ApiResponse<Activity[]>, ActivitiesQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        if (params.userId) searchParams.append('userId', params.userId);
        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);
        
        return {
          url: `/monitor/activities?${searchParams.toString()}`,
        };
      },
      providesTags: ['Activities'],
    }),
    
    getActivitiesSummary: builder.query<ApiResponse<ActivitiesSummaryResponse>, { userId?: string }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.userId) searchParams.append('userId', params.userId);
        
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

