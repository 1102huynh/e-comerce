'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface Order {
  id: number;
  user: {
    id: number;
    fullName: string;
    email: string;
  };
  totalAmount: number;
  status: string;
  shippingAddress: string;
  phone: string;
  createdAt: string;
  items: Array<{
    id: number;
    product: {
      name: string;
    };
    quantity: number;
    price: number;
  }>;
}

export default function AdminOrdersPage() {
  const { user, isAdmin } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin()) {
      router.push('/');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: number, status: string) => {
    try {
      await api.put(`/admin/orders/${orderId}/status?status=${status}`);
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
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
        <div className="text-white text-xl">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4 inline-block">📋</div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-3">Manage Orders</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto"></div>
        </div>

        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-gray-400">
                    👤 Customer: {order.user.fullName} ({order.user.email})
                  </p>
                  <p className="text-sm text-gray-400">
                    📅 Date: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="border-t border-gray-800 pt-6 mb-6">
                <h4 className="font-bold text-white mb-4 text-lg">Items:</h4>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between py-3 bg-gray-800 px-4 rounded-lg">
                      <span className="text-white">
                        {item.product.name} <span className="text-gray-400">x {item.quantity}</span>
                      </span>
                      <span className="text-white font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6 mb-6">
                <div className="flex justify-between mb-4">
                  <span className="font-bold text-white text-xl">Total:</span>
                  <span className="font-black text-white text-2xl">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-gray-400">
                    <strong className="text-white">📍 Shipping:</strong> {order.shippingAddress}
                  </p>
                  <p className="text-sm text-gray-400">
                    <strong className="text-white">📞 Phone:</strong> {order.phone}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <label className="block text-sm font-bold text-white mb-3">
                  🔄 Update Status:
                </label>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="w-full md:w-auto px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <div className="text-2xl text-white font-bold">No orders found</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

