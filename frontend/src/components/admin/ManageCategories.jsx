import React, { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2, XCircle } from "lucide-react";
import { apiService } from "../../services/api";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    category_id: null,
    category_name: "",
    image_url: "", 
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.categories.getAllCategories();
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Failed to retrieve categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentCategory({ category_id: null, category_name: "", image_url: "" });
    setShowModal(true);
  };

  const handleOpenEditModal = (category) => {
    setIsEditing(true);
    setCurrentCategory(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCategory({ category_id: null, category_name: "", image_url: "" });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await apiService.categories.updateCategory(currentCategory.category_id, currentCategory);
      } else {
        await apiService.categories.createCategory(currentCategory);
      }
      handleCloseModal();
      fetchCategories();
      alert(`Category ${isEditing ? 'updated' : 'added'} successfully!`);
    } catch (err) {
      console.error("Failed to save category:", err);
      alert("An error occurred while saving the category.");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await apiService.categories.deleteCategory(categoryId);
        fetchCategories();
        alert("Category deleted successfully!");
      } catch (err) {
        console.error("Failed to delete category:", err);
        alert("An error occurred while deleting the category.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory({ ...currentCategory, [name]: value });
  };

  const renderModal = () => {
    if (!showModal) return null;
    return (
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50"
        onClick={handleCloseModal}
      >
        <div
          className="relative p-8 bg-white w-full max-w-sm rounded-lg shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            onClick={handleCloseModal}
          >
            <XCircle size={24} />
          </button>
          <h3 className="text-2xl font-bold mb-4">
            {isEditing ? "Update Category" : "Add New Category"}
          </h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Category Name</label>
              <input
                type="text"
                name="category_name"
                value={currentCategory.category_name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Image URL</label>
              <input
                type="text"
                name="image_url"
                value={currentCategory.image_url}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditing ? "Update" : "Add"}
            </button>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="p-6 text-center">Loading data...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Categories</h2>
        <button
          onClick={handleOpenAddModal}
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <PlusCircle size={20} className="mr-2" /> Add New Category
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.category_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.category_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={category.image_url} alt={category.category_name} className="w-12 h-12 object-cover" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {category.category_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(category)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.category_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {renderModal()}
    </div>
  );
};

export default ManageCategories;