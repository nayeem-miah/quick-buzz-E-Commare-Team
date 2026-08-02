import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiEdit, FiLayers, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import DeleteConfirmModal from '../../../Shared/DeleteConfirmModal';
import LoadingSpinner from '../../../Shared/Loading';
import { Category } from '../../../types/category.type';

const AdminManageCategories: React.FC = () => {
  const axiosSecure = UseAxiosSecure();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['categories', search],
    queryFn: async () => {
      const res = await axiosSecure.get(`/categories?search=${search}`);
      return res.data;
    },
  });

  const categories = data?.data || [];

  const openModal = (category: Category | null = null) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name || '');
      setIcon(category.icon || '');
      setDescription(category.description || '');
    } else {
      setEditingCategory(null);
      setName('');
      setIcon('');
      setDescription('');
    }
    setIconFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = icon;

      if (iconFile) {
        const formData = new FormData();
        formData.append('image', iconFile);

        const { data } = await axiosSecure.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = data.data.display_url;
      }

      if (editingCategory) {
        await axiosSecure.put(`/categories/${editingCategory._id}`, {
          name,
          icon: imageUrl,
          description,
        });
        toast.success('Category updated.');
      } else {
        await axiosSecure.post('/categories', {
          name,
          icon: imageUrl,
          description,
        });
        toast.success('Category created.');
      }
      closeModal();
      refetch();
    } catch (error: unknown) {
      const errMessage =
        error instanceof Error ? error.message : 'Something went wrong';
      toast.error(errMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    const category =
      categories.find((item: Category) => item._id === id) || null;
    setDeleteTarget(category);
  };

  const confirmDelete = async () => {
    if (!deleteTarget?._id) return;

    setIsDeleting(true);
    try {
      await axiosSecure.delete(`/categories/${deleteTarget._id}`);
      await refetch();
      toast.success('Category has been deleted.');
      setDeleteTarget(null);
    } catch (error: unknown) {
      const errMessage =
        error instanceof Error ? error.message : 'Could not delete category.';
      toast.error(errMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-8 space-y-8 animate-fadeIn">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Manage Categories
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Add, edit, or remove product categories.
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-md shadow-orange-500/30 self-start md:self-auto flex-shrink-0"
          >
            <FiPlus size={16} /> Add New Category
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all duration-300 text-sm"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <LoadingSpinner smallHeight={true} />
          ) : categories.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center mb-4">
                <FiLayers size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                No categories found
              </h3>
              <p className="text-gray-500 max-w-sm mt-2 text-sm">
                We couldn't find any categories matching your criteria. Add a
                new one to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="py-4 px-6 font-semibold rounded-tl-2xl w-16">
                      SL
                    </th>
                    <th className="py-4 px-6 font-semibold">Category Name</th>
                    <th className="py-4 px-6 font-semibold">Total Products</th>
                    <th className="py-4 px-6 font-semibold">Icon</th>
                    <th className="py-4 px-6 font-semibold">Description</th>
                    <th className="py-4 px-6 font-semibold text-right rounded-tr-2xl">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {categories.map((category: Category, index: number) => (
                    <tr
                      key={category._id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-200"
                    >
                      <td className="py-4 px-6 font-medium text-gray-500">
                        {index + 1}
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-900">
                        {category.name}
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-700">
                        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
                          {category.totalProducts || 0}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {category.icon ? (
                          <img
                            src={category.icon}
                            alt={category.name}
                            className="w-10 h-10 object-cover rounded-lg border border-gray-100 bg-gray-50"
                          />
                        ) : (
                          <span className="text-gray-400 italic text-sm">
                            N/A
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-gray-500 truncate max-w-[200px]">
                        {category.description || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openModal(category)}
                            className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all duration-300 text-sm"
                  placeholder="e.g., Electronics"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Category Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setIconFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all duration-300 text-sm"
                />
                {icon && !iconFile && (
                  <img
                    src={icon}
                    alt="Current icon"
                    className="h-10 w-10 mt-2 rounded object-cover"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all duration-300 text-sm resize-none"
                  placeholder="Short description..."
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-1/2 px-5 py-2.5 rounded-xl font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 flex justify-center items-center bg-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm shadow-orange-500/30 hover:bg-orange-600 transition-all duration-300 disabled:opacity-50"
                >
                  {loading
                    ? 'Processing...'
                    : editingCategory
                      ? 'Save Changes'
                      : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete category?"
        itemName={deleteTarget?.name}
        isDeleting={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default AdminManageCategories;
