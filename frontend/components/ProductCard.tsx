'use client';

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
      <div className="group bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-3 border border-gray-800 hover:border-gray-600 relative h-full flex flex-col cursor-pointer">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-transparent transition-all duration-500 pointer-events-none z-10"></div>

        <div className="relative h-64 overflow-hidden bg-gray-800">
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
          <h3 className="text-xl font-bold text-white group-hover:text-gray-300 transition-colors line-clamp-1 mb-2">
            {product.name}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed flex-1">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
            <div>
              <span className="text-3xl font-black text-white">
                ${product.price.toFixed(2)}
              </span>
              <p className="text-xs text-gray-500 mt-1">
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
              className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full font-bold text-sm disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {product.stock === 0 ? '❌ Sold Out' : '🛒 Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

