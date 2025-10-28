import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../../stores/useAuthStore';
import { API_BASE_URL } from '../../api/config';
const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

type FormData = yup.InferType<typeof schema>;

const AdminLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      // Send role: 'admin' in the body
      const res = await fetch(`${API_BASE_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, role: 'admin' }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Login failed');
      if (result.user.role !== 'admin') {
        setError('You are not authorized to access the admin dashboard.');
        return;
      }
      localStorage.setItem('token', result.token);
      // Optionally, set user in Zustand store
      useAuthStore.getState().fetchSession();
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - Nagomi</title>
        <meta name="description" content="Admin login for Nagomi dashboard." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <Link to="/" className="flex items-center justify-center space-x-2 mb-4">
                <span className="text-xl font-bold text-gray-900">Nagomi Admin</span>
              </Link>
              <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
              <p className="mt-2 text-gray-600">Sign in to your admin account</p>
            </div>
            {error && <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register('email')}
                    type="email"
                    autoComplete="email"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLogin; 