'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as apiModule from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/lib/toast';

const api = apiModule.default;

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function AdminCategoriesPage() {
  const { user, isAdmin } = useAuthStore();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (!user || !isAdmin()) {
      router.push('/');
      return;
    }
    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

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
      fetchCategories();
    } catch (error) {
      toast.error('Failed to save category');
    }
  };

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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-12">
          <div className="text-center md:text-left">
            <div className="text-6xl mb-3 inline-block">🏷️</div>
            <h1 className="text-5xl md:text-6xl font-black text-white">Manage Categories</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-white to-transparent mt-3"></div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-black text-white mb-6">{editingId ? '✏️ Edit Category' : '➕ Add Category'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-white mb-2">Category Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Category description"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white text-black px-8 py-4 rounded-full font-black hover:bg-gray-200 transition-all transform hover:scale-105"
            >
              {editingId ? '💾 Update Category' : '➕ Create Category'}
            </button>
          </form>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="relative bg-gradient-to-br from-gray-900 to-gray-900/80 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 hover:shadow-xl hover:shadow-white/5 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white mb-3">{category.name}</h3>
                <p className="text-gray-400 mb-6 min-h-[60px] leading-relaxed">{category.description}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-full font-bold transition-all transform hover:scale-105"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-full font-bold transition-all transform hover:scale-105"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

