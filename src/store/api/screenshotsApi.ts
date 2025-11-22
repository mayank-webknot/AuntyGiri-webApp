import { baseApi } from '../baseApi';
import type {
  ApiResponse,
  PaginatedResponse,
  Screenshot,
  ScreenshotsQueryParams,
  MonitorScreenshotsQueryParams,
} from '@/types/api';

export const screenshotsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Dashboard screenshots endpoint
    getScreenshots: builder.query<ApiResponse<{ total: number; totalPages: number; currentPage: number; screenshots: Screenshot[] }>, ScreenshotsQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);
        if (params.flaggedOnly) searchParams.append('flaggedOnly', params.flaggedOnly.toString());
        if (params.productiveOnly) searchParams.append('productiveOnly', params.productiveOnly.toString());
        if (params.search) searchParams.append('search', params.search);
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.userId) searchParams.append('userId', params.userId);
        
        return {
          url: `/dashboard/screenshots?${searchParams.toString()}`,
        };
      },
      providesTags: ['Screenshots'],
    }),
    
    // Monitor screenshots endpoint (different from dashboard)
    getMonitorScreenshots: builder.query<ApiResponse<{ total: number; screenshots: Screenshot[] }>, MonitorScreenshotsQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        // Contract format: startDate, endDate (camelCase for monitor/screenshots)
        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.offset) searchParams.append('offset', params.offset.toString());
        
        return {
          url: `/monitor/screenshots?${searchParams.toString()}`,
        };
      },
      providesTags: ['Screenshots'],
    }),
    
    getScreenshotById: builder.query<ApiResponse<Screenshot>, string>({
      query: (id) => `/monitor/screenshots/${id}`,
      providesTags: (result, error, id) => [{ type: 'Screenshots', id }],
    }),
  }),
});

export const {
  useGetScreenshotsQuery,
  useGetMonitorScreenshotsQuery,
  useGetScreenshotByIdQuery,
} = screenshotsApi;

