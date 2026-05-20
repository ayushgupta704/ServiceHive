import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const AuthLayout = () => {
  const { isAuthenticated } = useAuthStore();

  // Redirect to dashboard if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
            Smart Leads Dashboard
          </h2>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
