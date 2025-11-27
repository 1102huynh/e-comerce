'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-black text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform">
            <span className="text-3xl">🧢</span>
            <span className="text-white hidden sm:inline font-black">HatShop</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/products" className="hover:text-gray-300 font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-gray-800/50">
              🛍️ Shop
            </Link>

            {user ? (
              <>
                <Link href="/cart" className="hover:text-gray-300 relative font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-gray-800/50">
                  🛒 Cart
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg animate-pulse">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
                <Link href="/orders" className="hover:text-gray-300 font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-gray-800/50">
                  📦 Orders
                </Link>
                {user.roles?.includes('ADMIN') && (
                  <Link href="/admin" className="hover:text-gray-300 font-semibold bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-2 rounded-full transition-all hover:from-gray-700 hover:to-gray-600 border border-gray-700 hover:border-gray-600">
                    ⚙️ Admin
                  </Link>
                )}
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-700">
                  <span className="text-sm bg-gray-800 px-3 py-1 rounded-full border border-gray-700 font-medium">👤 {user.fullName}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full font-semibold transition-all border border-gray-700 hover:border-gray-600"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-gray-300 font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-gray-800/50">
                  🔓 Login
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-full font-bold transition-all shadow-lg transform hover:scale-105"
                >
                  ✨ Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-gray-800 pt-4">
            <Link href="/products" className="block hover:text-gray-300 font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-gray-800/50">
              🛍️ Shop
            </Link>

            {user ? (
              <>
                <Link href="/cart" className="block hover:text-gray-300 relative font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-gray-800/50">
                  🛒 Cart {getTotalItems() > 0 && <span className="text-red-400">({getTotalItems()})</span>}
                </Link>
                <Link href="/orders" className="block hover:text-gray-300 font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-gray-800/50">
                  📦 Orders
                </Link>
                {user.roles?.includes('ADMIN') && (
                  <Link href="/admin" className="block hover:text-gray-300 font-semibold bg-gray-800 px-3 py-2 rounded-lg transition-all hover:bg-gray-700">
                    ⚙️ Admin Panel
                  </Link>
                )}
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <p className="text-sm text-gray-300 px-3 py-2">👤 {user.fullName}</p>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg font-semibold transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="block hover:text-gray-300 font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-gray-800/50">
                  🔓 Login
                </Link>
                <Link
                  href="/register"
                  className="block bg-white text-black hover:bg-gray-200 px-3 py-2 rounded-full font-bold transition-all text-center"
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

