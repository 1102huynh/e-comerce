'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  shippingAddress: string;
  phone: string;
  createdAt: string;
  region?: string;
  paymentMethod?: string;
}

export default function OrdersPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-500 text-black',
      PROCESSING: 'bg-blue-500 text-white',
      SHIPPED: 'bg-purple-500 text-white',
      DELIVERED: 'bg-green-500 text-white',
      CANCELLED: 'bg-red-500 text-white',
    };
    return colors[status] || 'bg-gray-500 text-white';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading your orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-6">📦</div>
          <h1 className="text-4xl font-black text-white mb-4">No Orders Yet</h1>
          <p className="text-gray-400 mb-8">Start shopping and place your first order!</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-all transform hover:scale-105"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="text-6xl mb-4 inline-block animate-bounce">📦</div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">My Orders</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Track and manage all your purchases</p>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors">
            <div className="text-3xl mb-2">📋</div>
            <div className="text-3xl font-black text-white mb-1">{orders.length}</div>
            <div className="text-sm text-gray-400">Total Orders</div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-3xl font-black text-green-400 mb-1">{orders.filter(o => o.status === 'DELIVERED').length}</div>
            <div className="text-sm text-gray-400">Delivered</div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-3xl font-black text-blue-400 mb-1">{orders.filter(o => ['PENDING', 'PROCESSING', 'SHIPPED'].includes(o.status)).length}</div>
            <div className="text-sm text-gray-400">In Progress</div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-3xl font-black text-white mb-1">${orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}</div>
            <div className="text-sm text-gray-400">Total Spent</div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className="relative bg-gradient-to-br from-gray-900 to-gray-900/80 border-2 border-gray-800 rounded-2xl p-8 hover:border-gray-700 hover:shadow-2xl hover:shadow-white/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Decorative corner accents */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-full"></div>

              <div className="relative z-10">
                {/* Order Header - Top Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-gray-700">
                  <div>
                    <h3 className="text-3xl font-black text-white mb-2">Order #{order.id}</h3>
                    <div className="flex flex-col sm:flex-row gap-4 text-sm">
                      <span className="text-gray-400">
                        📅 {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="text-gray-400">
                        🕐 {new Date(order.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <span className={`px-6 py-3 rounded-full font-bold text-sm ${getStatusColor(order.status)} shadow-lg text-center min-w-fit`}>
                      {order.status === 'PENDING' && '⏳ '}
                      {order.status === 'PROCESSING' && '⚙️ '}
                      {order.status === 'SHIPPED' && '🚚 '}
                      {order.status === 'DELIVERED' && '✅ '}
                      {order.status === 'CANCELLED' && '❌ '}
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Items Grid */}
                <div className="mb-8">
                  <h4 className="font-black text-white mb-4 text-lg flex items-center gap-2">
                    <span>📦</span> Order Items ({order.items.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-gray-600 transition-colors">
                        <div className="flex-1">
                          <p className="text-white font-bold">{item.product.name}</p>
                          <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-black text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-gray-400 text-xs">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-700">
                  {/* Pricing Details */}
                  <div className="space-y-3 bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                    <h5 className="font-black text-white mb-4 flex items-center gap-2">
                      <span>💰</span> Price Details
                    </h5>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Subtotal:</span>
                      <span className="text-white font-bold">${(order.totalAmount * 0.9).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Tax (10%):</span>
                      <span className="text-white font-bold">${(order.totalAmount * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-gray-600 pt-3">
                      <span className="text-white font-black">Total Amount:</span>
                      <span className="text-white font-black text-lg">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment & Region Info */}
                  <div className="space-y-3 bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                    <h5 className="font-black text-white mb-4 flex items-center gap-2">
                      <span>ℹ️</span> Order Info
                    </h5>
                    {order.region && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Region:</span>
                        <span className="text-white font-bold">
                          {order.region === 'vietnam' ? '🇻🇳 Vietnam' : '🇪🇺 Europe'}
                        </span>
                      </div>
                    )}
                    {order.paymentMethod && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Payment:</span>
                        <span className="text-white font-bold">
                          {order.paymentMethod === 'cod' && '💵 COD'}
                          {order.paymentMethod === 'momo' && '📱 Momo'}
                          {order.paymentMethod === 'bank' && '🏦 Bank Transfer'}
                          {order.paymentMethod === 'card' && '💳 Card'}
                          {order.paymentMethod === 'paypal' && '🅿️ PayPal'}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-600 pt-3">
                      <p className="text-xs text-gray-400 mb-2">Invoice Status:</p>
                      <p className="text-white font-bold flex items-center gap-2">
                        <span>✉️</span> Invoice sent to email
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                  <h5 className="font-black text-white mb-4 flex items-center gap-2">
                    <span>📍</span> Shipping Details
                  </h5>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Delivery Address:</p>
                      <p className="text-white font-semibold">{order.shippingAddress}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Contact Number:</p>
                      <p className="text-white font-semibold">{order.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

