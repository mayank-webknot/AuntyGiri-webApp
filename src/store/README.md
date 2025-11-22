# RTK Query API Store

This directory contains all RTK Query API endpoints and store configuration.

## Structure

- `baseApi.ts` - Base API configuration with authentication
- `store.ts` - Redux store setup
- `hooks.ts` - Typed Redux hooks
- `api/` - Individual API endpoint slices

## Usage

Import hooks directly from API slices:

```typescript
import { useGetStudentsQuery } from '@/store/api/studentsApi';
import { useLoginMutation } from '@/store/api/authApi';
```

## Authentication

All API requests automatically include the JWT token from `localStorage.getItem('auth_token')` in the Authorization header.

## Caching

RTK Query automatically caches responses. Use tags for cache invalidation:

```typescript
providesTags: ['Students']  // Cache this data
invalidatesTags: ['Students'] // Invalidate when mutation succeeds
```

## Environment Variables

Set `VITE_API_BASE_URL` in your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

