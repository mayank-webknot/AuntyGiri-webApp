import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../../config/api';
import type { StudentsListParams, StudentsListResponse, ApiResponse } from '../../../shared/types';

export const studentsApi = createApi({
  reducerPath: 'studentsApi',
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
  tagTypes: ['Students'],
  endpoints: (builder) => ({
    getStudents: builder.query<
      ApiResponse<StudentsListResponse>,
      StudentsListParams
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.search) searchParams.append('search', params.search);
        if (params.class) searchParams.append('class', params.class);
        if (params.status && params.status !== 'all') {
          searchParams.append('status', params.status);
        }
        if (params.productivityMin !== undefined) {
          searchParams.append('productivityMin', params.productivityMin.toString());
        }
        if (params.productivityMax !== undefined) {
          searchParams.append('productivityMax', params.productivityMax.toString());
        }
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

        return `/students?${searchParams.toString()}`;
      },
      providesTags: ['Students'],
      transformResponse: (response: ApiResponse<StudentsListResponse>) => response,
    }),
  }),
});

export const { useGetStudentsQuery, useLazyGetStudentsQuery } = studentsApi;
