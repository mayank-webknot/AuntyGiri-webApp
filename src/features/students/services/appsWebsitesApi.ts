import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../../config/api';
import type {
  Application,
  TopAppsParams,
  Website,
  WebsiteUsageParams,
  ApiResponse,
} from '../../../shared/types';

export const appsWebsitesApi = createApi({
  reducerPath: 'appsWebsitesApi',
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
  tagTypes: ['Applications', 'Websites'],
  endpoints: (builder) => ({
    getTopApps: builder.query<ApiResponse<Application[]>, TopAppsParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.append('limit', params.limit.toString());
        searchParams.append('startDate', params.startDate);
        searchParams.append('endDate', params.endDate);
        if (params.userId) searchParams.append('userId', params.userId);
        return `/dashboard/top-apps?${searchParams.toString()}`;
      },
      providesTags: ['Applications'],
      transformResponse: (response: ApiResponse<Application[]>) => response,
    }),

    getWebsiteUsage: builder.query<ApiResponse<Website[]>, WebsiteUsageParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.append('limit', params.limit.toString());
        searchParams.append('startDate', params.startDate);
        if (params.userId) searchParams.append('userId', params.userId);
        return `/dashboard/website-usage?${searchParams.toString()}`;
      },
      providesTags: ['Websites'],
      transformResponse: (response: ApiResponse<Website[]>) => response,
    }),
  }),
});

export const {
  useGetTopAppsQuery,
  useGetWebsiteUsageQuery,
  useLazyGetTopAppsQuery,
  useLazyGetWebsiteUsageQuery,
} = appsWebsitesApi;
