import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { registerSchema, type RegisterFormData } from '../schemas/auth.schema';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { getErrorMessage } from '../lib/utils';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError(null);
      const response = await api.post('/auth/register', data);
      
      const { user, accessToken } = response.data.data;
      setAuth(user, accessToken);
      
      navigate('/dashboard', { replace: true });
    } catch (error: unknown) {
      setServerError(getErrorMessage(error, 'Failed to register. Please try again.'));
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="text-center mb-8">
        <p className="text-sm text-gray-600">
          Create a new Sales User account
        </p>
      </div>

      {serverError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {serverError}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
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
          <UserPlus className="mr-2 h-4 w-4" /> Create Account
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600">Already have an account? </span>
        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
          Sign in here
        </Link>
      </div>
    </div>
  );
};
