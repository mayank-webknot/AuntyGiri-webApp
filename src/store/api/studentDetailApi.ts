import { baseApi } from '../baseApi';
import type {
  ApiResponse,
  StudentDetailResponse,
  StudentSummaryResponse,
} from '@/types/api';

export const studentDetailApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudentById: builder.query<ApiResponse<StudentDetailResponse>, string>({
      query: (id) => `/students/${id}`,
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),
    
    getStudentSummary: builder.query<ApiResponse<StudentSummaryResponse>, string>({
      query: (id) => `/students/${id}/summary`,
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),
  }),
});

export const {
  useGetStudentByIdQuery,
  useGetStudentSummaryQuery,
} = studentDetailApi;

