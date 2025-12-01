'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useThemeStore } from '@/store/themeStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const { theme, toggleTheme } = useThemeStore();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setMobileMenuOpen(false);
  };

  const isDark = theme === 'dark';

  return (
    <nav
      style={{
        backgroundColor: 'var(--nav-bg)',
        color: 'var(--nav-text)',
        borderBottomColor: 'var(--nav-border)',
      }}
      className="text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm border-b transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform">
            <span className="text-3xl">🧢</span>
            <span className={`hidden sm:inline font-black ${isDark ? 'text-white' : 'text-black'}`}>HatShop</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              href="/products"
              style={{ color: 'var(--nav-text)' }}
              className="font-semibold transition-colors px-3 py-2 rounded-lg hover:opacity-70"
            >
              🛍️ Shop
            </Link>

            {user ? (
              <>
                <Link
                  href="/cart"
                  style={{ color: 'var(--nav-text)' }}
                  className="relative font-semibold transition-colors px-3 py-2 rounded-lg hover:opacity-70"
                >
                  🛒 Cart
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg animate-pulse">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
                <Link
                  href="/orders"
                  style={{ color: 'var(--nav-text)' }}
                  className="font-semibold transition-colors px-3 py-2 rounded-lg hover:opacity-70"
                >
                  📦 Orders
                </Link>
                {user.roles?.includes('ADMIN') && (
                  <Link
                    href="/admin"
                    style={{
                      backgroundColor: isDark ? '#1f2937' : '#e5e7eb',
                      color: isDark ? '#ffffff' : '#000000',
                      borderColor: 'var(--nav-border)',
                    }}
                    className="font-semibold px-4 py-2 rounded-full transition-all border hover:opacity-80"
                  >
                    ⚙️ Admin
                  </Link>
                )}
                <div className="flex items-center gap-2 ml-2 pl-2 border-l transition-colors duration-300" style={{ borderLeftColor: 'var(--nav-border)' }}>
                  <span
                    style={{
                      backgroundColor: 'var(--nav-hover)',
                      color: 'var(--nav-text)',
                      borderColor: 'var(--nav-border)',
                    }}
                    className="text-sm px-3 py-1 rounded-full border font-medium"
                  >
                    👤 {user.fullName}
                  </span>
                  <button
                    onClick={handleLogout}
                    style={{
                      backgroundColor: 'var(--nav-hover)',
                      color: 'var(--nav-text)',
                      borderColor: 'var(--nav-border)',
                    }}
                    className="px-4 py-2 rounded-full font-semibold transition-all border hover:opacity-80"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{ color: 'var(--nav-text)' }}
                  className="font-semibold transition-colors px-3 py-2 rounded-lg hover:opacity-70"
                >
                  🔓 Login
                </Link>
                <Link
                  href="/register"
                  style={{
                    backgroundColor: isDark ? '#ffffff' : '#000000',
                    color: isDark ? '#000000' : '#ffffff',
                  }}
                  className="px-6 py-2 rounded-full font-bold transition-all shadow-lg transform hover:scale-105"
                >
                  ✨ Register
                </Link>
              </>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                backgroundColor: 'var(--nav-hover)',
                color: 'var(--nav-text)',
                borderColor: 'var(--nav-border)',
              }}
              className="ml-2 px-4 py-2 rounded-full font-bold transition-all border hover:opacity-80"
              title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            >
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Theme Toggle for Mobile */}
            <button
              onClick={toggleTheme}
              style={{
                backgroundColor: 'var(--nav-hover)',
                color: 'var(--nav-text)',
              }}
              className="p-2 rounded-lg transition-colors"
              title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                backgroundColor: 'var(--nav-hover)',
                color: 'var(--nav-text)',
              }}
              className="p-2 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: 'var(--nav-bg)',
              borderTopColor: 'var(--nav-border)',
            }}
            className="md:hidden pb-4 space-y-2 border-t pt-4 transition-colors duration-300"
          >
            <Link
              href="/products"
              style={{ color: 'var(--nav-text)' }}
              className="block font-semibold transition-colors px-3 py-2 rounded-lg hover:opacity-70"
            >
              🛍️ Shop
            </Link>

            {user ? (
              <>
                <Link
                  href="/cart"
                  style={{ color: 'var(--nav-text)' }}
                  className="block relative font-semibold transition-colors px-3 py-2 rounded-lg hover:opacity-70"
                >
                  🛒 Cart {getTotalItems() > 0 && <span className="text-red-400">({getTotalItems()})</span>}
                </Link>
                <Link
                  href="/orders"
                  style={{ color: 'var(--nav-text)' }}
                  className="block font-semibold transition-colors px-3 py-2 rounded-lg hover:opacity-70"
                >
                  📦 Orders
                </Link>
                {user.roles?.includes('ADMIN') && (
                  <Link
                    href="/admin"
                    style={{ color: 'var(--nav-text)' }}
                    className="block font-semibold px-3 py-2 rounded-lg transition-all hover:opacity-70"
                  >
                    ⚙️ Admin Panel
                  </Link>
                )}
                <div
                  style={{
                    borderTopColor: 'var(--nav-border)',
                  }}
                  className="border-t pt-2 mt-2 transition-colors duration-300"
                >
                  <p style={{ color: 'var(--nav-text)' }} className="text-sm px-3 py-2">
                    👤 {user.fullName}
                  </p>
                  <button
                    onClick={handleLogout}
                    style={{
                      backgroundColor: 'var(--nav-hover)',
                      color: 'var(--nav-text)',
                    }}
                    className="block w-full text-left px-3 py-2 rounded-lg font-semibold transition-all hover:opacity-70"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{ color: 'var(--nav-text)' }}
                  className="block font-semibold transition-colors px-3 py-2 rounded-lg hover:opacity-70"
                >
                  🔓 Login
                </Link>
                <Link
                  href="/register"
                  style={{
                    backgroundColor: isDark ? '#ffffff' : '#000000',
                    color: isDark ? '#000000' : '#ffffff',
                  }}
                  className="block px-3 py-2 rounded-full font-bold transition-all text-center"
                >
                  ✨ Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

