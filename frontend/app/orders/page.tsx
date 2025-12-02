'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as apiModule from '@/lib/api';
import { useAuthHydration } from '@/hooks/useAuthHydration';
import { toast } from '@/lib/toast';

const api = apiModule.default;

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
  const { isHydrated, isAuthenticated } = useAuthHydration();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, [isHydrated, isAuthenticated, router]);

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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--background)' }}
      >
        <div style={{ color: 'var(--foreground)' }} className="text-xl">
          Loading your orders...
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--background)' }} className="min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-6">📦</div>
          <h1
            className="text-4xl font-black mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            No Orders Yet
          </h1>
          <p
            className="mb-8"
            style={{
              color: 'var(--foreground)',
              opacity: 0.6,
            }}
          >
            Start shopping and place your first order!
          </p>
          <button
            onClick={() => router.push('/products')}
            style={{
              backgroundColor: 'var(--nav-bg)',
              color: 'var(--nav-text)',
            }}
            className="px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--background)' }} className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="text-6xl mb-4 inline-block animate-bounce">📦</div>
          <h1
            className="text-5xl md:text-6xl font-black mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            My Orders
          </h1>
          <div
            className="w-24 h-1 mx-auto mb-4"
            style={{
              background: 'var(--foreground)',
              opacity: 0.2,
            }}
          ></div>
          <p
            style={{
              color: 'var(--foreground)',
              opacity: 0.6,
            }}
          >
            Track and manage all your purchases
          </p>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div
            className="border rounded-xl p-6 hover:transition-colors"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
            }}
          >
            <div className="text-3xl mb-2">📋</div>
            <div
              className="text-3xl font-black mb-1"
              style={{ color: 'var(--foreground)' }}
            >
              {orders.length}
            </div>
            <div
              className="text-sm"
              style={{
                color: 'var(--foreground)',
                opacity: 0.6,
              }}
            >
              Total Orders
            </div>
          </div>

          <div
            className="border rounded-xl p-6 hover:transition-colors"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
            }}
          >
            <div className="text-3xl mb-2">✅</div>
            <div className="text-3xl font-black text-green-400 mb-1">
              {orders.filter(o => o.status === 'DELIVERED').length}
            </div>
            <div
              className="text-sm"
              style={{
                color: 'var(--foreground)',
                opacity: 0.6,
              }}
            >
              Delivered
            </div>
          </div>

          <div
            className="border rounded-xl p-6 hover:transition-colors"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
            }}
          >
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-3xl font-black text-blue-400 mb-1">
              {orders.filter(o => ['PENDING', 'PROCESSING', 'SHIPPED'].includes(o.status)).length}
            </div>
            <div
              className="text-sm"
              style={{
                color: 'var(--foreground)',
                opacity: 0.6,
              }}
            >
              In Progress
            </div>
          </div>

          <div
            className="border rounded-xl p-6 hover:transition-colors"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
            }}
          >
            <div className="text-3xl mb-2">💰</div>
            <div
              className="text-3xl font-black mb-1"
              style={{ color: 'var(--foreground)' }}
            >
              ${orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}
            </div>
            <div
              className="text-sm"
              style={{
                color: 'var(--foreground)',
                opacity: 0.6,
              }}
            >
              Total Spent
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className="relative border-2 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* Decorative corner accents */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-bl-full"
                style={{
                  background: 'var(--foreground)',
                  opacity: 0.05,
                }}
              ></div>
              <div
                className="absolute bottom-0 left-0 w-24 h-24 rounded-tr-full"
                style={{
                  background: 'var(--foreground)',
                  opacity: 0.03,
                }}
              ></div>

              <div className="relative z-10">
                {/* Order Header - Top Section */}
                <div
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b"
                  style={{ borderBottomColor: 'var(--card-border)' }}
                >
                  <div>
                    <h3
                      className="text-3xl font-black mb-2"
                      style={{ color: 'var(--foreground)' }}
                    >
                      Order #{order.id}
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4 text-sm">
                      <span
                        style={{
                          color: 'var(--foreground)',
                          opacity: 0.6,
                        }}
                      >
                        📅 {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span
                        style={{
                          color: 'var(--foreground)',
                          opacity: 0.6,
                        }}
                      >
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
                  <h4
                    className="font-black mb-4 text-lg flex items-center gap-2"
                    style={{ color: 'var(--foreground)' }}
                  >
                    <span>📦</span> Order Items ({order.items.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-4 border rounded-xl transition-colors"
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          borderColor: 'var(--input-border)',
                        }}
                      >
                        <div className="flex-1">
                          <p
                            className="font-bold"
                            style={{ color: 'var(--foreground)' }}
                          >
                            {item.product.name}
                          </p>
                          <p
                            className="text-sm"
                            style={{
                              color: 'var(--foreground)',
                              opacity: 0.6,
                            }}
                          >
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className="font-black text-lg"
                            style={{ color: 'var(--foreground)' }}
                          >
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p
                            className="text-xs"
                            style={{
                              color: 'var(--foreground)',
                              opacity: 0.6,
                            }}
                          >
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary Section */}
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b"
                  style={{ borderBottomColor: 'var(--card-border)' }}
                >
                  {/* Pricing Details */}
                  <div
                    className="space-y-3 p-6 rounded-xl border"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                    }}
                  >
                    <h5
                      className="font-black mb-4 flex items-center gap-2"
                      style={{ color: 'var(--foreground)' }}
                    >
                      <span>💰</span> Price Details
                    </h5>
                    <div className="flex justify-between text-sm">
                      <span
                        style={{
                          color: 'var(--foreground)',
                          opacity: 0.6,
                        }}
                      >
                        Subtotal:
                      </span>
                      <span
                        className="font-bold"
                        style={{ color: 'var(--foreground)' }}
                      >
                        ${(order.totalAmount * 0.9).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span
                        style={{
                          color: 'var(--foreground)',
                          opacity: 0.6,
                        }}
                      >
                        Tax (10%):
                      </span>
                      <span
                        className="font-bold"
                        style={{ color: 'var(--foreground)' }}
                      >
                        ${(order.totalAmount * 0.1).toFixed(2)}
                      </span>
                    </div>
                    <div
                      className="flex justify-between text-sm border-t pt-3"
                      style={{ borderTopColor: 'var(--card-border)' }}
                    >
                      <span
                        className="font-black"
                        style={{ color: 'var(--foreground)' }}
                      >
                        Total Amount:
                      </span>
                      <span
                        className="font-black text-lg"
                        style={{ color: 'var(--foreground)' }}
                      >
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Payment & Region Info */}
                  <div
                    className="space-y-3 p-6 rounded-xl border"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                    }}
                  >
                    <h5
                      className="font-black mb-4 flex items-center gap-2"
                      style={{ color: 'var(--foreground)' }}
                    >
                      <span>ℹ️</span> Order Info
                    </h5>
                    {order.region && (
                      <div className="flex justify-between text-sm">
                        <span
                          style={{
                            color: 'var(--foreground)',
                            opacity: 0.6,
                          }}
                        >
                          Region:
                        </span>
                        <span
                          className="font-bold"
                          style={{ color: 'var(--foreground)' }}
                        >
                          {order.region === 'vietnam' ? '🇻🇳 Vietnam' : '🇪🇺 Europe'}
                        </span>
                      </div>
                    )}
                    {order.paymentMethod && (
                      <div className="flex justify-between text-sm">
                        <span
                          style={{
                            color: 'var(--foreground)',
                            opacity: 0.6,
                          }}
                        >
                          Payment:
                        </span>
                        <span
                          className="font-bold"
                          style={{ color: 'var(--foreground)' }}
                        >
                          {order.paymentMethod === 'cod' && '💵 COD'}
                          {order.paymentMethod === 'momo' && '📱 Momo'}
                          {order.paymentMethod === 'bank' && '🏦 Bank Transfer'}
                          {order.paymentMethod === 'card' && '💳 Card'}
                          {order.paymentMethod === 'paypal' && '🅿️ PayPal'}
                        </span>
                      </div>
                    )}
                    <div
                      className="border-t pt-3"
                      style={{ borderTopColor: 'var(--card-border)' }}
                    >
                      <p
                        className="text-xs mb-2"
                        style={{
                          color: 'var(--foreground)',
                          opacity: 0.6,
                        }}
                      >
                        Invoice Status:
                      </p>
                      <p
                        className="font-bold flex items-center gap-2"
                        style={{ color: 'var(--foreground)' }}
                      >
                        <span>✉️</span> Invoice sent to email
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div
                  className="rounded-xl p-6 border"
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    borderColor: 'var(--input-border)',
                  }}
                >
                  <h5
                    className="font-black mb-4 flex items-center gap-2"
                    style={{ color: 'var(--foreground)' }}
                  >
                    <span>📍</span> Shipping Details
                  </h5>
                  <div className="space-y-3">
                    <div>
                      <p
                        className="text-sm mb-1"
                        style={{
                          color: 'var(--foreground)',
                          opacity: 0.6,
                        }}
                      >
                        Delivery Address:
                      </p>
                      <p
                        className="font-semibold"
                        style={{ color: 'var(--foreground)' }}
                      >
                        {order.shippingAddress}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-sm mb-1"
                        style={{
                          color: 'var(--foreground)',
                          opacity: 0.6,
                        }}
                      >
                        Contact Number:
                      </p>
                      <p
                        className="font-semibold"
                        style={{ color: 'var(--foreground)' }}
                      >
                        {order.phone}
                      </p>
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

