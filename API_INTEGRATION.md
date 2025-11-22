# API Integration Summary

## ✅ Completed Integration

All API endpoints have been integrated using RTK Query with proper TypeScript types and query hooks.

## 📦 Dependencies Required

Install these packages:
```bash
npm install @reduxjs/toolkit react-redux
```

## 📁 File Structure

```
src/
├── store/
│   ├── baseApi.ts              # Base API configuration with auth
│   ├── store.ts                # Redux store setup
│   ├── hooks.ts                # Typed Redux hooks
│   └── api/
│       ├── authApi.ts          # Authentication endpoints
│       ├── dashboardApi.ts     # Dashboard endpoints
│       ├── studentsApi.ts      # Students list endpoint
│       ├── studentDetailApi.ts # Student detail endpoints
│       ├── monitorApi.ts       # Activities endpoints
│       ├── appsWebsitesApi.ts  # Apps & websites endpoints
│       └── screenshotsApi.ts   # Screenshots endpoint
├── types/
│   └── api.ts                  # All API TypeScript types
└── App.tsx                      # Updated with Redux Provider
```

## 🔌 API Endpoints Integrated

### Authentication
- ✅ `POST /api/v1/auth/login` → `useLoginMutation()`
- ✅ `GET /api/v1/auth/me` → `useGetMeQuery()`
- ✅ `POST /api/v1/auth/logout` → `useLogoutMutation()`

### Dashboard
- ✅ `GET /api/v1/dashboard/summary` → `useGetDashboardSummaryQuery()`
- ✅ `GET /api/v1/dashboard/timeline` → `useGetTimelineQuery(params)`

### Students
- ✅ `GET /api/v1/students` → `useGetStudentsQuery(params)`

### Student Detail
- ✅ `GET /api/v1/students/:id` → `useGetStudentByIdQuery(id)`
- ✅ `GET /api/v1/students/:id/summary` → `useGetStudentSummaryQuery(id)`
- ✅ `GET /api/v1/monitor/activities` → `useGetActivitiesQuery(params)`
- ✅ `GET /api/v1/monitor/activities/summary` → `useGetActivitiesSummaryQuery(params)`

### Apps & Websites
- ✅ `GET /api/v1/dashboard/top-apps` → `useGetTopAppsQuery(params)`
- ✅ `GET /api/v1/dashboard/website-usage` → `useGetWebsiteUsageQuery(params)`

### Screenshots
- ✅ `GET /api/v1/dashboard/screenshots` → `useGetScreenshotsQuery(params)`

## 🔐 Authentication

All endpoints automatically include the JWT token from `localStorage.getItem('auth_token')` in the Authorization header.

## 📝 Component Mapping

### Pages → Endpoints

| Page | Endpoints Used |
|------|---------------|
| **Login** | `useLoginMutation()` |
| **Dashboard** | `useGetDashboardSummaryQuery()`, `useGetTimelineQuery()` |
| **Students** | `useGetStudentsQuery()` |
| **StudentDetail** | `useGetStudentByIdQuery()`, `useGetStudentSummaryQuery()`, `useGetActivitiesQuery()`, `useGetActivitiesSummaryQuery()` |
| **Alerts** | (Can use activities with flagged filter) |

## 🎯 Usage Examples

See `src/store/examples.md` for detailed usage examples for each endpoint.

## 🔄 Caching & Invalidation

RTK Query automatically handles:
- **Caching**: Responses are cached and reused
- **Deduplication**: Multiple components using the same query share the same request
- **Refetching**: Automatic refetch on window focus (configurable)
- **Tag-based invalidation**: Related queries can be invalidated together

### Cache Tags

- `Auth` - Authentication data
- `Dashboard` - Dashboard summary and timeline
- `Students` - Students list
- `Student` - Individual student data
- `Activities` - Activity data
- `Apps` - Top apps data
- `Websites` - Website usage data
- `Screenshots` - Screenshots data

## ⚙️ Configuration

### API Base URL

Set via environment variable:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Or it defaults to `http://localhost:3000/api/v1`

### Token Storage

Tokens are stored in `localStorage` with key `auth_token`.

## 🚀 Next Steps

1. **Install dependencies**: `npm install @reduxjs/toolkit react-redux`
2. **Update components**: Replace mock data with RTK Query hooks
3. **Test endpoints**: Verify all endpoints work with your backend
4. **Add error handling**: Implement proper error boundaries and toast notifications
5. **Add loading states**: Use `isLoading` flags from queries

## 📚 Documentation

- [RTK Query Docs](https://redux-toolkit.js.org/rtk-query/overview)
- [Examples](./src/store/examples.md)

