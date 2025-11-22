# API Endpoints Summary - Quick Reference

## ✅ Currently USED in Web App (8 endpoints)

### Authentication
1. `POST /api/v1/auth/login` → Login page
2. `GET /api/v1/auth/me` → Auth context (session check)
3. `POST /api/v1/auth/logout` → Logout functionality

### Dashboard
4. `GET /api/v1/dashboard/summary` → Dashboard page
5. `GET /api/v1/dashboard/timeline` → Dashboard page

### Students ⚠️
6. `GET /api/v1/students` → Students list page
7. `GET /api/v1/students/:id` → Student detail page
8. `GET /api/v1/students/:id/summary` → Student detail page

**⚠️ WARNING**: Students endpoints are NOT in the contract! Verify with backend.

---

## ✅ Integrated but NOT Used (6 endpoints)

9. `GET /api/v1/dashboard/top-apps`
10. `GET /api/v1/dashboard/website-usage`
11. `GET /api/v1/dashboard/screenshots`
12. `GET /api/v1/monitor/activities`
13. `GET /api/v1/monitor/activities/summary`
14. `GET /api/v1/monitor/screenshots/:id`

---

## ❌ NOT Integrated (23+ endpoints)

### Should Add
- `POST /api/v1/auth/refresh-token` (token refresh)
- `GET /api/v1/dashboard/productivity-score`
- `GET /api/v1/dashboard/activity-report`

### Optional
- All recommendation endpoints (11)
- Monitor upload/logging endpoints (8)
- Health check (1)

---

## 🔧 Fixes Applied

✅ Response format compatibility (`status` → `success`)  
✅ Monitor activities parameters (`startDate`, `endDate`)  
✅ Activities summary parameters fixed

---

**See `API_INTEGRATION_REPORT.md` for detailed analysis.**

