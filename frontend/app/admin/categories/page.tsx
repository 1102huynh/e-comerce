'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as apiModule from '@/lib/api';
import { useAuthHydration } from '@/hooks/useAuthHydration';
import { toast } from '@/lib/toast';

const api = apiModule.default;

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function AdminCategoriesPage() {
  const { isHydrated, user, isAdmin } = useAuthHydration();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

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
    fetchCategories();
  }, [isHydrated, user, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/categories/${editingId}`, formData);
        toast.success('Category updated');
      } else {
        await api.post('/admin/categories', formData);
        toast.success('Category created');
      }

      resetForm();
      setCurrentPage(1); // Reset to first page after creating/updating
      fetchCategories();
    } catch (error) {
      toast.error('Failed to save category');
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = categories.slice(startIndex, endIndex);

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure? This will affect all products in this category.')) return;

    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
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
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl"
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
        <div className="mb-12">
          <div className="text-center md:text-left">
            <div className="text-6xl mb-3 inline-block">🏷️</div>
            <h1
              className="text-5xl md:text-6xl font-black"
              style={{ color: 'var(--foreground)' }}
            >
              Manage Categories
            </h1>
            <div
              className="w-20 h-1 mt-3"
              style={{
                background: 'var(--foreground)',
                opacity: 0.3,
              }}
            ></div>
          </div>
        </div>

        {/* Form Section */}
        <div
          className="border rounded-2xl p-8 mb-12"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
          }}
        >
          <h2
            className="text-3xl font-black mb-6"
            style={{ color: 'var(--foreground)' }}
          >
            {editingId ? '✏️ Edit Category' : '➕ Add Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="block text-sm font-bold mb-2"
                style={{ color: 'var(--foreground)' }}
              >
                Category Name *
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
                placeholder="Enter category name"
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
                placeholder="Category description"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="w-full px-8 py-4 rounded-full font-black transition-all transform hover:scale-105"
              style={{
                backgroundColor: 'var(--foreground)',
                color: 'var(--background)',
              }}
            >
              {editingId ? '💾 Update Category' : '➕ Create Category'}
            </button>
          </form>
        </div>

        {/* Categories Grid */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedCategories.map((category, index) => (
              <div
                key={category.id}
                className="relative border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--card-border)',
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div
                  className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br rounded-bl-full"
                  style={{
                    background: `linear-gradient(to bottom right, var(--foreground), transparent)`,
                    opacity: 0.05,
                  }}
                ></div>
                <div className="relative z-10">
                  <h3
                    className="text-2xl font-black mb-3"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {category.name}
                  </h3>
                  <p
                    className="mb-6 min-h-[60px] leading-relaxed"
                    style={{ color: 'var(--foreground)', opacity: 0.7 }}
                  >
                    {category.description}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex-1 px-4 py-3 rounded-full font-bold transition-all transform hover:scale-105"
                      style={{
                        backgroundColor: '#3b82f6',
                        color: '#ffffff',
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="flex-1 px-4 py-3 rounded-full font-bold transition-all transform hover:scale-105"
                      style={{
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div
              className="border rounded-2xl px-6 py-4 flex items-center justify-between"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
              }}
            >
              <div style={{ color: 'var(--foreground)', opacity: 0.7 }} className="text-sm">
                Showing {startIndex + 1} to {Math.min(endIndex, categories.length)} of {categories.length} categories
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-lg font-semibold transition-all"
                  style={{
                    backgroundColor: 'var(--background)',
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
                        backgroundColor: currentPage === page ? 'var(--foreground)' : 'var(--background)',
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
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--card-border)',
                    color: 'var(--foreground)',
                    opacity: currentPage === totalPages ? 0.5 : 1,
                  }}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

