import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../../config/api';
import { ScreenshotsParams, ScreenshotsResponse, Screenshot, ApiResponse } from '../../../shared/types';

export const screenshotsApi = createApi({
  reducerPath: 'screenshotsApi',
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
  tagTypes: ['Screenshots'],
  endpoints: (builder) => ({
    getScreenshots: builder.query<ApiResponse<ScreenshotsResponse>, ScreenshotsParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);
        if (params.flaggedOnly) searchParams.append('flaggedOnly', 'true');
        if (params.productiveOnly) searchParams.append('productiveOnly', 'true');
        if (params.search) searchParams.append('search', params.search);
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.userId) searchParams.append('userId', params.userId);
        return `/dashboard/screenshots?${searchParams.toString()}`;
      },
      providesTags: ['Screenshots'],
      transformResponse: (response: ApiResponse<ScreenshotsResponse>) => response,
    }),

    getScreenshot: builder.query<ApiResponse<Screenshot>, string>({
      query: (id) => `/monitor/screenshots/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Screenshots', id }],
      transformResponse: (response: ApiResponse<Screenshot>) => response,
    }),

    deleteScreenshot: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/monitor/screenshots/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Screenshots'],
      transformResponse: (response: ApiResponse<void>) => response,
    }),

    flagScreenshot: builder.mutation<ApiResponse<Screenshot>, { id: string; flagged: boolean }>({
      query: ({ id, flagged }) => ({
        url: `/monitor/screenshots/${id}/flag`,
        method: 'PATCH',
        body: { flagged },
      }),
      invalidatesTags: ['Screenshots'],
      transformResponse: (response: ApiResponse<Screenshot>) => response,
    }),
  }),
});

export const {
  useGetScreenshotsQuery,
  useGetScreenshotQuery,
  useDeleteScreenshotMutation,
  useFlagScreenshotMutation,
  useLazyGetScreenshotsQuery,
} = screenshotsApi;
