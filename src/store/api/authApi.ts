import { baseApi } from '../baseApi';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  UserResponse,
} from '@/types/api';

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

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
    
    getMe: builder.query<ApiResponse<{ user: UserResponse }>, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
    
    refreshToken: builder.mutation<ApiResponse<RefreshTokenResponse>, RefreshTokenRequest>({
      query: (body) => ({
        url: '/auth/refresh-token',
        method: 'POST',
        body,
      }),
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
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;

