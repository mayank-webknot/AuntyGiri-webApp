import { baseApi } from '../baseApi';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  UserResponse,
} from '@/types/api';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    
    getMe: builder.query<ApiResponse<UserResponse>, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
    
    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useLogoutMutation,
} = authApi;

