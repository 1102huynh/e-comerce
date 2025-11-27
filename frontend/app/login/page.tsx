'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, id, fullName, roles } = response.data;
      setAuth({ id, email, fullName, roles }, token);

      // Remember me functionality
      if (rememberMe) {
        localStorage.setItem('rememberEmail', email);
      } else {
        localStorage.removeItem('rememberEmail');
      }

      toast.success('🎉 Welcome back! Logging in...');
      router.push('/products');
    } catch (error: any) {
      toast.error(error.response?.data?.message || '❌ Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email && password && password.length >= 6;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="max-w-md w-full bg-gradient-to-br from-gray-900 to-gray-900/80 rounded-2xl shadow-2xl border border-gray-800 p-8 relative z-10 hover:border-gray-700 transition-colors">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="text-6xl mb-4 inline-block animate-float">🧢</div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3">Welcome Back</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Sign in to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              📧 Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 transition-all hover:border-gray-600"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              🔐 Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 transition-all hover:border-gray-600 pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 accent-white"
              />
              <span className="font-medium">Remember me</span>
            </label>
            <Link
              href="#"
              className="text-gray-400 hover:text-white font-medium transition-colors"
              onClick={(e) => {
                e.preventDefault();
                toast.error('Password reset coming soon!');
              }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full bg-gradient-to-r from-white to-gray-100 text-black font-black py-4 px-4 rounded-full hover:from-gray-200 hover:to-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 disabled:from-gray-700 disabled:to-gray-600 disabled:text-gray-500 transition-all transform hover:scale-105 shadow-lg disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Signing in...
              </span>
            ) : (
              '🔓 Sign In'
            )}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-gray-400 relative z-10">
          Don't have an account?{' '}
          <Link href="/register" className="text-white hover:text-gray-300 font-semibold underline underline-offset-4 transition-colors">
            Create one
          </Link>
        </p>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700 relative z-10">
          <p className="text-sm font-bold mb-3 text-white">🎯 Demo Accounts:</p>
          <div className="space-y-2">
            <div className="text-xs">
              <p className="text-gray-300"><span className="font-semibold">Admin:</span> admin@example.com</p>
              <p className="text-gray-400">Password: admin123</p>
            </div>
            <div className="border-t border-gray-700 pt-2">
              <p className="text-gray-300"><span className="font-semibold">User:</span> user@example.com</p>
              <p className="text-gray-400">Password: user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}