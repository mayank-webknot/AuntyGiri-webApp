# API Usage Analysis - Current vs Available

## 📊 Summary

**Currently Using**: 11 endpoints  
**Available in Contract**: 50+ endpoints  
**Missing**: 39+ endpoints

---

## ✅ Currently Integrated & Used

### Authentication APIs (3/7)
- ✅ `POST /api/v1/auth/login` - **USED** in `AuthContext.tsx`
- ✅ `GET /api/v1/auth/me` - **USED** in `AuthContext.tsx`
- ✅ `POST /api/v1/auth/logout` - **USED** in `AuthContext.tsx`
- ❌ `POST /api/v1/auth/register` - **NOT USED**
- ❌ `POST /api/v1/auth/register-parent-student` - **NOT USED**
- ❌ `POST /api/v1/auth/refresh-token` - **NOT USED**
- ❌ `PUT /api/v1/auth/profile` - **NOT USED**

### Dashboard APIs (4/7)
- ✅ `GET /api/v1/dashboard/summary` - **USED** in `Dashboard.tsx`
- ✅ `GET /api/v1/dashboard/timeline` - **USED** in `Dashboard.tsx`
- ✅ `GET /api/v1/dashboard/top-apps` - **INTEGRATED** (not used in components yet)
- ✅ `GET /api/v1/dashboard/website-usage` - **INTEGRATED** (not used in components yet)
- ✅ `GET /api/v1/dashboard/screenshots` - **INTEGRATED** (not used in components yet)
- ❌ `GET /api/v1/dashboard/productivity-score` - **NOT INTEGRATED**
- ❌ `GET /api/v1/dashboard/activity-report` - **NOT INTEGRATED**

### Monitor APIs (3/11)
- ✅ `GET /api/v1/monitor/activities` - **INTEGRATED** (not used in components yet)
- ✅ `GET /api/v1/monitor/activities/summary` - **INTEGRATED** (not used in components yet)
- ✅ `GET /api/v1/monitor/screenshots/:id` - **INTEGRATED** (not used in components yet)
- ❌ `POST /api/v1/monitor/screenshot` - **NOT INTEGRATED** (file upload)
- ❌ `GET /api/v1/monitor/screenshots` - **NOT INTEGRATED** (different from dashboard/screenshots)
- ❌ `DELETE /api/v1/monitor/screenshots/:id` - **NOT INTEGRATED**
- ❌ `POST /api/v1/monitor/activity` - **NOT INTEGRATED** (log activity)
- ❌ `POST /api/v1/monitor/keystrokes` - **NOT INTEGRATED**
- ❌ `GET /api/v1/monitor/keystrokes` - **NOT INTEGRATED**
- ❌ `POST /api/v1/monitor/metrics` - **NOT INTEGRATED**
- ❌ `GET /api/v1/monitor/metrics` - **NOT INTEGRATED**
- ❌ `GET /api/v1/monitor/metrics/summary` - **NOT INTEGRATED**

### Students APIs (3/3) - Note: These don't exist in the contract!
- ⚠️ `GET /api/v1/students` - **USED** in `Students.tsx` (NOT in contract)
- ⚠️ `GET /api/v1/students/:id` - **USED** in `StudentDetail.tsx` (NOT in contract)
- ⚠️ `GET /api/v1/students/:id/summary` - **USED** in `StudentDetail.tsx` (NOT in contract)

### Recommendation APIs (0/11)
- ❌ All 11 recommendation endpoints - **NOT INTEGRATED**

### Health Check (0/1)
- ❌ `GET /health` - **NOT INTEGRATED**

---

## 🔍 Key Findings

### 1. **Students Endpoints Don't Match Contract**
The contract doesn't have `/api/v1/students` endpoints, but we're using them. These might be:
- Custom endpoints not in the contract
- Or need to be mapped differently

### 2. **Monitor Activities Parameters Mismatch**
- **Contract uses**: `startDate`, `endDate`, `limit`, `offset`, `appName`
- **We're using**: `studentId`, `from`, `to` (from Swagger spec)
- **Need to fix**: Should use `startDate` and `endDate` per contract

### 3. **Missing Critical Endpoints**
- No file upload for screenshots
- No activity logging
- No metrics tracking
- No recommendations system

### 4. **Response Format Mismatch**
- **Contract uses**: `{ status: "success", data: {...} }`
- **We're expecting**: `{ success: boolean, data: {...} }`
- **Need to fix**: Response format doesn't match

---

## 📋 Detailed Comparison

### Authentication Endpoints

| Endpoint | Status | Used In | Notes |
|----------|--------|---------|-------|
| `POST /auth/login` | ✅ Used | `AuthContext.tsx` | Response format mismatch |
| `GET /auth/me` | ✅ Used | `AuthContext.tsx` | Response format mismatch |
| `POST /auth/logout` | ✅ Used | `AuthContext.tsx` | ✅ |
| `POST /auth/register` | ❌ Missing | - | Could be useful |
| `POST /auth/register-parent-student` | ❌ Missing | - | Could be useful |
| `POST /auth/refresh-token` | ❌ Missing | - | Should add for token refresh |
| `PUT /auth/profile` | ❌ Missing | - | Could be useful |

### Dashboard Endpoints

| Endpoint | Status | Used In | Notes |
|----------|--------|---------|-------|
| `GET /dashboard/summary` | ✅ Used | `Dashboard.tsx` | Response format mismatch |
| `GET /dashboard/timeline` | ✅ Used | `Dashboard.tsx` | Response format mismatch |
| `GET /dashboard/top-apps` | ✅ Integrated | - | Not used in components |
| `GET /dashboard/website-usage` | ✅ Integrated | - | Not used in components |
| `GET /dashboard/screenshots` | ✅ Integrated | - | Not used in components |
| `GET /dashboard/productivity-score` | ❌ Missing | - | Should add |
| `GET /dashboard/activity-report` | ❌ Missing | - | Could be useful |

### Monitor Endpoints

| Endpoint | Status | Used In | Notes |
|----------|--------|---------|-------|
| `GET /monitor/activities` | ✅ Integrated | - | Parameter mismatch (should use startDate/endDate) |
| `GET /monitor/activities/summary` | ✅ Integrated | - | Parameter mismatch |
| `GET /monitor/screenshots/:id` | ✅ Integrated | - | Not used in components |
| `POST /monitor/screenshot` | ❌ Missing | - | File upload needed |
| `GET /monitor/screenshots` | ❌ Missing | - | Different from dashboard/screenshots |
| `DELETE /monitor/screenshots/:id` | ❌ Missing | - | Should add |
| `POST /monitor/activity` | ❌ Missing | - | Log activity needed |
| `POST /monitor/keystrokes` | ❌ Missing | - | Not needed for web app |
| `GET /monitor/keystrokes` | ❌ Missing | - | Not needed for web app |
| `POST /monitor/metrics` | ❌ Missing | - | Not needed for web app |
| `GET /monitor/metrics` | ❌ Missing | - | Not needed for web app |
| `GET /monitor/metrics/summary` | ❌ Missing | - | Not needed for web app |

### Students Endpoints

| Endpoint | Status | Used In | Notes |
|----------|--------|---------|-------|
| `GET /students` | ⚠️ Used | `Students.tsx` | **NOT IN CONTRACT** |
| `GET /students/:id` | ⚠️ Used | `StudentDetail.tsx` | **NOT IN CONTRACT** |
| `GET /students/:id/summary` | ⚠️ Used | `StudentDetail.tsx` | **NOT IN CONTRACT** |

### Recommendation APIs

| Endpoint | Status | Notes |
|----------|--------|-------|
| All 11 endpoints | ❌ Missing | Complete recommendation system not integrated |

---

## 🚨 Critical Issues to Fix

### 1. Response Format Mismatch
**Contract Format:**
```json
{
  "status": "success",
  "data": {...}
}
```

**Current Expected Format:**
```json
{
  "success": true,
  "data": {...}
}
```

**Action**: Update all API response types to match contract.

### 2. Monitor Activities Parameters
**Contract uses**: `startDate`, `endDate`, `limit`, `offset`, `appName`  
**We're using**: `studentId`, `from`, `to`

**Action**: Update `ActivitiesQueryParams` to match contract.

### 3. Students Endpoints Not in Contract
**Action**: Verify if these endpoints exist or need to be removed/mapped differently.

---

## 📝 Recommendations

### High Priority
1. ✅ Fix response format mismatch (status vs success)
2. ✅ Fix monitor activities parameters (startDate/endDate vs from/to)
3. ✅ Add refresh token endpoint
4. ✅ Verify students endpoints exist

### Medium Priority
5. Add productivity score endpoint
6. Add activity report endpoint
7. Add screenshot upload (if needed)
8. Add health check endpoint

### Low Priority
9. Add recommendation APIs (if needed)
10. Add profile update endpoint
11. Add register endpoints (if needed)

---

## 📊 Usage Statistics

- **Total Endpoints in Contract**: ~50
- **Currently Integrated**: 11
- **Currently Used in Components**: 6
- **Missing**: 39+
- **Coverage**: ~22%

