'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as apiModule from '@/lib/api';
import { useAuthHydration } from '@/hooks/useAuthHydration';
import { toast } from '@/lib/toast';

const api = apiModule.default;

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
}

export default function AdminProductsPage() {
  const { isHydrated, user, isAdmin } = useAuthHydration();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    categoryId: '',
  });

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    if (!isHydrated) return;

    if (!user || !isAdmin()) {
      router.push('/');
      return;
    }
    fetchProducts();
    fetchCategories();
  }, [isHydrated, user, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId),
      };

      if (editingId) {
        await api.put(`/admin/products/${editingId}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/admin/products', payload);
        toast.success('Product created');
      }

      resetForm();
      setCurrentPage(1); // Reset to first page after creating/updating
      fetchProducts();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      imageUrl: '',
      categoryId: product.category.id.toString(),
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      imageUrl: '',
      categoryId: '',
    });
    setEditingId(null);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            backgroundColor: 'var(--foreground)',
            opacity: 0.05,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <button
          onClick={() => router.push('/admin')}
          className="mb-6 flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
        >
          ← Back to Dashboard
        </button>
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <div className="text-6xl mb-3 inline-block">📦</div>
            <h1
              className="text-5xl md:text-6xl font-black"
              style={{ color: 'var(--foreground)' }}
            >
              Manage Products
            </h1>
            <div
              className="w-20 h-1 mt-3"
              style={{
                background: 'var(--foreground)',
                opacity: 0.3,
              }}
            ></div>
          </div>
          <div
            className="rounded-2xl p-8 mb-8 border"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
            }}
          >
            <h2
              className="text-3xl font-black mb-6"
              style={{ color: 'var(--foreground)' }}
            >
              {editingId ? '✏️ Edit Product' : '➕ Add Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  style={{ color: 'var(--foreground)' }}
                >
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    borderColor: 'var(--input-border)',
                    color: 'var(--foreground)',
                  }}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  style={{ color: 'var(--foreground)' }}
                >
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    borderColor: 'var(--input-border)',
                    color: 'var(--foreground)',
                  }}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  rows={3}
                  placeholder="Product description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--foreground)',
                    }}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--foreground)',
                    }}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  style={{ color: 'var(--foreground)' }}
                >
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    borderColor: 'var(--input-border)',
                    color: 'var(--foreground)',
                  }}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  placeholder="https://..."
              />
            </div>
            <div>
              <label
                className="block text-sm font-bold mb-2"
                style={{ color: 'var(--foreground)' }}
              >
                Category *
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--input-border)',
                  color: 'var(--foreground)',
                }}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full px-8 py-4 rounded-full font-black transition-all transform hover:scale-105"
              style={{
                backgroundColor: 'var(--foreground)',
                color: 'var(--background)',
              }}
            >
              {editingId ? '💾 Update Product' : '➕ Create Product'}
            </button>
            </form>
          </div>
        </div>

        <div
          className="border rounded-2xl overflow-hidden"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
          }}
        >
          <table className="w-full">
            <thead
              style={{
                backgroundColor: 'var(--button-hover)',
                borderColor: 'var(--card-border)',
              }}
              className="border-b"
            >
              <tr>
                <th
                  className="px-6 py-4 text-left font-bold"
                  style={{ color: 'var(--foreground)' }}
                >
                  ID
                </th>
                <th
                  className="px-6 py-4 text-left font-bold"
                  style={{ color: 'var(--foreground)' }}
                >
                  Name
                </th>
                <th
                  className="px-6 py-4 text-left font-bold"
                  style={{ color: 'var(--foreground)' }}
                >
                  Price
                </th>
                <th
                  className="px-6 py-4 text-left font-bold"
                  style={{ color: 'var(--foreground)' }}
                >
                  Stock
                </th>
                <th
                  className="px-6 py-4 text-left font-bold"
                  style={{ color: 'var(--foreground)' }}
                >
                  Category
                </th>
                <th
                  className="px-6 py-4 text-left font-bold"
                  style={{ color: 'var(--foreground)' }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-t transition-colors hover:opacity-80"
                  style={{
                    borderColor: 'var(--card-border)',
                  }}
                >
                  <td
                    className="px-6 py-4"
                    style={{ color: 'var(--foreground)', opacity: 0.7 }}
                  >
                    {product.id}
                  </td>
                  <td
                    className="px-6 py-4 font-semibold"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {product.name}
                  </td>
                  <td
                    className="px-6 py-4 font-bold"
                    style={{ color: 'var(--foreground)' }}
                  >
                    ${product.price}
                  </td>
                  <td
                    className="px-6 py-4"
                    style={{ color: 'var(--foreground)', opacity: 0.7 }}
                  >
                    {product.stock}
                  </td>
                  <td
                    className="px-6 py-4"
                    style={{ color: 'var(--foreground)', opacity: 0.7 }}
                  >
                    {product.category.name}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(product)}
                      className="mr-4 font-semibold hover:opacity-80 transition-opacity"
                      style={{ color: '#3b82f6' }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="font-semibold hover:opacity-80 transition-opacity"
                      style={{ color: '#ef4444' }}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div
            className="border-t px-6 py-4 flex items-center justify-between"
            style={{
              backgroundColor: 'var(--button-hover)',
              borderColor: 'var(--card-border)',
            }}
          >
            <div style={{ color: 'var(--foreground)', opacity: 0.7 }} className="text-sm">
              Showing {startIndex + 1} to {Math.min(endIndex, products.length)} of {products.length} products
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg font-semibold transition-all"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--card-border)',
                  color: 'var(--foreground)',
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
              >
                ← Previous
              </button>

              <div className="flex gap-1 items-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className="px-3 py-2 rounded-lg font-semibold transition-all"
                    style={{
                      backgroundColor: currentPage === page ? 'var(--foreground)' : 'var(--card-bg)',
                      color: currentPage === page ? 'var(--background)' : 'var(--foreground)',
                      borderColor: 'var(--card-border)',
                      border: '1px solid var(--card-border)',
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-lg font-semibold transition-all"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--card-border)',
                  color: 'var(--foreground)',
                  opacity: currentPage === totalPages ? 0.5 : 1,
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

