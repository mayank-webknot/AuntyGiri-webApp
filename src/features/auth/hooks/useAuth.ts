import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { useLoginMutation, useLogoutMutation } from '../services/authApi';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/authSlice';
import type { LoginRequest } from '../../../shared/types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authState = useAppSelector((state) => state.auth);
  
  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      dispatch(loginStart());
      const response = await loginMutation(credentials).unwrap();
      
      if (response.success) {
        dispatch(loginSuccess(response.data));
        navigate('/dashboard');
        return { success: true };
      } else {
        dispatch(loginFailure(response.message || 'Login failed'));
        return { success: false, error: response.message };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  }, [dispatch, loginMutation, navigate]);

  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      // Even if logout API fails, we should clear local state
      console.error('Logout API failed:', error);
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  }, [dispatch, logoutMutation, navigate]);

  const isAuthenticated = authState.isAuthenticated;
  const user = authState.user;
  const isLoading = authState.isLoading;
  const error = authState.error;

  return {
    login,
    logout: handleLogout,
    isAuthenticated,
    user,
    isLoading,
    error,
  };
};
