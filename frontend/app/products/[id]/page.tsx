'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

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
      await api.post('/cart/items', {
        productId: product?.id,
        quantity,
      });
      toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart!`);
      setQuantity(1);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent rounded-full animate-spin opacity-30"></div>
            <div className="absolute inset-2 flex items-center justify-center text-4xl">🧢</div>
          </div>
          <div className="text-center">
            <p className="text-xl text-white font-bold">Loading Product Details</p>
            <p className="text-gray-400">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">😢</div>
          <h1 className="text-3xl font-black text-white mb-4">Product Not Found</h1>
          <p className="text-gray-400 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/products" className="inline-block bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-950/50 border-b border-gray-800 py-4 sticky top-0 z-30 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
            <span className="text-gray-600">/</span>
            <Link href="/products" className="text-gray-400 hover:text-white transition-colors">Products</Link>
            <span className="text-gray-600">/</span>
            <span className="text-white font-semibold truncate">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Product Image Section */}
          <div className="flex flex-col gap-6">
            <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden border-2 border-gray-700 hover:border-gray-600 transition-all group">
              {/* Image glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                priority
              />
              {/* Decorative corner elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-white/10 to-transparent z-20 rounded-bl-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/5 to-transparent z-20 rounded-tr-3xl"></div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col space-y-8">
            {/* Category & Status */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-block bg-gradient-to-r from-white to-gray-200 text-black px-6 py-2 rounded-full text-sm font-black shadow-lg">
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
              <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
                {product.name}
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-white to-transparent"></div>
            </div>

            {/* Description */}
            <div className="py-6 border-t border-b border-gray-800">
              <p className="text-gray-300 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price Section */}
            <div className="p-8 bg-gradient-to-br from-gray-900/80 to-gray-800/50 rounded-3xl border-2 border-gray-700 hover:border-gray-600 transition-all backdrop-blur">
              <div className="space-y-2 mb-6">
                <p className="text-gray-400 text-sm font-semibold">Price</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-black text-white">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">USD</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-400">
                <span className="text-lg">✓</span>
                <span>Free shipping on orders over $50</span>
              </div>
            </div>

            {/* Stock & Quantity */}
            <div className="p-8 bg-gradient-to-br from-gray-900/80 to-gray-800/50 rounded-3xl border-2 border-gray-700 hover:border-gray-600 transition-all backdrop-blur">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-2xl">📦</span>
                <div>
                  <p className="text-gray-400 text-sm font-semibold">Available Stock</p>
                  <p className="text-3xl font-black text-white">{product.stock}</p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">Select Quantity</label>
                <div className="flex items-center gap-4 mb-8">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-12 h-12 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-all text-xl"
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
                    className="flex-1 px-4 py-3 bg-gray-800 border-2 border-gray-700 text-white text-center rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent font-bold text-lg"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-12 h-12 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-all text-xl"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={addToCart}
                  disabled={product.stock === 0 || addingToCart}
                  className="w-full bg-gradient-to-r from-white to-gray-100 text-black py-5 rounded-xl font-black text-lg hover:from-gray-200 hover:to-white disabled:from-gray-700 disabled:to-gray-600 disabled:text-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl active:scale-95"
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
            <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
              <h3 className="text-sm font-black text-white uppercase tracking-wide mb-4">Why Choose This Product</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-lg">⭐</span> Premium Quality Materials
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-lg">🚚</span> Fast & Free Shipping
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-lg">🔄</span> Easy 30-Day Returns
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-lg">🛡️</span> Secure Checkout
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-800 pt-16">
            <div className="mb-12">
              <h2 className="text-4xl font-black text-white mb-2">Related Products</h2>
              <p className="text-gray-400">Explore more items from {product.category.name}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relProduct) => (
                <Link key={relProduct.id} href={`/products/${relProduct.id}`}>
                  <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 hover:border-gray-600 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-white/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                    <div className="relative h-48 overflow-hidden bg-gray-800">
                      <Image
                        src={relProduct.imageUrl}
                        alt={relProduct.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-gray-200">
                        {relProduct.name}
                      </h3>
                      <p className="flex justify-between items-center">
                        <span className="text-2xl font-black text-white">${relProduct.price.toFixed(2)}</span>
                        <span className="text-xs font-bold bg-gray-800 text-gray-300 px-3 py-1 rounded-full">
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

