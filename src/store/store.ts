import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './baseApi';

// Import all API slices to ensure they're registered
import './api/authApi';
import './api/dashboardApi';
import './api/studentsApi';
import './api/studentDetailApi';
import './api/monitorApi';
import './api/appsWebsitesApi';
import './api/screenshotsApi';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

