# Mock Data Fallback System

## Overview

The frontend now includes a comprehensive mock data fallback system that automatically provides mock responses when the backend is unavailable or returns errors. This ensures the application continues to function during backend development and debugging.

## How It Works

1. **Automatic Fallback**: When an API request fails (network error, 500 error, etc.), the system automatically checks for mock data matching that endpoint.

2. **Contract Compliance**: All mock data matches the exact API contract response structures, ensuring seamless integration when the backend is ready.

3. **Console Warnings**: When mock data is used, a warning is logged to the console: `[Mock Fallback] Using mock data for {METHOD} {ENDPOINT}`

## Configuration

### Enable/Disable Mock Fallback

Add to your `.env` file:

```env
# Enable mock data fallback (default: true)
VITE_USE_MOCK_FALLBACK=true
```

Set to `false` to disable mock fallback and show real errors:

```env
VITE_USE_MOCK_FALLBACK=false
```

## Supported Endpoints

### Authentication
- ✅ `POST /auth/login` - Login with credentials
- ✅ `GET /auth/me` - Get current user
- ✅ `POST /auth/refresh-token` - Refresh access token
- ✅ `POST /auth/logout` - Logout user

### Dashboard
- ✅ `GET /dashboard/summary` - Dashboard summary metrics
- ✅ `GET /dashboard/timeline` - Activity timeline
- ✅ `GET /dashboard/productivity-score` - Productivity score
- ✅ `GET /dashboard/activity-report` - Activity report
- ✅ `GET /dashboard/top-apps` - Top applications
- ✅ `GET /dashboard/website-usage` - Website usage statistics
- ✅ `GET /dashboard/screenshots` - Dashboard screenshots

### Monitor
- ✅ `GET /monitor/activities` - Student activities
- ✅ `GET /monitor/activities/summary` - Activities summary
- ✅ `GET /monitor/metrics` - System metrics
- ✅ `GET /monitor/metrics/summary` - Metrics summary
- ✅ `GET /monitor/keystrokes` - Keystroke data
- ✅ `GET /monitor/screenshots` - Monitor screenshots
- ✅ `GET /monitor/screenshots/{id}` - Get screenshot by ID

### Recommendations
- ✅ `GET /recommendations` - Get recommendations
- ✅ `GET /recommendations/trending-topics` - Trending topics
- ✅ `GET /recommendations/category/{category}` - Recommendations by category
- ✅ `GET /recommendations/search?q=...` - Search recommendations
- ✅ `GET /recommendations/career` - Career recommendations
- ✅ `GET /recommendations/topic/{topicId}` - Recommendations for topic
- ✅ `GET /recommendations/interactions` - User interactions
- ✅ `POST /recommendations/interactions/{id}` - Record interaction
- ✅ `GET /recommendations/meta/categories` - Get categories
- ✅ `GET /recommendations/meta/content-types` - Get content types
- ✅ `GET /recommendations/stats` - Recommendation statistics

## Mock Data Location

All mock data is stored in:
```
src/mock/apiMockData.ts
```

## Mock Data Structure

Each mock response follows the API contract format:

```typescript
{
  status: 'success',
  success: true,
  data: {
    // Contract-specific response data
  },
  message?: string
}
```

## Usage Examples

### Example 1: Dashboard Summary

When `/dashboard/summary` fails, mock data is automatically returned:

```typescript
const { data } = useGetDashboardSummaryQuery();

// If backend fails, data will contain:
// {
//   status: 'success',
//   success: true,
//   data: {
//     summary: {
//       totalTime: 28800,
//       productiveTime: 21600,
//       productivityScore: 75,
//       ...
//     },
//     comparison: { ... }
//   }
// }
```

### Example 2: Activities

```typescript
const { data } = useGetActivitiesQuery({
  startDate: '2025-01-21',
  endDate: '2025-01-21',
});

// Mock data includes sample activities with realistic data
```

## Customizing Mock Data

To customize mock data:

1. Open `src/mock/apiMockData.ts`
2. Find the mock data constant for the endpoint (e.g., `mockDashboardSummary`)
3. Update the data structure to match your needs
4. Ensure the structure matches the API contract types in `src/types/api.ts`

## Testing

### Test Mock Fallback

1. **Disable Backend**: Stop your backend server
2. **Enable Mock Fallback**: Ensure `VITE_USE_MOCK_FALLBACK=true` in `.env`
3. **Use the App**: Navigate through the app - it should work with mock data
4. **Check Console**: Look for `[Mock Fallback]` warnings

### Test Real Backend

1. **Start Backend**: Ensure backend is running
2. **Disable Mock Fallback**: Set `VITE_USE_MOCK_FALLBACK=false` in `.env`
3. **Restart Dev Server**: `npm run dev`
4. **Use the App**: Real API calls will be made

## Benefits

1. **Development Continuity**: Frontend development can continue even when backend is unavailable
2. **UI Testing**: Test UI components with realistic data structures
3. **Contract Compliance**: Mock data matches contract, ensuring smooth transition to real API
4. **Error Handling**: Test error states by disabling mock fallback
5. **Demo Mode**: Can be used for demos when backend is not available

## Important Notes

- ⚠️ **Mock data is for development only** - Never use in production
- ⚠️ **Mock data is static** - It doesn't reflect real-time changes
- ⚠️ **Authentication mock** - Login will work but won't provide real tokens
- ✅ **Contract compliant** - All mock data matches API contract structures
- ✅ **Type safe** - Mock data uses TypeScript types from `src/types/api.ts`

## Troubleshooting

### Mock data not being used

1. Check `VITE_USE_MOCK_FALLBACK` is set to `true` in `.env`
2. Restart dev server after changing `.env`
3. Check console for `[Mock Fallback]` warnings
4. Verify endpoint path matches exactly (check for typos)

### Mock data structure mismatch

1. Compare mock data in `src/mock/apiMockData.ts` with types in `src/types/api.ts`
2. Ensure all required fields are present
3. Check that response wrapper includes `status: 'success'`

## Files Modified

- ✅ `src/mock/apiMockData.ts` - Created comprehensive mock data
- ✅ `src/store/baseApi.ts` - Added mock fallback logic
- ✅ `.env` - Added `VITE_USE_MOCK_FALLBACK` configuration

---

**Status**: ✅ Mock Data Fallback System Fully Implemented

