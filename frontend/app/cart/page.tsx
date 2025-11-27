'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
}

interface Cart {
  id: number;
  items: CartItem[];
}

export default function CartPage() {
  const { user } = useAuthStore();
  const { setCart } = useCartStore();
  const router = useRouter();
  const [cart, setLocalCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      setLocalCart(response.data);
      setCart(response.data.items);
    } catch (error) {
      toast.error('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const response = await api.put(`/cart/items/${itemId}?quantity=${quantity}`);
      setLocalCart(response.data);
      setCart(response.data.items);
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      fetchCart();
      toast.success('Item removed');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const getTotalPrice = () => {
    if (!cart) return 0;
    return cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading your cart...</div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-4xl font-black text-white mb-4">Your Cart is Empty</h1>
          <p className="text-gray-400 mb-8">Start adding some awesome products!</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-all transform hover:scale-105"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <div className="text-6xl mb-4 animate-bounce inline-block">🛒</div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">Shopping Cart</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item, index) => (
              <div
                key={item.id}
                className="bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800 rounded-2xl p-6 flex gap-6 hover:border-gray-600 hover:shadow-xl hover:shadow-white/5 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-800">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-white mb-2">{item.product.name}</h3>
                  <p className="text-white font-black text-2xl mb-4">
                    ${item.product.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-4">
                    <label className="text-gray-400 text-sm font-semibold">Quantity:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value))
                      }
                      className="w-20 px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-red-500 hover:text-red-400 font-semibold transition-colors"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-2xl text-white">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 sticky top-4">
              <h2 className="text-2xl font-black text-white mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal:</span>
                  <span className="text-white font-bold">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping:</span>
                  <span className="text-green-500 font-semibold">Free</span>
                </div>
                <div className="border-t border-gray-800 pt-4 flex justify-between text-white">
                  <span className="font-black text-xl">Total:</span>
                  <span className="font-black text-2xl">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-white text-black py-4 rounded-full font-black text-lg hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg"
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

