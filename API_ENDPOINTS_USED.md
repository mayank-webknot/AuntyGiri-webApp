# API Endpoints Currently Used in Web App

## ✅ Currently Integrated & Used in Components

### 1. Authentication (3 endpoints)
- ✅ **POST `/api/v1/auth/login`** 
  - Used in: `src/contexts/AuthContext.tsx`
  - Hook: `useLoginMutation()`
  - Status: **ACTIVE**

- ✅ **GET `/api/v1/auth/me`**
  - Used in: `src/contexts/AuthContext.tsx`
  - Hook: `useGetMeQuery()`
  - Status: **ACTIVE**

- ✅ **POST `/api/v1/auth/logout`**
  - Used in: `src/contexts/AuthContext.tsx`
  - Hook: `useLogoutMutation()`
  - Status: **ACTIVE**

### 2. Dashboard (2 endpoints)
- ✅ **GET `/api/v1/dashboard/summary`**
  - Used in: `src/pages/Dashboard.tsx`
  - Hook: `useGetDashboardSummaryQuery()`
  - Status: **ACTIVE**

- ✅ **GET `/api/v1/dashboard/timeline`**
  - Used in: `src/pages/Dashboard.tsx`
  - Hook: `useGetTimelineQuery()`
  - Status: **ACTIVE**

### 3. Students (3 endpoints) ⚠️
- ⚠️ **GET `/api/v1/students`**
  - Used in: `src/pages/Students.tsx`
  - Hook: `useGetStudentsQuery()`
  - Status: **ACTIVE** (but NOT in contract - verify with backend)

- ⚠️ **GET `/api/v1/students/:id`**
  - Used in: `src/pages/StudentDetail.tsx`
  - Hook: `useGetStudentByIdQuery()`
  - Status: **ACTIVE** (but NOT in contract - verify with backend)

- ⚠️ **GET `/api/v1/students/:id/summary`**
  - Used in: `src/pages/StudentDetail.tsx`
  - Hook: `useGetStudentSummaryQuery()`
  - Status: **ACTIVE** (but NOT in contract - verify with backend)

---

## ✅ Integrated but NOT Used in Components Yet

### 4. Dashboard (3 endpoints)
- ✅ **GET `/api/v1/dashboard/top-apps`**
  - Hook: `useGetTopAppsQuery()`
  - Status: Integrated, ready to use

- ✅ **GET `/api/v1/dashboard/website-usage`**
  - Hook: `useGetWebsiteUsageQuery()`
  - Status: Integrated, ready to use

- ✅ **GET `/api/v1/dashboard/screenshots`**
  - Hook: `useGetScreenshotsQuery()`
  - Status: Integrated, ready to use

### 5. Monitor (2 endpoints)
- ✅ **GET `/api/v1/monitor/activities`**
  - Hook: `useGetActivitiesQuery()`
  - Status: Integrated, ready to use
  - **FIXED**: Now uses `startDate`, `endDate` per contract

- ✅ **GET `/api/v1/monitor/activities/summary`**
  - Hook: `useGetActivitiesSummaryQuery()`
  - Status: Integrated, ready to use
  - **FIXED**: Now uses `startDate`, `endDate` per contract

- ✅ **GET `/api/v1/monitor/screenshots/:id`**
  - Hook: `useGetScreenshotByIdQuery()`
  - Status: Integrated, ready to use

---

## ❌ NOT Integrated (Available in Contract)

### Authentication (4 endpoints)
- ❌ `POST /api/v1/auth/register`
- ❌ `POST /api/v1/auth/register-parent-student`
- ❌ `POST /api/v1/auth/refresh-token`
- ❌ `PUT /api/v1/auth/profile`

### Dashboard (2 endpoints)
- ❌ `GET /api/v1/dashboard/productivity-score`
- ❌ `GET /api/v1/dashboard/activity-report`

### Monitor (8 endpoints)
- ❌ `POST /api/v1/monitor/screenshot` (file upload)
- ❌ `GET /api/v1/monitor/screenshots` (different from dashboard/screenshots)
- ❌ `DELETE /api/v1/monitor/screenshots/:id`
- ❌ `POST /api/v1/monitor/activity` (log activity)
- ❌ `POST /api/v1/monitor/keystrokes`
- ❌ `GET /api/v1/monitor/keystrokes`
- ❌ `POST /api/v1/monitor/metrics`
- ❌ `GET /api/v1/monitor/metrics`
- ❌ `GET /api/v1/monitor/metrics/summary`

### Recommendations (11 endpoints)
- ❌ All recommendation endpoints (0/11 integrated)

### Health Check (1 endpoint)
- ❌ `GET /health`

---

## 📊 Summary

| Category | Total in Contract | Integrated | Used in Components | Missing |
|----------|-------------------|------------|---------------------|---------|
| **Authentication** | 7 | 3 | 3 | 4 |
| **Dashboard** | 7 | 5 | 2 | 2 |
| **Monitor** | 11 | 3 | 0 | 8 |
| **Students** | 0 | 3 | 3 | 0 ⚠️ |
| **Recommendations** | 11 | 0 | 0 | 11 |
| **Health** | 1 | 0 | 0 | 1 |
| **TOTAL** | **37** | **14** | **8** | **26** |

---

## 🚨 Critical Issues Fixed

1. ✅ **Response Format**: Updated to handle both `{ status: "success" }` and `{ success: true }`
2. ✅ **Monitor Activities**: Fixed parameters to use `startDate`, `endDate` per contract
3. ⚠️ **Students Endpoints**: Not in contract - need to verify with backend

---

## 📝 Next Steps

1. **Verify Students Endpoints**: Check if `/api/v1/students` endpoints exist in backend
2. **Add Missing Endpoints**: Based on requirements
3. **Update Components**: Use the integrated but unused endpoints
4. **Test API Calls**: Verify all endpoints work with backend

