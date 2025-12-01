'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';

export default function AdminPage() {
  const { user, isAdmin } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give time for auth to hydrate from localStorage
    const timer = setTimeout(() => {
      if (!user || !isAdmin()) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [user, isAdmin, router]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--background)' }}
      >
        <div style={{ color: 'var(--foreground)' }} className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
          style={{
            backgroundColor: 'var(--foreground)',
            opacity: 0.05,
          }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl"
          style={{
            backgroundColor: 'var(--foreground)',
            opacity: 0.05,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-12 text-center">
          <div className="text-6xl mb-4 inline-block">⚙️</div>
          <h1
            className="text-5xl md:text-6xl font-black mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            Admin Dashboard
          </h1>
          <div
            className="w-24 h-1 mx-auto mb-4"
            style={{
              background: 'var(--foreground)',
              opacity: 0.2,
            }}
          ></div>
          <p
            className="text-lg"
            style={{
              color: 'var(--foreground)',
              opacity: 0.6,
            }}
          >
            Manage your e-commerce platform
          </p>
        </div>

        {/* Management Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Products Card */}
          <Link
            href="/admin/products"
            className="group relative rounded-2xl p-8 hover:-translate-y-3 hover:shadow-2xl overflow-hidden transition-all"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
            }}
          >
            <div
              className="absolute inset-0 group-hover:from-white/5 group-hover:to-transparent transition-all duration-500"
              style={{
                background: 'linear-gradient(to bottom right, transparent, transparent)',
              }}
            ></div>
            <div className="relative z-10">
              <div className="text-6xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">📦</div>
              <h2
                className="text-3xl font-black mb-3"
                style={{ color: 'var(--foreground)' }}
              >
                Manage Products
              </h2>
              <p
                className="leading-relaxed"
                style={{
                  color: 'var(--foreground)',
                  opacity: 0.6,
                }}
              >
                Add, edit, and delete products from your catalog
              </p>
              <div
                className="mt-6 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
                style={{ color: 'var(--foreground)' }}
              >
                Go to Products
                <span className="group-hover:translate-x-2 transition-transform inline-block">→</span>
              </div>
            </div>
          </Link>

          {/* Categories Card */}
          <Link
            href="/admin/categories"
            className="group relative rounded-2xl p-8 hover:-translate-y-3 hover:shadow-2xl overflow-hidden transition-all"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
            }}
          >
            <div
              className="absolute inset-0 group-hover:from-white/5 group-hover:to-transparent transition-all duration-500"
              style={{
                background: 'linear-gradient(to bottom right, transparent, transparent)',
              }}
            ></div>
            <div className="relative z-10">
              <div className="text-6xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">🏷️</div>
              <h2
                className="text-3xl font-black mb-3"
                style={{ color: 'var(--foreground)' }}
              >
                Manage Categories
              </h2>
              <p
                className="leading-relaxed"
                style={{
                  color: 'var(--foreground)',
                  opacity: 0.6,
                }}
              >
                Organize your products with categories
              </p>
              <div
                className="mt-6 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
                style={{ color: 'var(--foreground)' }}
              >
                Go to Categories
                <span className="group-hover:translate-x-2 transition-transform inline-block">→</span>
              </div>
            </div>
          </Link>

          {/* Orders Card */}
          <Link
            href="/admin/orders"
            className="group relative rounded-2xl p-8 hover:-translate-y-3 hover:shadow-2xl overflow-hidden transition-all"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
            }}
          >
            <div
              className="absolute inset-0 group-hover:from-white/5 group-hover:to-transparent transition-all duration-500"
              style={{
                background: 'linear-gradient(to bottom right, transparent, transparent)',
              }}
            ></div>
            <div className="relative z-10">
              <div className="text-6xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">📋</div>
              <h2
                className="text-3xl font-black mb-3"
                style={{ color: 'var(--foreground)' }}
              >
                Manage Orders
              </h2>
              <p
                className="leading-relaxed"
                style={{
                  color: 'var(--foreground)',
                  opacity: 0.6,
                }}
              >
                View and update customer order status
              </p>
              <div
                className="mt-6 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
                style={{ color: 'var(--foreground)' }}
              >
                Go to Orders
                <span className="group-hover:translate-x-2 transition-transform inline-block">→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Welcome Stats Section */}
        <div className="mt-12 bg-gradient-to-br from-gray-900 to-gray-900/80 rounded-2xl border border-gray-800 p-8 hover:border-gray-700 transition-colors">
          <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">👋</span>
            Welcome, {user?.fullName || 'Admin'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Products */}
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors group overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
              <div className="relative z-10">
                <div className="text-4xl font-black text-white mb-2">📦</div>
                <div className="text-4xl font-black text-white mb-2">12+</div>
                <div className="text-sm text-gray-400 font-semibold">Total Products</div>
              </div>
            </div>

            {/* Total Orders */}
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors group overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
              <div className="relative z-10">
                <div className="text-4xl font-black text-white mb-2">📊</div>
                <div className="text-4xl font-black text-white mb-2">0</div>
                <div className="text-sm text-gray-400 font-semibold">Total Orders</div>
              </div>
            </div>

            {/* Categories */}
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors group overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
              <div className="relative z-10">
                <div className="text-4xl font-black text-white mb-2">🏷️</div>
                <div className="text-4xl font-black text-white mb-2">6</div>
                <div className="text-sm text-gray-400 font-semibold">Categories</div>
              </div>
            </div>

            {/* Pending Orders */}
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors group overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
              <div className="relative z-10">
                <div className="text-4xl font-black text-white mb-2">⏳</div>
                <div className="text-4xl font-black text-white mb-2">0</div>
                <div className="text-sm text-gray-400 font-semibold">Pending Orders</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 pt-8 border-t border-gray-700">
            <h4 className="text-lg font-black text-white mb-4">⚡ Quick Actions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/admin/products"
                className="p-4 bg-gray-800/50 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-lg text-white font-semibold transition-all transform hover:scale-105 text-center"
              >
                ➕ Add Product
              </Link>
              <Link
                href="/admin/categories"
                className="p-4 bg-gray-800/50 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-lg text-white font-semibold transition-all transform hover:scale-105 text-center"
              >
                ➕ Add Category
              </Link>
              <Link
                href="/admin/orders"
                className="p-4 bg-gray-800/50 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-lg text-white font-semibold transition-all transform hover:scale-105 text-center"
              >
                👁️ View Orders
              </Link>
              <button
                onClick={() => window.location.href = '/'}
                className="p-4 bg-gray-800/50 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-lg text-white font-semibold transition-all transform hover:scale-105 text-center"
              >
                🏠 View Store
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

