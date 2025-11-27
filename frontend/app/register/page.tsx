'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as apiModule from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/lib/toast';

const api = apiModule.default;

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      const { token, userId, email, fullName, roles } = response.data;
      console.log('Register response:', response.data);
      setAuth({ id: userId, email, fullName, roles }, token);
      toast.success('🎉 Welcome! Your account has been created successfully!');
      router.push('/products');
    } catch (error: any) {
      console.error('Register error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.email && formData.password && formData.fullName && formData.password.length >= 6;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="max-w-md w-full bg-gradient-to-br from-gray-900 to-gray-900/80 rounded-2xl shadow-2xl border border-gray-800 p-8 relative z-10 hover:border-gray-700 transition-colors">
        {/* Decorative corner */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-br-full"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="text-6xl mb-4 inline-block animate-float">🧢</div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3">Join HatShop</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Create your account to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              📧 Email Address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 transition-all hover:border-gray-600"
              placeholder="your@email.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              🔐 Password <span className="text-red-400">*</span> <span className="text-gray-500 font-normal">(min 6 chars)</span>
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 transition-all hover:border-gray-600"
              placeholder="Enter a secure password"
            />
            {formData.password && formData.password.length < 6 && (
              <p className="text-xs text-yellow-400 mt-1">⚠️ Password must be at least 6 characters</p>
            )}
          </div>

          {/* Full Name Field */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              👤 Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 transition-all hover:border-gray-600"
              placeholder="John Doe"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full bg-gradient-to-r from-white to-gray-100 text-black font-black py-4 px-4 rounded-full hover:from-gray-200 hover:to-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 disabled:from-gray-700 disabled:to-gray-600 disabled:text-gray-500 transition-all transform hover:scale-105 shadow-lg disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Creating Account...
              </span>
            ) : (
              <span>✨ Create Account</span>
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-400 relative z-10">
          Already have an account?{' '}
          <Link href="/login" className="text-white hover:text-gray-300 font-semibold underline underline-offset-4 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

