import { baseApi } from '../baseApi';
import type {
  ApiResponse,
  TopApp,
  WebsiteUsage,
  TopAppsQueryParams,
  WebsiteUsageQueryParams,
} from '@/types/api';

export const appsWebsitesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTopApps: builder.query<ApiResponse<TopApp[]>, TopAppsQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);
        if (params.userId) searchParams.append('userId', params.userId);
        
        return {
          url: `/dashboard/top-apps?${searchParams.toString()}`,
        };
      },
      providesTags: ['Apps'],
    }),
    
    getWebsiteUsage: builder.query<ApiResponse<WebsiteUsage[]>, WebsiteUsageQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.userId) searchParams.append('userId', params.userId);
        
        return {
          url: `/dashboard/website-usage?${searchParams.toString()}`,
        };
      },
      providesTags: ['Websites'],
    }),
  }),
});

export const {
  useGetTopAppsQuery,
  useGetWebsiteUsageQuery,
} = appsWebsitesApi;

