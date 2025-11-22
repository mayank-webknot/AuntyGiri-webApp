# Complete List of All Integrated API Endpoints

## 📊 Summary

**Total Endpoints**: 30 (100% from contract)  
**Base URL**: `http://localhost:3000/api/v1` (except health check)  
**Authentication**: Bearer token in `Authorization` header (automatic via baseApi)

---

## 1. Authentication APIs (4 endpoints)

### 1.1 Login
- **Method**: `POST`
- **Path**: `/api/v1/auth/login`
- **Hook**: `useLoginMutation()`
- **Request Body**:
  ```typescript
  {
    email: string;
    password: string;
  }
  ```
- **Response**: `ApiResponse<LoginResponse>`
- **File**: `src/store/api/authApi.ts`

### 1.2 Get Current User
- **Method**: `GET`
- **Path**: `/api/v1/auth/me`
- **Hook**: `useGetMeQuery()`
- **Query Params**: None
- **Response**: `ApiResponse<{ user: UserResponse }>`
- **File**: `src/store/api/authApi.ts`

### 1.3 Refresh Token
- **Method**: `POST`
- **Path**: `/api/v1/auth/refresh-token`
- **Hook**: `useRefreshTokenMutation()`
- **Request Body**:
  ```typescript
  {
    refreshToken: string;
  }
  ```
- **Response**: `ApiResponse<RefreshTokenResponse>`
- **File**: `src/store/api/authApi.ts`
- **Note**: Automatically called on 401 errors

### 1.4 Logout
- **Method**: `POST`
- **Path**: `/api/v1/auth/logout`
- **Hook**: `useLogoutMutation()`
- **Query Params**: None
- **Response**: `ApiResponse<null>`
- **File**: `src/store/api/authApi.ts`

---

## 2. Dashboard APIs (7 endpoints)

### 2.1 Get Dashboard Summary
- **Method**: `GET`
- **Path**: `/api/v1/dashboard/summary`
- **Hook**: `useGetDashboardSummaryQuery()`
- **Query Params**: None
- **Response**: `ApiResponse<{ summary: {...}, comparison: {...} }>`
- **File**: `src/store/api/dashboardApi.ts`

### 2.2 Get Activity Timeline
- **Method**: `GET`
- **Path**: `/api/v1/dashboard/timeline`
- **Hook**: `useGetTimelineQuery(params)`
- **Query Params**:
  - `date` (string, ISO8601 date, default: today)
  - `interval` (string, 'minute' | 'hour' | 'day', default: 'hour')
- **Response**: `ApiResponse<{ timeline: {...}, activity_types: string[] }>`
- **File**: `src/store/api/dashboardApi.ts`

### 2.3 Get Top Applications
- **Method**: `GET`
- **Path**: `/api/v1/dashboard/top-apps`
- **Hook**: `useGetTopAppsQuery(params)`
- **Query Params**:
  - `limit` (number, default: 10)
  - `startDate` (string, ISO8601)
  - `endDate` (string, ISO8601)
  - `userId` (string, optional)
- **Response**: `ApiResponse<TopApp[]>`
- **File**: `src/store/api/appsWebsitesApi.ts`

### 2.4 Get Website Usage
- **Method**: `GET`
- **Path**: `/api/v1/dashboard/website-usage`
- **Hook**: `useGetWebsiteUsageQuery(params)`
- **Query Params**:
  - `limit` (number, default: 20)
  - `startDate` (string, ISO8601)
  - `userId` (string, optional)
- **Response**: `ApiResponse<WebsiteUsage[]>`
- **File**: `src/store/api/appsWebsitesApi.ts`

### 2.5 Get Productivity Score
- **Method**: `GET`
- **Path**: `/api/v1/dashboard/productivity-score`
- **Hook**: `useGetProductivityScoreQuery(params)`
- **Query Params**:
  - `startDate` (string, ISO8601)
  - `endDate` (string, ISO8601)
- **Response**: `ApiResponse<ProductivityScoreResponse>`
- **File**: `src/store/api/dashboardApi.ts`

### 2.6 Get Activity Report
- **Method**: `GET`
- **Path**: `/api/v1/dashboard/activity-report`
- **Hook**: `useGetActivityReportQuery(params)`
- **Query Params**:
  - `startDate` (string, ISO8601)
  - `endDate` (string, ISO8601)
  - `format` (string, default: 'json')
- **Response**: `ApiResponse<ActivityReportResponse>`
- **File**: `src/store/api/dashboardApi.ts`

### 2.7 Get Screenshots (Dashboard)
- **Method**: `GET`
- **Path**: `/api/v1/dashboard/screenshots`
- **Hook**: `useGetScreenshotsQuery(params)`
- **Query Params**:
  - `page` (number, default: 1)
  - `limit` (number, default: 20)
  - `startDate` (string, ISO8601)
  - `endDate` (string, ISO8601)
  - `flaggedOnly` (boolean)
  - `productiveOnly` (boolean)
  - `search` (string)
  - `sortBy` (string)
  - `userId` (string)
- **Response**: `ApiResponse<{ total, totalPages, currentPage, screenshots }>`
- **File**: `src/store/api/screenshotsApi.ts`

---

## 3. Monitor APIs (6 GET endpoints)

### 3.1 Get Activities
- **Method**: `GET`
- **Path**: `/api/v1/monitor/activities`
- **Hook**: `useGetActivitiesQuery(params)`
- **Query Params**:
  - `startDate` (string, ISO8601) - **camelCase**
  - `endDate` (string, ISO8601) - **camelCase**
  - `limit` (number, default: 100)
  - `offset` (number, default: 0)
  - `appName` (string)
- **Response**: `ApiResponse<{ total: number, activities: Activity[] }>`
- **File**: `src/store/api/monitorApi.ts`

### 3.2 Get Activity Summary
- **Method**: `GET`
- **Path**: `/api/v1/monitor/activities/summary`
- **Hook**: `useGetActivitiesSummaryQuery(params)`
- **Query Params**:
  - `startDate` (string, ISO8601) - **camelCase**
  - `endDate` (string, ISO8601) - **camelCase**
- **Response**: `ApiResponse<ActivitiesSummaryResponse>`
- **File**: `src/store/api/monitorApi.ts`

### 3.3 Get Screenshots (Monitor)
- **Method**: `GET`
- **Path**: `/api/v1/monitor/screenshots`
- **Hook**: `useGetMonitorScreenshotsQuery(params)`
- **Query Params**:
  - `startDate` (string, ISO8601) - **camelCase**
  - `endDate` (string, ISO8601) - **camelCase**
  - `limit` (number, default: 50)
  - `offset` (number, default: 0)
- **Response**: `ApiResponse<{ total: number, screenshots: Screenshot[] }>`
- **File**: `src/store/api/screenshotsApi.ts`
- **Note**: Different from `/dashboard/screenshots`

### 3.4 Get Screenshot by ID
- **Method**: `GET`
- **Path**: `/api/v1/monitor/screenshots/:id`
- **Hook**: `useGetScreenshotByIdQuery(id)`
- **Query Params**: None (ID in path)
- **Response**: `ApiResponse<Screenshot>`
- **File**: `src/store/api/screenshotsApi.ts`

### 3.5 Get Keystrokes
- **Method**: `GET`
- **Path**: `/api/v1/monitor/keystrokes`
- **Hook**: `useGetKeystrokesQuery(params)`
- **Query Params**:
  - `start_date` (string, ISO8601) - **snake_case**
  - `end_date` (string, ISO8601) - **snake_case**
  - `limit` (number, default: 100)
  - `offset` (number, default: 0)
  - `app_name` (string) - **snake_case**
- **Response**: `ApiResponse<{ total: number, keystrokes: Keystroke[] }>`
- **File**: `src/store/api/monitorKeystrokesApi.ts`

### 3.6 Get System Metrics
- **Method**: `GET`
- **Path**: `/api/v1/monitor/metrics`
- **Hook**: `useGetMetricsQuery(params)`
- **Query Params**:
  - `start_date` (string, ISO8601) - **snake_case**
  - `end_date` (string, ISO8601) - **snake_case**
  - `limit` (number, default: 100)
  - `offset` (number, default: 0)
- **Response**: `ApiResponse<{ total: number, metrics: SystemMetric[] }>`
- **File**: `src/store/api/monitorMetricsApi.ts`

### 3.7 Get Metrics Summary
- **Method**: `GET`
- **Path**: `/api/v1/monitor/metrics/summary`
- **Hook**: `useGetMetricsSummaryQuery(params)`
- **Query Params**:
  - `start_date` (string, ISO8601) - **snake_case**
  - `end_date` (string, ISO8601) - **snake_case**
- **Response**: `ApiResponse<MetricsSummaryResponse>`
- **File**: `src/store/api/monitorMetricsApi.ts`

---

## 4. Recommendations APIs (11 endpoints)

### 4.1 Get Personalized Recommendations
- **Method**: `GET`
- **Path**: `/api/v1/recommendations`
- **Hook**: `useGetRecommendationsQuery(params)`
- **Query Params**:
  - `limit` (number, default: 20)
  - `offset` (number, default: 0)
  - `category` (string)
  - `content_type` (string)
  - `difficulty_level` (string)
- **Response**: `ApiResponse<RecommendationsResponse>`
- **File**: `src/store/api/recommendationsApi.ts`

### 4.2 Get Trending Topics
- **Method**: `GET`
- **Path**: `/api/v1/recommendations/trending-topics`
- **Hook**: `useGetTrendingTopicsQuery(params)`
- **Query Params**:
  - `limit` (number, default: 10)
  - `category` (string)
- **Response**: `ApiResponse<{ trending_topics: TrendingTopic[] }>`
- **File**: `src/store/api/recommendationsApi.ts`

### 4.3 Get Recommendations by Category
- **Method**: `GET`
- **Path**: `/api/v1/recommendations/category/:category`
- **Hook**: `useGetRecommendationsByCategoryQuery({ category, ...params })`
- **Query Params**:
  - `category` (string, in path)
  - `limit` (number, default: 15)
  - `offset` (number, default: 0)
- **Response**: `ApiResponse<{ category, total, recommendations, pagination }>`
- **File**: `src/store/api/recommendationsApi.ts`

### 4.4 Search Recommendations
- **Method**: `GET`
- **Path**: `/api/v1/recommendations/search`
- **Hook**: `useSearchRecommendationsQuery(params)`
- **Query Params**:
  - `q` (string, **required**, min 2 chars)
  - `limit` (number, default: 20)
  - `offset` (number, default: 0)
  - `category` (string)
- **Response**: `ApiResponse<{ query, total, recommendations, pagination }>`
- **File**: `src/store/api/recommendationsApi.ts`

### 4.5 Get Career Recommendations
- **Method**: `GET`
- **Path**: `/api/v1/recommendations/career`
- **Hook**: `useGetCareerRecommendationsQuery(params)`
- **Query Params**:
  - `limit` (number, default: 15)
- **Response**: `ApiResponse<{ career_topics, recommendations }>`
- **File**: `src/store/api/recommendationsApi.ts`

### 4.6 Get Recommendations for Topic
- **Method**: `GET`
- **Path**: `/api/v1/recommendations/topic/:topic_id`
- **Hook**: `useGetRecommendationsForTopicQuery({ topicId, ...params })`
- **Query Params**:
  - `topicId` (string, in path)
  - `limit` (number, default: 10)
- **Response**: `ApiResponse<{ topic, recommendations }>`
- **File**: `src/store/api/recommendationsApi.ts`

### 4.7 Get User Interaction History
- **Method**: `GET`
- **Path**: `/api/v1/recommendations/interactions`
- **Hook**: `useGetUserInteractionsQuery(params)`
- **Query Params**:
  - `limit` (number, default: 50)
  - `offset` (number, default: 0)
  - `interaction_type` (string)
- **Response**: `ApiResponse<{ total, interactions, pagination }>`
- **File**: `src/store/api/recommendationsApi.ts`

### 4.8 Record User Interaction
- **Method**: `POST`
- **Path**: `/api/v1/recommendations/interactions/:recommendation_id`
- **Hook**: `useRecordInteractionMutation()`
- **Request Body**:
  ```typescript
  {
    interaction_type: 'viewed' | 'clicked' | 'liked' | 'saved' | 'completed' | 'dismissed';
    rating?: number;
    time_spent_minutes?: number;
    completion_percentage?: number;
    feedback?: string;
  }
  ```
- **Response**: `ApiResponse<{ interaction: {...} }>`
- **File**: `src/store/api/recommendationsApi.ts`

### 4.9 Get Available Categories
- **Method**: `GET`
- **Path**: `/api/v1/recommendations/meta/categories`
- **Hook**: `useGetCategoriesQuery()`
- **Query Params**: None
- **Response**: `ApiResponse<{ categories: Array<{ value, label }> }>`
- **File**: `src/store/api/recommendationsApi.ts`

### 4.10 Get Content Types
- **Method**: `GET`
- **Path**: `/api/v1/recommendations/meta/content-types`
- **Hook**: `useGetContentTypesQuery()`
- **Query Params**: None
- **Response**: `ApiResponse<{ content_types: Array<{ value, label }> }>`
- **File**: `src/store/api/recommendationsApi.ts`

### 4.11 Get Recommendation Statistics
- **Method**: `GET`
- **Path**: `/api/v1/recommendations/stats`
- **Hook**: `useGetRecommendationStatsQuery()`
- **Query Params**: None
- **Response**: `ApiResponse<{ total_recommendations, total_trending_topics, ... }>`
- **File**: `src/store/api/recommendationsApi.ts`

---

## 5. Health Check (1 endpoint)

### 5.1 Health Check
- **Method**: `GET`
- **Path**: `/health` (Note: No `/api/v1` prefix)
- **Hook**: `useGetHealth()` (custom hook)
- **Query Params**: None
- **Response**: `{ status: 'ok', timestamp: string, uptime: number }`
- **File**: `src/store/api/healthApi.ts`
- **Note**: Does not require authentication

---

---

## 📝 Important Notes

### Parameter Naming Convention

**Dashboard APIs** use **camelCase**:
- `startDate`, `endDate`

**Monitor Activities** use **camelCase**:
- `startDate`, `endDate`

**Monitor Metrics/Keystrokes** use **snake_case**:
- `start_date`, `end_date`, `app_name`

### Response Format

All endpoints return:
```typescript
{
  status: "success" | "error",  // Contract format
  success?: boolean,             // Legacy format (auto-added)
  data: {...},
  message?: string               // Only in error responses
}
```

### Authentication

All endpoints (except `/health`) automatically include:
```
Authorization: Bearer <token>
```

Token is retrieved from `localStorage.getItem('auth_token')` automatically.

### Token Refresh

On 401 errors, the system automatically:
1. Calls `/api/v1/auth/refresh-token`
2. Retries the original request with new token
3. Redirects to login if refresh fails

---

## 📊 Summary Table

| Category | Endpoints | Status |
|----------|-----------|--------|
| Authentication | 4 | ✅ Complete |
| Dashboard | 7 | ✅ Complete |
| Monitor | 7 | ✅ Complete |
| Recommendations | 11 | ✅ Complete |
| Health | 1 | ✅ Complete |
| **TOTAL** | **30** | ✅ **100% Contract Coverage** |

---

## 🚀 Quick Import Reference

```typescript
// Authentication
import { useLoginMutation, useGetMeQuery, useRefreshTokenMutation, useLogoutMutation } from '@/store/api/authApi';

// Dashboard
import { useGetDashboardSummaryQuery, useGetTimelineQuery, useGetProductivityScoreQuery, useGetActivityReportQuery } from '@/store/api/dashboardApi';
import { useGetTopAppsQuery, useGetWebsiteUsageQuery } from '@/store/api/appsWebsitesApi';
import { useGetScreenshotsQuery } from '@/store/api/screenshotsApi';

// Monitor
import { useGetActivitiesQuery, useGetActivitiesSummaryQuery } from '@/store/api/monitorApi';
import { useGetMetricsQuery, useGetMetricsSummaryQuery } from '@/store/api/monitorMetricsApi';
import { useGetKeystrokesQuery } from '@/store/api/monitorKeystrokesApi';
import { useGetMonitorScreenshotsQuery, useGetScreenshotByIdQuery } from '@/store/api/screenshotsApi';

// Recommendations
import {
  useGetRecommendationsQuery,
  useGetTrendingTopicsQuery,
  useGetRecommendationsByCategoryQuery,
  useSearchRecommendationsQuery,
  useGetCareerRecommendationsQuery,
  useGetRecommendationsForTopicQuery,
  useGetUserInteractionsQuery,
  useRecordInteractionMutation,
  useGetCategoriesQuery,
  useGetContentTypesQuery,
  useGetRecommendationStatsQuery,
} from '@/store/api/recommendationsApi';

// Health
import { useGetHealth } from '@/store/api/healthApi';
```

---

**Last Updated**: 2025-01-21  
**Status**: ✅ All endpoints integrated and ready to use!

