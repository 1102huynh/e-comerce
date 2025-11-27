'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'popular'>('newest');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [pageSize] = useState(12); // Products per page
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

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
    if (currentPage > 1) {
      handleApplyFilters();
    }
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
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
    try {
      const offset = (currentPage - 1) * pageSize;
      let filteredProducts: Product[];
      let total: number;

      // Apply search filter
      if (debouncedSearch.trim()) {
        const response = await api.get(`/products/search?keyword=${debouncedSearch}&limit=${pageSize}&offset=${offset}`);
        filteredProducts = Array.isArray(response.data) ? response.data : response.data.items || [];
        total = response.data.total || filteredProducts.length;
      } else if (selectedCategory) {
        const response = await api.get(`/products/category/${selectedCategory}?limit=${pageSize}&offset=${offset}`);
        filteredProducts = Array.isArray(response.data) ? response.data : response.data.items || [];
        total = response.data.total || filteredProducts.length;
      } else {
        const response = await api.get(`/products?limit=${pageSize}&offset=${offset}`);
        filteredProducts = Array.isArray(response.data) ? response.data : response.data.items || [];
        total = response.data.total || filteredProducts.length;
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'popular':
          filteredProducts.sort((a, b) => b.stock - a.stock);
          break;
        case 'newest':
        default:
          break;
      }

      setProducts(filteredProducts);
      setTotalProducts(total);
    } catch (error) {
      console.error('Failed to apply filters', error);
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
    fetchProducts();
  };

  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white py-20 border-b border-gray-800 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-80 h-80 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-gradient-to-tl from-white/10 to-transparent rounded-full blur-3xl opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-30 animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center space-y-6 mb-12">
            <div className="inline-block">
              <div className="text-7xl md:text-8xl animate-bounce">🧢</div>
            </div>
            <div>
              <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent mb-4">
                Premium Collection
              </h1>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-1 w-16 bg-gradient-to-r from-white/30 to-transparent"></div>
                <p className="text-lg text-gray-300 font-semibold">Curated for Style</p>
                <div className="h-1 w-16 bg-gradient-to-l from-white/30 to-transparent"></div>
              </div>
            </div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
              Discover our handpicked collection of premium hats and caps. From classic styles to modern designs, find the perfect hat for every occasion.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="space-y-6">
            {/* Search Input */}
            <div className="flex gap-3 justify-center max-w-2xl mx-auto">
              <div className="relative flex-1">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search for hats, styles, brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-gray-900/80 backdrop-blur border-2 border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent shadow-xl text-base placeholder-gray-500 transition-all hover:border-gray-600"
                />
              </div>
              <button
                onClick={handleResetFilters}
                title="Reset filters"
                className="px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-gray-700 hover:border-gray-600"
              >
                ↻ Reset
              </button>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center flex-wrap">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-4 py-2 bg-gray-900 border-2 border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white hover:border-gray-600 transition-all"
                >
                  <option value="newest">🆕 Newest</option>
                  <option value="price-asc">💰 Price: Low to High</option>
                  <option value="price-desc">💸 Price: High to Low</option>
                  <option value="popular">⭐ Most Popular</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 border-l border-gray-700 pl-4">
                <span className="text-sm font-semibold text-gray-400">View:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-black shadow-lg'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  ⊞ Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-black shadow-lg'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
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
                  ? 'bg-gradient-to-r from-white to-gray-100 text-black border-white'
                  : 'bg-gray-800/50 backdrop-blur text-white hover:bg-gray-700/50 border-gray-600 hover:border-gray-500'
              }`}
            >
              ✨ All Products
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 border-2 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-white to-gray-100 text-black border-white'
                    : 'bg-gray-800/50 backdrop-blur text-white hover:bg-gray-700/50 border-gray-600 hover:border-gray-500'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Info Bar */}
      {!loading && (
        <div className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 py-4 sticky top-0 z-40">
          <div className="container mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
            <div>
              {products.length > 0 ? (
                <p className="text-gray-300">
                  Showing <span className="font-black text-white text-lg">{(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalProducts)}</span>
                  <span className="text-gray-400"> of </span>
                  <span className="font-black text-white text-lg">{totalProducts}</span>
                  <span className="text-gray-400"> {totalProducts === 1 ? 'product' : 'products'}</span>
                  {selectedCategory && <span className="text-gray-400"> in selected category</span>}
                  {debouncedSearch && <span className="text-gray-400"> matching "{debouncedSearch}"</span>}
                </p>
              ) : (
                <p className="text-gray-400">No products found</p>
              )}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Page</span>
                <span className="text-white font-black">{currentPage}</span>
                <span className="text-sm text-gray-400">of</span>
                <span className="text-white font-black">{totalPages}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent rounded-full animate-spin opacity-30"></div>
              <div className="absolute inset-2 flex items-center justify-center text-4xl">🧢</div>
            </div>
            <div className="text-center">
              <p className="text-2xl text-white font-bold mb-2">Curating Premium Hats</p>
              <p className="text-gray-400">Please wait while we load our collection...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-8">
            <div className="text-8xl">😢</div>
            <div className="text-center max-w-md">
              <h2 className="text-3xl font-black text-white mb-3">No Products Found</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                We couldn't find any products matching your search or filters. Try adjusting your criteria or explore our full collection.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg"
              >
                View All Products
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div key={product.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in-up">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {products.map((product, index) => (
              <Link
                href={`/products/${product.id}`}
                key={product.id}
                className="block"
              >
                <div
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="animate-fade-in-up relative group bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-gray-600 hover:shadow-2xl hover:shadow-white/10 transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-transparent transition-all duration-500"></div>
                  <div className="relative z-10 flex gap-6 items-start">
                    <div className="flex-1">
                      <div className="inline-block bg-white/10 text-white px-3 py-1 rounded-full text-xs font-bold mb-3">
                        {product.category.name}
                      </div>
                      <h3 className="text-2xl font-black text-white mb-2 group-hover:text-gray-100 transition-colors">{product.name}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-3xl font-black text-white">${product.price.toFixed(2)}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          product.stock > 0
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                            : 'bg-red-500/20 text-red-400 border border-red-500/50'
                        }`}>
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
          <div className="flex items-center justify-center gap-4 mt-16 py-8 border-t border-gray-800">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50"
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
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all transform hover:scale-110 ${
                      currentPage === pageNum
                        ? 'bg-white text-black shadow-lg'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}