import React, { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2, XCircle } from "lucide-react";
import { apiService } from "../../services/api";
// මෙම apiService එක mock එකක් ලෙස නිර්මාණය කර ඇත.
// ඔබගේ සැබෑ backend API Service එක මෙතැනට import කළ යුතුය.
const mockApiService = {
  categories: {
    getAllCategories: () => new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            { category_id: 1, category_name: "Electronics" },
            { category_id: 2, category_name: "Clothing" },
            { category_id: 3, category_name: "Home Goods" },
          ],
        });
      }, 500);
    }),
    createCategory: (category) => new Promise((resolve) => {
      setTimeout(() => {
        console.log("Creating category:", category);
        resolve({ message: "Category created successfully" });
      }, 500);
    }),
    updateCategory: (id, category) => new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Updating category ${id}:`, category);
        resolve({ message: "Category updated successfully" });
      }, 500);
    }),
    deleteCategory: (id) => new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Deleting category ${id}`);
        resolve({ message: "Category deleted successfully" });
      }, 500);
    }),
  },
};

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    category_id: null,
    category_name: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await mockApiService.categories.getAllCategories();
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("කාණ්ඩ ලබාගැනීම අසාර්ථක විය.");
    } finally {
      setLoading(false);
    }
  };

  // නව category එකක් එකතු කිරීමට modal එක විවෘත කරන්න
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentCategory({ category_id: null, category_name: "" });
    setShowModal(true);
  };

  // පවතින category එකක් update කිරීමට modal එක විවෘත කරන්න
  const handleOpenEditModal = (category) => {
    setIsEditing(true);
    setCurrentCategory(category);
    setShowModal(true);
  };

  // Modal එක වසා දැමීමට
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCategory({ category_id: null, category_name: "" });
  };

  // Form එක submit කිරීම
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await mockApiService.categories.updateCategory(currentCategory.category_id, currentCategory);
      } else {
        await mockApiService.categories.createCategory(currentCategory);
      }
      handleCloseModal();
      fetchCategories();
      alert(`කාණ්ඩය සාර්ථකව ${isEditing ? 'යාවත්කාලීන විය!' : 'එකතු විය!'}`);
    } catch (err) {
      console.error("Failed to save category:", err);
      alert("කාණ්ඩය සුරැකීමේදී දෝෂයක් සිදුවිය.");
    }
  };

  // කාණ්ඩයක් ඉවත් කිරීමට
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("ඔබට මෙම කාණ්ඩය ඉවත් කිරීමට අවශ්‍ය බව සත්‍යද?")) {
      try {
        await mockApiService.categories.deleteCategory(categoryId);
        fetchCategories();
        alert("කාණ්ඩය සාර්ථකව ඉවත් විය!");
      } catch (err) {
        console.error("Failed to delete category:", err);
        alert("කාණ්ඩය ඉවත් කිරීමේදී දෝෂයක් සිදුවිය.");
      }
    }
  };

  // input field වල අගයන් වෙනස් කිරීම
  const handleInputChange = (e) => {
    setCurrentCategory({ ...currentCategory, category_name: e.target.value });
  };

  // Modal Component එක render කිරීම
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
            {isEditing ? "කාණ්ඩය යාවත්කාලීන කරන්න" : "නව කාණ්ඩයක් එක් කරන්න"}
          </h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">කාණ්ඩයේ නම</label>
              <input
                type="text"
                name="category_name"
                value={currentCategory.category_name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditing ? "යාවත්කාලීන කරන්න" : "එක් කරන්න"}
            </button>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="p-6 text-center">දත්ත loading වෙමින් පවතී...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">කාණ්ඩ කළමනාකරණය</h2>
        <button
          onClick={handleOpenAddModal}
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <PlusCircle size={20} className="mr-2" /> නව කාණ්ඩයක් එක් කරන්න
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">කාණ්ඩයේ නම</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ක්‍රියාදාමයන්</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.category_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.category_id}
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
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  කිසිදු කාණ්ඩයක් හමු නොවීය.
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
