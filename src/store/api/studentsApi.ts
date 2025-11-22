import { baseApi } from '../baseApi';
import type {
  ApiResponse,
  PaginatedResponse,
  StudentListItem,
  StudentsQueryParams,
} from '@/types/api';

export const studentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<ApiResponse<PaginatedResponse<StudentListItem>>, StudentsQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.search) searchParams.append('search', params.search);
        if (params.class) searchParams.append('class', params.class);
        if (params.status) searchParams.append('status', params.status);
        if (params.productivityMin) searchParams.append('productivityMin', params.productivityMin.toString());
        if (params.productivityMax) searchParams.append('productivityMax', params.productivityMax.toString());
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
        
        return {
          url: `/students?${searchParams.toString()}`,
        };
      },
      providesTags: ['Students'],
    }),
  }),
});

export const {
  useGetStudentsQuery,
} = studentsApi;

