import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '../../features/auth/services/authApi';
import { dashboardApi } from '../../features/dashboard/services/dashboardApi';
import { studentsApi } from '../../features/students/services/studentsApi';
import { studentDetailApi } from '../../features/students/services/studentDetailApi';
import { appsWebsitesApi } from '../../features/students/services/appsWebsitesApi';
import { screenshotsApi } from '../../features/students/services/screenshotsApi';
import authReducer from '../../features/auth/store/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [studentsApi.reducerPath]: studentsApi.reducer,
    [studentDetailApi.reducerPath]: studentDetailApi.reducer,
    [appsWebsitesApi.reducerPath]: appsWebsitesApi.reducer,
    [screenshotsApi.reducerPath]: screenshotsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(
      authApi.middleware,
      dashboardApi.middleware,
      studentsApi.middleware,
      studentDetailApi.middleware,
      appsWebsitesApi.middleware,
      screenshotsApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
