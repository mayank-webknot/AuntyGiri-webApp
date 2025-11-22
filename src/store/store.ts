import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './baseApi';

// Import all API slices to ensure they're registered
import './api/authApi';
import './api/dashboardApi';
import './api/monitorApi';
import './api/monitorMetricsApi';
import './api/monitorKeystrokesApi';
import './api/appsWebsitesApi';
import './api/screenshotsApi';
import './api/recommendationsApi';
// Students APIs removed - not in contract

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

