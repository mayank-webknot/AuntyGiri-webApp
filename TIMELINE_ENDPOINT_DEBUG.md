# Timeline Endpoint Debug Info

## Request Details

**URL**: `http://localhost:3000/api/v1/dashboard/timeline?date=2025-11-22&interval=day`  
**Method**: `GET`  
**Status**: `500 Internal Server Error`

## Contract Requirements ✅

According to the contract:
- **Path**: `/api/v1/dashboard/timeline`
- **Query Parameters**:
  - `date` (ISO8601 date, optional, default: today) - Format: `YYYY-MM-DD`
  - `interval` (string, optional, default: 'hour') - Values: `'minute' | 'hour' | 'day'`

## Current Implementation ✅

**File**: `src/store/api/dashboardApi.ts`

```typescript
getTimeline: builder.query<ApiResponse<{
  timeline: Record<string, Array<{ app_name: string; duration: number }>>;
  activity_types: string[];
}>, TimelineQueryParams>({
  query: (params) => {
    const searchParams = new URLSearchParams();
    if (params.date) searchParams.append('date', params.date);
    if (params.interval) searchParams.append('interval', params.interval);
    
    return {
      url: `/dashboard/timeline?${searchParams.toString()}`,
    };
  },
  providesTags: ['Dashboard'],
}),
```

**Query Params Type**:
```typescript
export interface TimelineQueryParams {
  date?: string; // ISO8601 date (YYYY-MM-DD)
  interval?: 'minute' | 'hour' | 'day';
}
```

## Request Being Sent ✅

- ✅ **Path**: `/api/v1/dashboard/timeline` (correct)
- ✅ **Query Param `date`**: `2025-11-22` (ISO8601 format, correct)
- ✅ **Query Param `interval`**: `day` (valid value, correct)
- ✅ **Method**: `GET` (correct)
- ✅ **Headers**: `Authorization: Bearer <token>` (automatic via baseApi)
- ✅ **Content-Type**: `application/json` (automatic via baseApi)

## Analysis

**The request is 100% correct according to the contract!**

The 500 error is a **backend server error**, not a client-side issue. Possible backend causes:

1. **Database connection issue**
2. **Invalid date processing** (though `2025-11-22` is valid)
3. **Missing data** for that date
4. **Backend validation error**
5. **Authentication/authorization issue** (though 500 suggests server error, not auth)

## Debugging Steps

1. **Check backend logs** - The 500 error should have details in backend console
2. **Try different date** - Try today's date: `2025-01-21`
3. **Try different interval** - Try `hour` instead of `day`
4. **Check authentication** - Verify token is valid
5. **Test with curl/Postman** - Test directly to isolate frontend vs backend issue

## Test Commands

```bash
# Test with today's date
curl -X GET "http://localhost:3000/api/v1/dashboard/timeline?date=2025-01-21&interval=hour" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# Test with day interval
curl -X GET "http://localhost:3000/api/v1/dashboard/timeline?date=2025-01-21&interval=day" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

## Frontend Implementation Status

✅ **100% Contract Compliant**

The frontend is sending the request exactly as specified in the contract. The 500 error is a backend issue that needs to be investigated on the server side.

