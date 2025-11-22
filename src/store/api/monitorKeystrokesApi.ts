import { baseApi } from '../baseApi';
import type {
  ApiResponse,
  Keystroke,
  KeystrokesQueryParams,
} from '@/types/api';

export const monitorKeystrokesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getKeystrokes: builder.query<ApiResponse<{ total: number; keystrokes: Keystroke[] }>, KeystrokesQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        // Contract format: start_date, end_date (snake_case for monitor APIs)
        if (params.start_date) searchParams.append('start_date', params.start_date);
        if (params.end_date) searchParams.append('end_date', params.end_date);
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.offset) searchParams.append('offset', params.offset.toString());
        if (params.app_name) searchParams.append('app_name', params.app_name);
        
        return {
          url: `/monitor/keystrokes?${searchParams.toString()}`,
        };
      },
      providesTags: ['Keystrokes'],
    }),
  }),
});

export const {
  useGetKeystrokesQuery,
} = monitorKeystrokesApi;

