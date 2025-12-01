'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as apiModule from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/lib/toast';

const api = apiModule.default;

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

export default function ProductCard({ product }: { product: Product }) {
  const { user } = useAuthStore();

  const addToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await api.post('/cart/items', {
        productId: product.id,
        quantity: 1,
      });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <div
        className="group rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 relative h-full flex flex-col cursor-pointer"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
        }}
      >
        <div className="border rounded-2xl h-full flex flex-col" style={{ borderColor: 'var(--card-border)' }}>
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-transparent transition-all duration-500 pointer-events-none z-10 rounded-2xl"></div>

          <div
            className="relative h-64 overflow-hidden"
            style={{ backgroundColor: 'var(--input-bg)' }}
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute top-3 right-3">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                {product.category.name}
              </span>
            </div>
            {product.stock < 10 && product.stock > 0 && (
              <div className="absolute top-3 left-3">
                <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  Only {product.stock} left!
                </span>
              </div>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <h3
              className="text-xl font-bold group-hover:opacity-70 transition-colors line-clamp-1 mb-2"
              style={{ color: 'var(--foreground)' }}
            >
              {product.name}
            </h3>
            <p
              className="text-sm line-clamp-2 leading-relaxed flex-1 opacity-70"
              style={{ color: 'var(--foreground)' }}
            >
              {product.description}
            </p>
            <div
              className="flex items-center justify-between mt-6 pt-4 border-t"
              style={{ borderTopColor: 'var(--card-border)' }}
            >
              <div>
                <span
                  className="text-3xl font-black"
                  style={{ color: 'var(--foreground)' }}
                >
                  ${product.price.toFixed(2)}
                </span>
                <p
                  className="text-xs mt-1 opacity-60"
                  style={{ color: 'var(--foreground)' }}
                >
                  ✓ {product.stock} in stock
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart();
                }}
                disabled={product.stock === 0}
                style={{
                  backgroundColor: product.stock === 0 ? 'var(--button-hover)' : 'var(--nav-bg)',
                  color: product.stock === 0 ? 'var(--nav-text)' : 'var(--foreground)',
                }}
                className="px-6 py-3 rounded-full font-bold text-sm disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {product.stock === 0 ? '❌ Sold Out' : '🛒 Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

