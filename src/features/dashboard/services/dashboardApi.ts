import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../../config/api';
import type { DashboardSummary, DashboardTimeline, ApiResponse } from '../../../shared/types';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<ApiResponse<DashboardSummary>, void>({
      query: () => '/dashboard/summary',
      providesTags: ['Dashboard'],
      transformResponse: (response: ApiResponse<DashboardSummary>) => response,
    }),
    
    getDashboardTimeline: builder.query<
      ApiResponse<DashboardTimeline>,
      { date?: string; interval?: 'hour' | 'day' }
    >({
      query: ({ date, interval = 'hour' }) => {
        const params = new URLSearchParams();
        if (date) params.append('date', date);
        params.append('interval', interval);
        return `/dashboard/timeline?${params.toString()}`;
      },
      providesTags: ['Dashboard'],
      transformResponse: (response: ApiResponse<DashboardTimeline>) => response,
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useGetDashboardTimelineQuery,
  useLazyGetDashboardTimelineQuery,
} = dashboardApi;
