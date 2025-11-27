import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Advanced Animations */}
      <div className="relative overflow-hidden bg-black">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-white rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-white rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
          </div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="text-center">
            {/* Animated Hat Icon */}
            <div className="inline-block mb-8 relative">
              <div className="absolute inset-0 blur-xl bg-white/20 rounded-full animate-pulse"></div>
              <span className="text-7xl md:text-8xl inline-block animate-float relative z-10">🧢</span>
            </div>

            {/* Main Title with Gradient Animation */}
            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent leading-tight animate-gradient bg-[length:200%_auto]">
              Premium Hats & Caps
            </h1>

            {/* Subtitle with Fade-in */}
            <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up">
              Elevate your style with our handpicked collection of luxury headwear
            </p>

            {/* CTA Buttons with Enhanced Styling */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-12">
              <Link
                href="/products"
                className="group relative bg-white text-black px-12 py-5 rounded-full font-bold text-lg transition-all transform hover:scale-110 shadow-2xl hover:shadow-white/50 overflow-hidden"
              >
                <span className="relative z-10">Shop Collection</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <Link
                href="/products"
                className="group relative bg-transparent text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-white/10 transition-all border-2 border-white/50 hover:border-white shadow-lg backdrop-blur-sm"
              >
                <span className="group-hover:scale-110 inline-block transition-transform">View Catalog →</span>
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-8 text-center mt-16">
              <div className="animate-fade-in-up animation-delay-200">
                <div className="text-4xl font-black text-white mb-1">12+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Premium Styles</div>
              </div>
              <div className="animate-fade-in-up animation-delay-400">
                <div className="text-4xl font-black text-white mb-1">100%</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Authentic</div>
              </div>
              <div className="animate-fade-in-up animation-delay-600">
                <div className="text-4xl font-black text-white mb-1">24/7</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stylish Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-20 md:h-32 fill-black opacity-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </div>

      {/* Categories Showcase with Modern Design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="text-center mb-20 relative z-10">
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 block animate-fade-in-up">Collections</span>
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-white animate-fade-in-up animation-delay-200">
            Featured Collections
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6"></div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">Find the perfect hat for every occasion and personality</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {/* Baseball Caps */}
          <Link href="/products" className="group relative overflow-hidden rounded-3xl shadow-2xl transition-all transform hover:-translate-y-3 hover:shadow-white/10 border border-gray-800 hover:border-gray-700">
            <div className="aspect-square bg-gradient-to-br from-gray-900 via-gray-800 to-black p-10 flex flex-col justify-end relative">
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
          <Link href="/products" className="group relative overflow-hidden rounded-3xl shadow-2xl transition-all transform hover:-translate-y-3 hover:shadow-white/10 border border-gray-800 hover:border-gray-700">
            <div className="aspect-square bg-gradient-to-br from-gray-900 via-gray-800 to-black p-10 flex flex-col justify-end relative">
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
          <Link href="/products" className="group relative overflow-hidden rounded-3xl shadow-2xl transition-all transform hover:-translate-y-3 hover:shadow-white/10 border border-gray-800 hover:border-gray-700">
            <div className="aspect-square bg-gradient-to-br from-gray-900 via-gray-800 to-black p-10 flex flex-col justify-end relative">
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
          <Link href="/products" className="group relative overflow-hidden rounded-3xl shadow-2xl transition-all transform hover:-translate-y-3 hover:shadow-white/10 border border-gray-800 hover:border-gray-700">
            <div className="aspect-square bg-gradient-to-br from-gray-900 via-gray-800 to-black p-10 flex flex-col justify-end relative">
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
          <Link href="/products" className="group relative overflow-hidden rounded-3xl shadow-2xl transition-all transform hover:-translate-y-3 hover:shadow-white/10 border border-gray-800 hover:border-gray-700">
            <div className="aspect-square bg-gradient-to-br from-gray-900 via-gray-800 to-black p-10 flex flex-col justify-end relative">
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
          <Link href="/products" className="group relative overflow-hidden rounded-3xl shadow-2xl transition-all transform hover:-translate-y-3 hover:shadow-white/10 border border-gray-800 hover:border-gray-700">
            <div className="aspect-square bg-gradient-to-br from-gray-900 via-gray-800 to-black p-10 flex flex-col justify-end relative">
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
      <div className="relative py-24 border-y border-gray-800/50">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group text-center p-8 bg-gradient-to-b from-gray-900/80 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-white/20 transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-white/10">
                <span className="text-4xl">🚚</span>
              </div>
              <h3 className="text-xl font-black mb-3 text-white">Free Shipping</h3>
              <p className="text-gray-400 text-sm leading-relaxed">On orders over $50 worldwide</p>
            </div>

            <div className="group text-center p-8 bg-gradient-to-b from-gray-900/80 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-white/20 transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-white/10">
                <span className="text-4xl">✨</span>
              </div>
              <h3 className="text-xl font-black mb-3 text-white">Premium Quality</h3>
              <p className="text-gray-400 text-sm leading-relaxed">100% authentic brands guaranteed</p>
            </div>

            <div className="group text-center p-8 bg-gradient-to-b from-gray-900/80 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-white/20 transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-white/10">
                <span className="text-4xl">🔄</span>
              </div>
              <h3 className="text-xl font-black mb-3 text-white">Easy Returns</h3>
              <p className="text-gray-400 text-sm leading-relaxed">30-day hassle-free returns</p>
            </div>

            <div className="group text-center p-8 bg-gradient-to-b from-gray-900/80 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-white/20 transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-white/10">
                <span className="text-4xl">💳</span>
              </div>
              <h3 className="text-xl font-black mb-3 text-white">Secure Payment</h3>
              <p className="text-gray-400 text-sm leading-relaxed">SSL encrypted checkout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-3xl blur-3xl"></div>

            {/* Content Card */}
            <div className="relative bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-12 md:p-16 border border-gray-700/50 shadow-2xl">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -z-10"></div>

              <div className="mb-6">
                <span className="text-5xl inline-block animate-bounce">🎯</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                Ready to Find Your
                <span className="block bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  Perfect Style?
                </span>
              </h2>

              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Browse our complete collection of premium hats and caps for every occasion. From streetwear to sophisticated elegance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/products"
                  className="group relative bg-white text-black px-12 py-5 rounded-full font-black text-lg transition-all transform hover:scale-110 shadow-2xl hover:shadow-white/50 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Shopping
                    <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>

                <Link
                  href="/products"
                  className="text-gray-400 hover:text-white font-semibold transition-colors underline underline-offset-4"
                >
                  View All Collections
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
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