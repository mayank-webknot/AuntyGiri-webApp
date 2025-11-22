import { baseApi } from '../baseApi';
import type {
  ApiResponse,
  PaginatedResponse,
  Screenshot,
  ScreenshotsQueryParams,
} from '@/types/api';

export const screenshotsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getScreenshots: builder.query<ApiResponse<PaginatedResponse<Screenshot>>, ScreenshotsQueryParams>({
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
  }),
});

export const {
  useGetScreenshotsQuery,
} = screenshotsApi;

