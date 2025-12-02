'use client';

import Link from 'next/link';
import { useThemeStore } from '@/store/themeStore';

export default function Home() {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      {/* Hero Section with Advanced Animations */}
      <div className="relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
        {/* Animated Background Gradient */}
        <div
          style={{
            background: isDark
              ? 'linear-gradient(to bottom right, #1f2937, #0a0a0a)'
              : 'linear-gradient(to bottom right, #f3f4f6, #ffffff)',
          }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 -left-4 w-72 h-72 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob" style={{ backgroundColor: 'var(--foreground)' }}></div>
            <div className="absolute top-0 -right-4 w-72 h-72 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000" style={{ backgroundColor: 'var(--foreground)' }}></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000" style={{ backgroundColor: 'var(--foreground)' }}></div>
          </div>
        </div>

        {/* Grid Pattern Overlay */}
        <div
          style={{
            backgroundImage: isDark
              ? 'linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)'
              : 'linear-gradient(rgba(0,0,0,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.02) 1px, transparent 1px)',
            backgroundSize: '4rem 4rem',
            maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 110%)',
          }}
          className="absolute inset-0"
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="text-center">
            {/* Animated Hat Icon */}
            <div className="inline-block mb-8 relative">
              <div
                style={{
                  backgroundColor: 'var(--foreground)',
                  opacity: 0.1,
                }}
                className="absolute inset-0 blur-xl rounded-full animate-pulse"
              ></div>
              <span className="text-7xl md:text-8xl inline-block animate-float relative z-10">🧢</span>
            </div>

            {/* Main Title with Gradient Animation */}
            <h1
              style={{ color: 'var(--foreground)' }}
              className="text-6xl md:text-8xl font-black mb-6 leading-tight animate-gradient"
            >
              Premium Hats & Caps
            </h1>

            {/* Subtitle with Fade-in */}
            <p
              style={{
                color: 'var(--foreground)',
                opacity: 0.6,
              }}
              className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up"
            >
              Elevate your style with our handpicked collection of luxury headwear
            </p>

            {/* CTA Buttons with Enhanced Styling */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-12">
              <Link
                href="/products"
                style={{
                  backgroundColor: 'var(--nav-bg)',
                  color: 'var(--nav-text)',
                  borderColor: 'var(--nav-border)',
                }}
                className="group relative px-12 py-5 rounded-full font-bold text-lg transition-all transform hover:scale-110 shadow-2xl overflow-hidden border"
              >
                <span className="relative z-10">Shop Collection</span>
                <div
                  style={{
                    backgroundColor: 'var(--button-hover)',
                  }}
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                ></div>
              </Link>
              <Link
                href="/products"
                style={{
                  color: 'var(--nav-text)',
                  borderColor: 'var(--nav-border)',
                  backgroundColor: 'transparent',
                }}
                className="group relative px-12 py-5 rounded-full font-bold text-lg transition-all border-2 shadow-lg backdrop-blur-sm"
              >
                <span className="group-hover:scale-110 inline-block transition-transform">View Catalog →</span>
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-8 text-center mt-16">
              <div className="animate-fade-in-up animation-delay-200">
                <div style={{ color: 'var(--foreground)' }} className="text-4xl font-black mb-1">12+</div>
                <div style={{ color: 'var(--foreground)', opacity: 0.5 }} className="text-sm uppercase tracking-wider">Premium Styles</div>
              </div>
              <div className="animate-fade-in-up animation-delay-400">
                <div style={{ color: 'var(--foreground)' }} className="text-4xl font-black mb-1">100%</div>
                <div style={{ color: 'var(--foreground)', opacity: 0.5 }} className="text-sm uppercase tracking-wider">Authentic</div>
              </div>
              <div className="animate-fade-in-up animation-delay-600">
                <div style={{ color: 'var(--foreground)' }} className="text-4xl font-black mb-1">24/7</div>
                <div style={{ color: 'var(--foreground)', opacity: 0.5 }} className="text-sm uppercase tracking-wider">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stylish Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-20 md:h-32 opacity-50"
            style={{
              fill: 'var(--background)',
            }}
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </div>

      {/* Categories Showcase with Modern Design */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative"
        style={{ backgroundColor: 'var(--background)' }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            style={{
              backgroundColor: 'var(--foreground)',
              opacity: 0.05,
            }}
            className="absolute top-1/4 left-10 w-64 h-64 rounded-full blur-3xl"
          ></div>
          <div
            style={{
              backgroundColor: 'var(--foreground)',
              opacity: 0.05,
            }}
            className="absolute bottom-1/4 right-10 w-64 h-64 rounded-full blur-3xl"
          ></div>
        </div>

        <div className="text-center mb-20 relative z-10">
          <span
            style={{ color: 'var(--foreground)', opacity: 0.5 }}
            className="text-sm font-bold uppercase tracking-widest mb-4 block animate-fade-in-up"
          >
            Collections
          </span>
          <h2
            style={{ color: 'var(--foreground)' }}
            className="text-5xl md:text-6xl font-black mb-6 animate-fade-in-up animation-delay-200"
          >
            Featured Collections
          </h2>
          <div
            style={{
              background: 'var(--foreground)',
              opacity: 0.2,
            }}
            className="w-24 h-1 mx-auto mb-6"
          ></div>
          <p
            style={{
              color: 'var(--foreground)',
              opacity: 0.6,
            }}
            className="text-xl max-w-2xl mx-auto animate-fade-in-up animation-delay-400"
          >
            Find the perfect hat for every occasion and personality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {/* Baseball Caps */}
          <Link
            href="/products"
            style={{
              borderColor: 'var(--card-border)',
            }}
            className="group relative overflow-hidden rounded-3xl shadow-2xl transition-all transform hover:-translate-y-3 border hover:shadow-lg"
          >
            <div
              style={{
                background: isDark
                  ? 'linear-gradient(to bottom right, #1f2937, #0a0a0a)'
                  : 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)',
              }}
              className="aspect-square p-10 flex flex-col justify-end relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-300">⚾</div>
              <h3 className="text-3xl font-black text-white mb-3 relative z-10">Baseball Caps</h3>
              <p className="text-gray-400 text-sm relative z-10">Classic everyday style</p>
              <div className="mt-4 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                Shop Now →
              </div>
            </div>
          </Link>

          {/* Snapbacks */}
          <Link
            href="/products"
            style={{
              borderColor: 'var(--card-border)',
            }}
            className="group relative overflow-hidden rounded-3xl shadow-2xl transition-all transform hover:-translate-y-3 border hover:shadow-lg"
          >
            <div
              style={{
                background: isDark
                  ? 'linear-gradient(to bottom right, #1f2937, #0a0a0a)'
                  : 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)',
              }}
              className="aspect-square p-10 flex flex-col justify-end relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🎨</div>
              <h3 className="text-3xl font-black text-white mb-3 relative z-10">Snapback Caps</h3>
              <p className="text-gray-400 text-sm relative z-10">Urban streetwear vibes</p>
              <div className="mt-4 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                Shop Now →
              </div>
            </div>
          </Link>

          {/* Beanies */}
          <Link
            href="/products"
            style={{
              borderColor: 'var(--card-border)',
            }}
            className="group relative overflow-hidden rounded-3xl shadow-2xl transition-all transform hover:-translate-y-3 border hover:shadow-lg"
          >
            <div
              style={{
                background: isDark
                  ? 'linear-gradient(to bottom right, #1f2937, #0a0a0a)'
                  : 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)',
              }}
              className="aspect-square p-10 flex flex-col justify-end relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🧶</div>
              <h3 className="text-3xl font-black text-white mb-3 relative z-10">Beanies</h3>
              <p className="text-gray-400 text-sm relative z-10">Cozy winter warmth</p>
              <div className="mt-4 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                Shop Now →
              </div>
            </div>
          </Link>

          {/* Bucket Hats */}
          <Link
            href="/products"
            style={{
              borderColor: 'var(--card-border)',
            }}
            className="group relative overflow-hidden rounded-3xl shadow-2xl transition-all transform hover:-translate-y-3 border hover:shadow-lg"
          >
            <div
              style={{
                background: isDark
                  ? 'linear-gradient(to bottom right, #1f2937, #0a0a0a)'
                  : 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)',
              }}
              className="aspect-square p-10 flex flex-col justify-end relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-300">☀️</div>
              <h3 className="text-3xl font-black text-white mb-3 relative z-10">Bucket Hats</h3>
              <p className="text-gray-400 text-sm relative z-10">Festival ready style</p>
              <div className="mt-4 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                Shop Now →
              </div>
            </div>
          </Link>

          {/* Trucker Hats */}
          <Link
            href="/products"
            style={{
              borderColor: 'var(--card-border)',
            }}
            className="group relative overflow-hidden rounded-3xl shadow-2xl transition-all transform hover:-translate-y-3 border hover:shadow-lg"
          >
            <div
              style={{
                background: isDark
                  ? 'linear-gradient(to bottom right, #1f2937, #0a0a0a)'
                  : 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)',
              }}
              className="aspect-square p-10 flex flex-col justify-end relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🚚</div>
              <h3 className="text-3xl font-black text-white mb-3 relative z-10">Trucker Hats</h3>
              <p className="text-gray-400 text-sm relative z-10">Vintage casual cool</p>
              <div className="mt-4 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                Shop Now →
              </div>
            </div>
          </Link>

          {/* Fedoras */}
          <Link
            href="/products"
            style={{
              borderColor: 'var(--card-border)',
            }}
            className="group relative overflow-hidden rounded-3xl shadow-2xl transition-all transform hover:-translate-y-3 border hover:shadow-lg"
          >
            <div
              style={{
                background: isDark
                  ? 'linear-gradient(to bottom right, #1f2937, #0a0a0a)'
                  : 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)',
              }}
              className="aspect-square p-10 flex flex-col justify-end relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🎩</div>
              <h3 className="text-3xl font-black text-white mb-3 relative z-10">Fedoras & Dress Hats</h3>
              <p className="text-gray-400 text-sm relative z-10">Sophisticated elegance</p>
              <div className="mt-4 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                Shop Now →
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Features Section with Modern Cards */}
      <div
        className="relative py-24 border-y"
        style={{
          borderColor: 'var(--card-border)',
          backgroundColor: 'var(--background)',
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-b"
          style={{
            background: isDark
              ? 'linear-gradient(to bottom, #000000, rgba(31, 41, 55, 0.5), #000000)'
              : 'linear-gradient(to bottom, #ffffff, rgba(243, 244, 246, 0.5), #ffffff)',
          }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className="group text-center p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
              }}
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg"
                style={{
                  backgroundColor: 'var(--input-bg)',
                }}
              >
                <span className="text-4xl">🚚</span>
              </div>
              <h3
                className="text-xl font-black mb-3"
                style={{ color: 'var(--foreground)' }}
              >
                Free Shipping
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: 'var(--foreground)',
                  opacity: 0.6,
                }}
              >
                On orders over $50 worldwide
              </p>
            </div>

            <div
              className="group text-center p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
              }}
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg"
                style={{
                  backgroundColor: 'var(--input-bg)',
                }}
              >
                <span className="text-4xl">✨</span>
              </div>
              <h3
                className="text-xl font-black mb-3"
                style={{ color: 'var(--foreground)' }}
              >
                Premium Quality
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: 'var(--foreground)',
                  opacity: 0.6,
                }}
              >
                100% authentic brands guaranteed
              </p>
            </div>

            <div
              className="group text-center p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
              }}
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg"
                style={{
                  backgroundColor: 'var(--input-bg)',
                }}
              >
                <span className="text-4xl">🔄</span>
              </div>
              <h3
                className="text-xl font-black mb-3"
                style={{ color: 'var(--foreground)' }}
              >
                Easy Returns
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: 'var(--foreground)',
                  opacity: 0.6,
                }}
              >
                30-day hassle-free returns
              </p>
            </div>

            <div
              className="group text-center p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
              }}
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg"
                style={{
                  backgroundColor: 'var(--input-bg)',
                }}
              >
                <span className="text-4xl">💳</span>
              </div>
              <h3
                className="text-xl font-black mb-3"
                style={{ color: 'var(--foreground)' }}
              >
                Secure Payment
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: 'var(--foreground)',
                  opacity: 0.6,
                }}
              >
                SSL encrypted checkout
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div
        className="py-24 relative overflow-hidden"
        style={{
          backgroundColor: 'var(--background)',
          background: isDark
            ? 'linear-gradient(to bottom right, #111827, #0a0a0a, #111827)'
            : 'linear-gradient(to bottom right, #f3f4f6, #ffffff, #f3f4f6)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="relative">
            {/* Glow Effect */}
            <div
              className="absolute inset-0 rounded-3xl blur-3xl"
              style={{
                background: 'var(--foreground)',
                opacity: isDark ? 0.05 : 0.03,
              }}
            ></div>

            {/* Content Card */}
            <div
              className="relative rounded-3xl p-12 md:p-16 border shadow-2xl"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
              }}
            >
              {/* Decorative Elements */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -z-10"
                style={{
                  background: 'var(--foreground)',
                  opacity: 0.05,
                }}
              ></div>
              <div
                className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl -z-10"
                style={{
                  background: 'var(--foreground)',
                  opacity: 0.05,
                }}
              ></div>

              <div className="mb-6">
                <span className="text-5xl inline-block animate-bounce">🎯</span>
              </div>

              <h2
                className="text-5xl md:text-6xl font-black mb-6 leading-tight"
                style={{ color: 'var(--foreground)' }}
              >
                Ready to Find Your
                <span
                  className="block animate-gradient bg-[length:200%_auto]"
                  style={{
                    color: 'var(--foreground)',
                    opacity: 0.7,
                  }}
                >
                  Perfect Style?
                </span>
              </h2>

              <p
                className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
                style={{
                  color: 'var(--foreground)',
                  opacity: 0.6,
                }}
              >
                Browse our complete collection of premium hats and caps for every occasion. From streetwear to sophisticated elegance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/products"
                  style={{
                    backgroundColor: 'var(--nav-bg)',
                    color: 'var(--nav-text)',
                  }}
                  className="group relative px-12 py-5 rounded-full font-black text-lg transition-all transform hover:scale-110 shadow-2xl overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Shopping
                    <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      backgroundColor: 'var(--button-hover)',
                    }}
                  ></div>
                </Link>

                <Link
                  href="/products"
                  style={{
                    color: 'var(--foreground)',
                  }}
                  className="font-semibold transition-opacity hover:opacity-70 underline underline-offset-4"
                >
                  View All Collections
                </Link>
              </div>

              {/* Trust Badges */}
              <div
                className="mt-12 flex flex-wrap justify-center gap-6 text-sm"
                style={{
                  color: 'var(--foreground)',
                  opacity: 0.6,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Premium Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}