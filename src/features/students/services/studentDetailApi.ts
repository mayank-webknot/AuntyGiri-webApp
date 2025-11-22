import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../../config/api';
import type {
  StudentDetail,
  StudentSummary,
  StudentActivitiesParams,
  StudentActivitiesResponse,
  ApiResponse,
} from '../../../shared/types';

export const studentDetailApi = createApi({
  reducerPath: 'studentDetailApi',
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
  tagTypes: ['StudentDetail', 'StudentActivities'],
  endpoints: (builder) => ({
    getStudentDetail: builder.query<ApiResponse<StudentDetail>, string>({
      query: (studentId) => `/students/${studentId}`,
      providesTags: (_result, _error, studentId) => [
        { type: 'StudentDetail', id: studentId },
      ],
      transformResponse: (response: ApiResponse<StudentDetail>) => response,
    }),

    getStudentSummary: builder.query<ApiResponse<StudentSummary>, string>({
      query: (studentId) => `/students/${studentId}/summary`,
      providesTags: (_result, _error, studentId) => [
        { type: 'StudentDetail', id: studentId },
      ],
      transformResponse: (response: ApiResponse<StudentSummary>) => response,
    }),

    getStudentActivities: builder.query<
      ApiResponse<StudentActivitiesResponse>,
      StudentActivitiesParams
    >({
      query: ({ userId, startDate, endDate }) => {
        const params = new URLSearchParams();
        params.append('userId', userId);
        params.append('startDate', startDate);
        params.append('endDate', endDate);
        return `/monitor/activities?${params.toString()}`;
      },
      providesTags: (result, error, params) => [
        { type: 'StudentActivities', id: params.userId },
      ],
      transformResponse: (response: ApiResponse<StudentActivitiesResponse>) => response,
    }),

    getStudentActivitiesSummary: builder.query<
      ApiResponse<StudentActivitiesResponse>,
      string
    >({
      query: (userId) => `/monitor/activities/summary?userId=${userId}`,
      providesTags: (result, error, userId) => [
        { type: 'StudentActivities', id: userId },
      ],
      transformResponse: (response: ApiResponse<StudentActivitiesResponse>) => response,
    }),
  }),
});

export const {
  useGetStudentDetailQuery,
  useGetStudentSummaryQuery,
  useGetStudentActivitiesQuery,
  useGetStudentActivitiesSummaryQuery,
  useLazyGetStudentActivitiesQuery,
} = studentDetailApi;
