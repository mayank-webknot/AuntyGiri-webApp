import { createApi, fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { getMockData } from '@/mock/apiMockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// Enable mock data fallback (set to false to disable)
const USE_MOCK_FALLBACK = import.meta.env.VITE_USE_MOCK_FALLBACK !== 'false';

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    
    return headers;
  },
});

// Refresh token function
async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();
    
    if (data.status === 'success' && data.data?.accessToken) {
      localStorage.setItem('auth_token', data.data.accessToken);
      if (data.data.refreshToken) {
        localStorage.setItem('refreshToken', data.data.refreshToken);
      }
      return data.data.accessToken;
    }
    
    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
}

// Helper to extract endpoint path and method from args
const getEndpointInfo = (args: string | FetchArgs): { path: string; method: string } => {
  if (typeof args === 'string') {
    return { path: args, method: 'GET' };
  }
  
  const url = args.url || '';
  const method = (args.method || 'GET').toUpperCase();
  
  // Remove base URL and /api/v1 prefix if present
  let path = url.replace(API_BASE_URL, '').replace(/^\/api\/v1/, '');
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  
  return { path, method };
};

// Wrapper to transform response format, handle token refresh, and provide mock fallback
const baseQueryWithTransform: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // Handle 401 Unauthorized - try to refresh token
  if (result.error && 'status' in result.error && result.error.status === 401) {
    const newToken = await refreshAccessToken();
    
    if (newToken) {
      // Retry original request with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, clear tokens and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }
  
  // Use mock data as fallback if request failed and mock fallback is enabled
  if (result.error && USE_MOCK_FALLBACK) {
    const { path, method } = getEndpointInfo(args);
    const mockData = getMockData(path, method);
    
    if (mockData) {
      console.warn(`[Mock Fallback] Using mock data for ${method} ${path}`);
      return {
        data: mockData,
      };
    }
  }
  
  // Transform contract format { status: "success" } to { success: true }
  if (result.data && typeof result.data === 'object') {
    const data = result.data as any;
    if (data.status === 'success' && data.success === undefined) {
      result.data = {
        ...data,
        success: true,
      };
    } else if (data.status === 'error' && data.success === undefined) {
      result.data = {
        ...data,
        success: false,
      };
    }
  }
  
  return result;
};

// Base query with authentication
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithTransform,
  tagTypes: [
    'Auth',
    'Dashboard',
    'Activities',
    'Apps',
    'Websites',
    'Screenshots',
    'Metrics',
    'Keystrokes',
    'Recommendations',
  ],
  endpoints: () => ({}),
});
