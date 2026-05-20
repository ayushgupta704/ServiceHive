import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardHome } from '../pages/DashboardHome';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';

export const AppRoutes = () => {
  const { setAuth, logout } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize auth state (check if user is logged in via refresh token / me endpoint)
  useEffect(() => {
    const initAuth = async () => {
      try {
        // We first try to get /me. The interceptor will use the access token if it exists.
        // If there's no access token, or it's expired, it might fail.
        // In a real app, the interceptor would attempt a silent refresh first.
        // For now, let's just attempt to call the refresh endpoint to get a fresh access token if we have an HttpOnly cookie.
        
        try {
          const refreshRes = await api.post('/auth/refresh');
          const { user, accessToken } = refreshRes.data.data;
          setAuth(user, accessToken);
        } catch (refreshErr) {
          // No valid refresh token
          logout();
        }
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [setAuth, logout]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardHome />} />
        {/* We will add leads routes here in Phase 4 */}
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
