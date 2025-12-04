'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { useThemeStore } from '@/store/themeStore';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
}

export default function ProductsPage() {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'popular'>('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [pageSize] = useState(10); // Products per page
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle scroll to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Handle page changes with smooth transition
  const handlePageChange = (newPage: number) => {
    setIsTransitioning(true);
    // Scroll to products section smoothly
    window.scrollTo({
      top: 200,
      behavior: 'smooth',
    });
    // Update page after transition starts
    setTimeout(() => {
      setCurrentPage(newPage);
    }, 200);
    // End transition after content updates
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  // Debounced search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchTerm]);

  // Fetch products when filters change
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    handleApplyFilters();
  }, [debouncedSearch, selectedCategory, sortBy]);

  // Handle page changes
  useEffect(() => {
    handleApplyFilters();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setError(null);
      const response = await api.get('/products');
      setProducts(response.data);
      setTotalProducts(response.data.length);
    } catch (error) {
      console.error('Failed to fetch products', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const handleApplyFilters = async () => {
    setLoading(true);
    setError(null);
    try {
      let allProducts: Product[] = [];

      // Apply search filter
      if (debouncedSearch.trim()) {
        const response = await api.get(`/products/search?keyword=${debouncedSearch}`);
        allProducts = Array.isArray(response.data) ? response.data : [];
      } else if (selectedCategory) {
        const response = await api.get(`/products/category/${selectedCategory}`);
        allProducts = Array.isArray(response.data) ? response.data : [];
      } else {
        const response = await api.get(`/products`);
        allProducts = Array.isArray(response.data) ? response.data : [];
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-asc':
          allProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          allProducts.sort((a, b) => b.price - a.price);
          break;
        case 'popular':
          allProducts.sort((a, b) => b.stock - a.stock);
          break;
        case 'newest':
        default:
          break;
      }

      // Set total products
      setTotalProducts(allProducts.length);

      // Paginate results
      const offset = (currentPage - 1) * pageSize;
      const paginatedProducts = allProducts.slice(offset, offset + pageSize);

      setProducts(paginatedProducts);
    } catch (error) {
      console.error('Failed to apply filters', error);
      setError('Failed to load products. Please check your connection and try again.');
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedCategory(null);
    setSortBy('newest');
    setCurrentPage(1);
    setError(null);
  };

  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        backgroundColor: 'var(--background)',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Hero Section */}
      <div
        className="relative text-white py-20 overflow-hidden border-b"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderBottomColor: 'var(--card-border)',
          backgroundImage: isDark
            ? 'linear-gradient(to bottom right, #111827, #0a0a0a)'
            : 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)',
        }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-20 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-50"
            style={{
              background: 'var(--foreground)',
              opacity: 0.1,
            }}
          ></div>
          <div
            className="absolute bottom-10 right-1/3 w-96 h-96 rounded-full blur-3xl opacity-50"
            style={{
              background: 'var(--foreground)',
              opacity: 0.1,
            }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full blur-2xl opacity-30 animate-pulse"
            style={{
              background: 'var(--foreground)',
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center space-y-6 mb-12">
            <div className="inline-block">
              <div className="text-7xl md:text-8xl animate-bounce">🧢</div>
            </div>
            <div>
              <h1
                className="text-6xl md:text-7xl font-black mb-4"
                style={{ color: 'var(--foreground)' }}
              >
                Premium Collection
              </h1>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div
                  className="h-1 w-16"
                  style={{
                    background: 'var(--foreground)',
                    opacity: 0.2,
                  }}
                ></div>
                <p
                  className="text-lg font-semibold"
                  style={{
                    color: 'var(--foreground)',
                    opacity: 0.7,
                  }}
                >
                  Curated for Style
                </p>
                <div
                  className="h-1 w-16"
                  style={{
                    background: 'var(--foreground)',
                    opacity: 0.2,
                  }}
                ></div>
              </div>
            </div>
            <p
              className="text-xl max-w-3xl mx-auto leading-relaxed font-light"
              style={{
                color: 'var(--foreground)',
                opacity: 0.6,
              }}
            >
              Discover our handpicked collection of premium hats and caps. From classic styles to modern designs, find the perfect hat for every occasion.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="space-y-6">
            {/* Search Input */}
            <div className="flex gap-3 justify-center max-w-2xl mx-auto">
              <div className="relative flex-1">
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    color: 'var(--foreground)',
                    opacity: 0.5,
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search for hats, styles, brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    borderColor: 'var(--input-border)',
                    color: 'var(--foreground)',
                  }}
                  className="w-full pl-12 pr-6 py-4 backdrop-blur border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent shadow-xl text-base placeholder-opacity-50 transition-all hover:opacity-90"
                />
              </div>
              <button
                onClick={handleResetFilters}
                title="Reset filters"
                className="px-6 py-4 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--card-border)',
                  color: 'var(--foreground)',
                }}
              >
                ↻ Reset
              </button>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center flex-wrap">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    borderColor: 'var(--input-border)',
                    color: 'var(--foreground)',
                  }}
                  className="px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                >
                  <option value="newest">🆕 Newest</option>
                  <option value="price-asc">💰 Price: Low to High</option>
                  <option value="price-desc">💸 Price: High to Low</option>
                  <option value="popular">⭐ Most Popular</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div
                className="flex items-center gap-2 pl-4"
                style={{
                  borderLeftColor: 'var(--card-border)',
                  borderLeftWidth: '1px',
                }}
              >
                <span className="text-sm font-semibold" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                  View:
                </span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'shadow-lg'
                      : ''
                  }`}
                  style={{
                    backgroundColor: viewMode === 'grid' ? 'var(--foreground)' : 'var(--card-bg)',
                    color: viewMode === 'grid' ? 'var(--background)' : 'var(--foreground)',
                    border: `1px solid var(--card-border)`,
                  }}
                >
                  ⊞ Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'shadow-lg'
                      : ''
                  }`}
                  style={{
                    backgroundColor: viewMode === 'list' ? 'var(--foreground)' : 'var(--card-bg)',
                    color: viewMode === 'list' ? 'var(--background)' : 'var(--foreground)',
                    border: `1px solid var(--card-border)`,
                  }}
                >
                  ≡ List
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-3 flex-wrap justify-center mt-8">
            <button
              onClick={() => handleCategoryFilter(null)}
              className={`px-6 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 border-2 ${
                selectedCategory === null
                  ? ''
                  : ''
              }`}
              style={{
                backgroundColor:
                  selectedCategory === null
                    ? 'var(--foreground)'
                    : 'rgba(0, 0, 0, 0.1)',
                color:
                  selectedCategory === null
                    ? 'var(--background)'
                    : 'var(--foreground)',
                borderColor:
                  selectedCategory === null
                    ? 'var(--foreground)'
                    : 'var(--card-border)',
              }}
            >
              ✨ All Products
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 border-2`}
                style={{
                  backgroundColor:
                    selectedCategory === category.id
                      ? 'var(--foreground)'
                      : 'rgba(0, 0, 0, 0.1)',
                  color:
                    selectedCategory === category.id
                      ? 'var(--background)'
                      : 'var(--foreground)',
                  borderColor:
                    selectedCategory === category.id
                      ? 'var(--foreground)'
                      : 'var(--card-border)',
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Info Bar */}
      {!loading && (
        <div
          className="border-b py-4 sticky top-0 z-40"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderBottomColor: 'var(--card-border)',
          }}
        >
          <div className="container mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
            <div>
              {products.length > 0 ? (
                <p style={{ color: 'var(--foreground)' }}>
                  Showing <span className="font-black text-lg">{(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalProducts)}</span>
                  <span style={{ opacity: 0.6 }}> of </span>
                  <span className="font-black text-lg">{totalProducts}</span>
                  <span style={{ opacity: 0.6 }}> {totalProducts === 1 ? 'product' : 'products'}</span>
                  {selectedCategory && <span style={{ opacity: 0.6 }}> in selected category</span>}
                  {debouncedSearch && <span style={{ opacity: 0.6 }}> matching "{debouncedSearch}"</span>}
                </p>
              ) : (
                <p style={{ color: 'var(--foreground)', opacity: 0.6 }}>No products found</p>
              )}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                  Page
                </span>
                <span className="font-black" style={{ color: 'var(--foreground)' }}>
                  {currentPage}
                </span>
                <span className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                  of
                </span>
                <span className="font-black" style={{ color: 'var(--foreground)' }}>
                  {totalPages}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {error && (
          <div
            className="mb-8 p-6 rounded-2xl border-2 text-center"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
            }}
          >
            <p className="text-lg font-bold mb-2">⚠️ Error Loading Products</p>
            <p className="opacity-80">{error}</p>
            <button
              onClick={() => {
                setError(null);
                handleApplyFilters();
              }}
              className="mt-4 px-6 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
              }}
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative w-20 h-20">
              <div
                className="absolute inset-0 rounded-full animate-spin opacity-30"
                style={{
                  background: `linear-gradient(to right, var(--foreground), transparent)`,
                }}
              ></div>
              <div className="absolute inset-2 flex items-center justify-center text-4xl">🧢</div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                Curating Premium Hats
              </p>
              <p style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                Please wait while we load our collection...
              </p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-8">
            <div className="text-8xl">😢</div>
            <div className="text-center max-w-md">
              <h2 className="text-3xl font-black mb-3" style={{ color: 'var(--foreground)' }}>
                No Products Found
              </h2>
              <p className="mb-8 leading-relaxed" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                We couldn't find any products matching your search or filters. Try adjusting your criteria or explore our full collection.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg"
                style={{
                  backgroundColor: 'var(--foreground)',
                  color: 'var(--background)',
                }}
              >
                View All Products
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 transition-opacity duration-500"
            style={{ opacity: isTransitioning ? 0.5 : 1 }}
          >
            {products.map((product, index) => (
              <div key={product.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in-up">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="space-y-4 max-w-4xl mx-auto transition-opacity duration-500"
            style={{ opacity: isTransitioning ? 0.5 : 1 }}
          >
            {products.map((product, index) => (
              <Link
                href={`/products/${product.id}`}
                key={product.id}
                className="block"
              >
                <div
                  style={{
                    animationDelay: `${index * 50}ms`,
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--card-border)',
                  }}
                  className="animate-fade-in-up relative group border rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-transparent transition-all duration-500"></div>
                  <div className="relative z-10 flex gap-6 items-start">
                    <div className="flex-1">
                      <div
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
                        style={{
                          backgroundColor: 'var(--button-hover)',
                          color: 'var(--foreground)',
                        }}
                      >
                        {product.category.name}
                      </div>
                      <h3 className="text-2xl font-black mb-2 group-hover:opacity-80 transition-opacity" style={{ color: 'var(--foreground)' }}>
                        {product.name}
                      </h3>
                      <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                        {product.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="text-3xl font-black" style={{ color: 'var(--foreground)' }}>
                          ${product.price.toFixed(2)}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            product.stock > 0
                              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                              : 'bg-red-500/20 text-red-400 border border-red-500/50'
                          }`}
                        >
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                    </div>
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">🧢</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-center gap-4 mt-16 py-8 border-t"
            style={{ borderTopColor: 'var(--card-border)' }}
          >
            <button
              onClick={() => {
                if (currentPage > 1) {
                  handlePageChange(currentPage - 1);
                }
              }}
              disabled={currentPage <= 1}
              className="px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 border"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                color: 'var(--foreground)',
              }}
            >
              ← Previous
            </button>

            {/* Page Number Buttons */}
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all transform hover:scale-110`}
                    style={{
                      backgroundColor:
                        currentPage === pageNum
                          ? 'var(--foreground)'
                          : 'var(--card-bg)',
                      color:
                        currentPage === pageNum
                          ? 'var(--background)'
                          : 'var(--foreground)',
                      border: `1px solid var(--card-border)`,
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                if (currentPage < totalPages) {
                  handlePageChange(currentPage + 1);
                }
              }}
              disabled={currentPage >= totalPages}
              className="px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 border"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                color: 'var(--foreground)',
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 animate-fade-in-up"
          style={{
            backgroundColor: 'var(--foreground)',
            color: 'var(--background)',
          }}
          title="Back to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
}