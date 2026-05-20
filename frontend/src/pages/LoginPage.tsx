import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { loginSchema, type LoginFormData } from '../schemas/auth.schema';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { getErrorMessage } from '../lib/utils';

export const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError(null);
      const response = await api.post('/auth/login', data);
      
      const { user, accessToken } = response.data.data;
      setAuth(user, accessToken);
      
      navigate('/dashboard', { replace: true });
    } catch (error: unknown) {
      setServerError(getErrorMessage(error, 'Failed to login. Please try again.'));
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="text-center mb-8">
        <p className="text-sm text-gray-600">
          Sign in to access your CRM dashboard
        </p>
      </div>

      {serverError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {serverError}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email Address"
          type="email"
          placeholder="admin@servicehive.tech"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button 
          type="submit" 
          className="w-full" 
          isLoading={isSubmitting}
        >
          <LogIn className="mr-2 h-4 w-4" /> Sign In
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600">Don't have an account? </span>
        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
          Register here
        </Link>
      </div>
    </div>
  );
};
