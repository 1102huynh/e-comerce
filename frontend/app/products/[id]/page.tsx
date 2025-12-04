'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import * as apiModule from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { toast } from '@/lib/toast';

const api = apiModule.default;

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  images?: string; // comma-separated string from backend
  category: {
    id: number;
    name: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  // gallery state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  useEffect(() => {
    // Reset gallery index when product changes
    setCurrentImageIndex(0);
  }, [product?.id]);

  useEffect(() => {
    // keyboard navigation for gallery
    const onKey = (e: KeyboardEvent) => {
      if (!product) return;
      const galleryImages = getGalleryImages();
      if (galleryImages.length <= 1) return;
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, currentImageIndex]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${params.id}`);
      setProduct(response.data);
      // Fetch related products (same category)
      if (response.data.category) {
        const relatedResponse = await api.get(`/products/category/${response.data.category.id}`);
        setRelatedProducts(relatedResponse.data.filter((p: Product) => p.id !== response.data.id).slice(0, 4));
      }
    } catch (error) {
      toast.error('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }

    setAddingToCart(true);
    try {
      const response = await api.post('/cart/items', {
        productId: product?.id,
        quantity,
      });

      // Update local cart store immediately for UI feedback
      if (product) {
        addItem({
          id: response.data.id || Math.random(),
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
          },
          quantity,
        });
      }

      toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart!`);
      setQuantity(1);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const getGalleryImages = (): string[] => {
    if (!product) return [];
    // Parse comma-separated images from backend, fallback to imageUrl
    if (product.images && product.images.trim()) {
      return product.images.split(',').map(img => img.trim());
    }
    return [product.imageUrl];
  };

  const prevImage = () => {
    const galleryImages = getGalleryImages();
    if (galleryImages.length === 0) return;
    setCurrentImageIndex((idx) => (idx - 1 + galleryImages.length) % galleryImages.length);
  };

  const nextImage = () => {
    const galleryImages = getGalleryImages();
    if (galleryImages.length === 0) return;
    setCurrentImageIndex((idx) => (idx + 1) % galleryImages.length);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--background)' }}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent rounded-full animate-spin opacity-30"></div>
            <div className="absolute inset-2 flex items-center justify-center text-4xl">🧢</div>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Loading Product Details</p>
            <p style={{ color: 'var(--foreground)', opacity: 0.6 }}>Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--background)' }}
      >
        <div className="text-center">
          <div className="text-8xl mb-6">😢</div>
          <h1 className="text-3xl font-black mb-4" style={{ color: 'var(--foreground)' }}>Product Not Found</h1>
          <p className="mb-8" style={{ color: 'var(--foreground)', opacity: 0.6 }}>The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/products" style={{
            backgroundColor: 'var(--nav-bg)',
            color: 'var(--nav-text)',
          }} className="inline-block px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--background)' }} className="min-h-screen">
      {/* Breadcrumb Navigation */}
      <div
        className="border-b py-4 sticky top-0 z-30 backdrop-blur"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderBottomColor: 'var(--card-border)',
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              style={{ color: 'var(--foreground)', opacity: 0.6 }}
              className="hover:opacity-100 transition-colors"
            >
              Home
            </Link>
            <span style={{ color: 'var(--foreground)', opacity: 0.4 }}>/</span>
            <Link
              href="/products"
              style={{ color: 'var(--foreground)', opacity: 0.6 }}
              className="hover:opacity-100 transition-colors"
            >
              Products
            </Link>
            <span style={{ color: 'var(--foreground)', opacity: 0.4 }}>/</span>
            <span style={{ color: 'var(--foreground)' }} className="font-semibold truncate">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Product Image Section */}
          <div className="flex flex-col gap-6">
            <div
              className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden border-2 transition-all group"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
              }}
            >
              {/* Image glow effect */}
              <div
                className="absolute inset-0 z-10"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)',
                }}
              ></div>

              {/* Main gallery image */}
              <Image
                src={getGalleryImages()[currentImageIndex] || product.imageUrl}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                priority
              />

              {/* left / right controls */}
              {getGalleryImages().length > 1 && (
                <>
                  <button
                    aria-label="Previous image"
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all hover:scale-110"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    ‹
                  </button>
                  <button
                    aria-label="Next image"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all hover:scale-110"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    ›
                  </button>
                  {/* indicator dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
                    {getGalleryImages().map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImageIndex(i)}
                        aria-label={`View image ${i + 1}`}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          i === currentImageIndex ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Decorative corner elements */}
              <div
                className="absolute top-0 right-0 w-40 h-40 z-20 rounded-bl-3xl pointer-events-none"
                style={{
                  backgroundColor: 'var(--foreground)',
                  opacity: 0.05,
                }}
              ></div>
              <div
                className="absolute bottom-0 left-0 w-32 h-32 z-20 rounded-tr-3xl pointer-events-none"
                style={{
                  backgroundColor: 'var(--foreground)',
                  opacity: 0.03,
                }}
              ></div>
            </div>

            {/* Thumbnail strip */}
            {getGalleryImages().length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto py-2 px-1">
                {getGalleryImages().map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-3 transition-all hover:scale-105 ${
                      idx === currentImageIndex ? 'border-4 shadow-lg' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: idx === currentImageIndex ? 'var(--nav-bg)' : 'var(--card-border)',
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col space-y-8">
            {/* Category & Status */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span
                  style={{
                    backgroundColor: 'var(--nav-bg)',
                    color: 'var(--nav-text)',
                  }}
                  className="inline-block px-6 py-2 rounded-full text-sm font-black shadow-lg"
                >
                  {product.category.name}
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  product.stock > 5
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : product.stock > 0
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                    : 'bg-red-500/20 text-red-400 border border-red-500/50'
                }`}>
                  {product.stock > 5 ? '✓ In Stock' : product.stock > 0 ? `⚠ Only ${product.stock} left` : '✕ Out of Stock'}
                </span>
              </div>
            </div>

            {/* Product Title */}
            <div>
              <h1
                className="text-5xl md:text-6xl font-black mb-4 leading-tight"
                style={{ color: 'var(--foreground)' }}
              >
                {product.name}
              </h1>
              <div
                className="h-1 w-24"
                style={{
                  backgroundColor: 'var(--foreground)',
                  opacity: 0.3,
                }}
              ></div>
            </div>

            {/* Description */}
            <div
              className="py-6 border-t border-b"
              style={{
                borderColor: 'var(--card-border)',
              }}
            >
              <p
                className="text-lg leading-relaxed"
                style={{
                  color: 'var(--foreground)',
                  opacity: 0.7,
                }}
              >
                {product.description}
              </p>
            </div>

            {/* Price Section */}
            <div
              className="p-8 rounded-3xl border-2 backdrop-blur transition-all"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
              }}
            >
              <div className="space-y-2 mb-6">
                <p
                  className="text-sm font-semibold"
                  style={{
                    color: 'var(--foreground)',
                    opacity: 0.6,
                  }}
                >
                  Price
                </p>
                <div className="flex items-baseline gap-3">
                  <span
                    className="text-6xl font-black"
                    style={{ color: 'var(--foreground)' }}
                  >
                    ${product.price.toFixed(2)}
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      color: 'var(--foreground)',
                      opacity: 0.4,
                    }}
                  >
                    USD
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-400">
                <span className="text-lg">✓</span>
                <span>Free shipping on orders over $50</span>
              </div>
            </div>

            {/* Stock & Quantity */}
            <div
              className="p-8 rounded-3xl border-2 backdrop-blur transition-all"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
              }}
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="text-2xl">📦</span>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{
                      color: 'var(--foreground)',
                      opacity: 0.6,
                    }}
                  >
                    Available Stock
                  </p>
                  <p
                    className="text-3xl font-black"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {product.stock}
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label
                  className="block text-sm font-bold mb-3 uppercase tracking-wide"
                  style={{ color: 'var(--foreground)' }}
                >
                  Select Quantity
                </label>
                <div className="flex items-center gap-4 mb-8">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    style={{
                      backgroundColor: 'var(--button-hover)',
                      color: 'var(--foreground)',
                    }}
                    className="w-12 h-12 disabled:cursor-not-allowed rounded-lg font-bold transition-all text-xl opacity-70 hover:opacity-100 disabled:opacity-50"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.min(Math.max(val, 1), product.stock));
                    }}
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--foreground)',
                    }}
                    className="flex-1 px-4 py-3 border-2 text-center rounded-lg focus:outline-none focus:ring-2 font-bold text-lg"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    style={{
                      backgroundColor: 'var(--button-hover)',
                      color: 'var(--foreground)',
                    }}
                    className="w-12 h-12 disabled:cursor-not-allowed rounded-lg font-bold transition-all text-xl opacity-70 hover:opacity-100 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={addToCart}
                  disabled={product.stock === 0 || addingToCart}
                  style={{
                    backgroundColor: product.stock === 0 || addingToCart ? 'var(--button-hover)' : 'var(--nav-bg)',
                    color: product.stock === 0 || addingToCart ? 'var(--foreground)' : 'var(--nav-text)',
                  }}
                  className="w-full py-5 rounded-xl font-black text-lg disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl active:scale-95"
                >
                  {addingToCart ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span> Adding to Cart...
                    </span>
                  ) : product.stock === 0 ? (
                    <span>❌ Out of Stock</span>
                  ) : (
                    <span>🛒 Add {quantity} to Cart</span>
                  )}
                </button>
              </div>
            </div>

            {/* Product Features */}
            <div
              className="p-6 rounded-2xl border"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
              }}
            >
              <h3
                className="text-sm font-black uppercase tracking-wide mb-4"
                style={{ color: 'var(--foreground)' }}
              >
                Why Choose This Product
              </h3>
              <ul className="space-y-3">
                <li
                  className="flex items-center gap-3"
                  style={{ color: 'var(--foreground)', opacity: 0.7 }}
                >
                  <span className="text-lg">⭐</span> Premium Quality Materials
                </li>
                <li
                  className="flex items-center gap-3"
                  style={{ color: 'var(--foreground)', opacity: 0.7 }}
                >
                  <span className="text-lg">🚚</span> Fast & Free Shipping
                </li>
                <li
                  className="flex items-center gap-3"
                  style={{ color: 'var(--foreground)', opacity: 0.7 }}
                >
                  <span className="text-lg">🔄</span> Easy 30-Day Returns
                </li>
                <li
                  className="flex items-center gap-3"
                  style={{ color: 'var(--foreground)', opacity: 0.7 }}
                >
                  <span className="text-lg">🛡️</span> Secure Checkout
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div
            className="border-t pt-16"
            style={{ borderTopColor: 'var(--card-border)' }}
          >
            <div className="mb-12">
              <h2
                className="text-4xl font-black mb-2"
                style={{ color: 'var(--foreground)' }}
              >
                Related Products
              </h2>
              <p
                style={{
                  color: 'var(--foreground)',
                  opacity: 0.6,
                }}
              >
                Explore more items from {product.category.name}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relProduct) => (
                <Link key={relProduct.id} href={`/products/${relProduct.id}`}>
                  <div
                    className="group relative border-2 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      borderColor: 'var(--card-border)',
                    }}
                  >
                    <div
                      className="relative h-48 overflow-hidden"
                      style={{ backgroundColor: 'var(--input-bg)' }}
                    >
                      <Image
                        src={relProduct.imageUrl}
                        alt={relProduct.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3
                        className="text-lg font-bold mb-2 line-clamp-2 group-hover:opacity-80"
                        style={{ color: 'var(--foreground)' }}
                      >
                        {relProduct.name}
                      </h3>
                      <p className="flex justify-between items-center">
                        <span
                          className="text-2xl font-black"
                          style={{ color: 'var(--foreground)' }}
                        >
                          ${relProduct.price.toFixed(2)}
                        </span>
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--button-hover)',
                            color: 'var(--foreground)',
                          }}
                        >
                          {relProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

