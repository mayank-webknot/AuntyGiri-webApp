import { baseApi } from '../baseApi';
import type {
  ApiResponse,
  SystemMetric,
  MetricsQueryParams,
  MetricsSummaryResponse,
} from '@/types/api';

export const monitorMetricsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMetrics: builder.query<ApiResponse<{ total: number; metrics: SystemMetric[] }>, MetricsQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        // Contract format: start_date, end_date (snake_case for monitor APIs)
        if (params.start_date) searchParams.append('start_date', params.start_date);
        if (params.end_date) searchParams.append('end_date', params.end_date);
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.offset) searchParams.append('offset', params.offset.toString());
        
        return {
          url: `/monitor/metrics?${searchParams.toString()}`,
        };
      },
      providesTags: ['Metrics'],
    }),
    
    getMetricsSummary: builder.query<ApiResponse<MetricsSummaryResponse>, { start_date?: string; end_date?: string }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        // Contract format: start_date, end_date (snake_case)
        if (params.start_date) searchParams.append('start_date', params.start_date);
        if (params.end_date) searchParams.append('end_date', params.end_date);
        
        return {
          url: `/monitor/metrics/summary?${searchParams.toString()}`,
        };
      },
      providesTags: ['Metrics'],
    }),
  }),
});

export const {
  useGetMetricsQuery,
  useGetMetricsSummaryQuery,
} = monitorMetricsApi;

