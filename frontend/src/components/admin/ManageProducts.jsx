// src/components/admin/ManageProducts.jsx

import React, { useState, useEffect } from "react";
import { apiService } from "../../services/api";
import { PlusCircle, Edit, Trash2, XCircle } from "lucide-react";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    product_id: "",
    product_name: "",
    description: "",
    price: "",
    image_url: "",
    category_id: "",
    stock_quantity: 0, // stock_quantity state එකට එකතු කරයි
    is_available: true, // is_available state එකට එකතු කරයි
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.products.getAllProducts();
      setProducts(response.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to retrieve products.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentProduct({
      product_name: "",
      description: "",
      price: "",
      image_url: "",
      category_id: "",
      stock_quantity: 0,
      is_available: true,
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await apiService.products.updateProduct(currentProduct.product_id, currentProduct);
      } else {
        await apiService.products.createProduct(currentProduct);
      }
      setShowModal(false);
      fetchProducts();
      alert(`Product successfully ${isEditing ? 'updated!' : 'added!'}`);
    } catch (err) {
      console.error("Failed to save product:", err);
      alert("An error occurred while saving the product.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await apiService.products.deleteProduct(productId);
        fetchProducts();
        alert("Product successfully deleted!");
      } catch (err) {
        console.error("Failed to delete product:", err);
        alert("An error occurred while deleting the product.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };
  
  // තොග ප්‍රමාණය යාවත්කාලීන කිරීමට නව ශ්‍රිතය
  const handleUpdateStockQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity < 0) {
          alert("තොග ප්‍රමාණය සෘණ අගයක් විය නොහැක.");
          return;
      }
      await apiService.products.updateStock(productId, newQuantity);
      fetchProducts(); // යාවත්කාලීන දත්ත ලබා ගැනීමට
    } catch (err) {
      console.error("Failed to update stock quantity:", err);
      alert("තොග ප්‍රමාණය යාවත්කාලීන කිරීමේදී දෝෂයක් සිදුවිය.");
    }
  };

  // ලබා ගත හැකි බව toggle කිරීමට නව ශ්‍රිතය
  const handleToggleAvailability = async (productId, currentStatus) => {
    try {
      await apiService.products.toggleAvailability(productId, !currentStatus);
      fetchProducts(); // යාවත්කාලීන දත්ත ලබා ගැනීමට
    } catch (err) {
      console.error("Failed to toggle availability:", err);
      alert("ලබා ගත හැකි බව යාවත්කාලීන කිරීමේදී දෝෂයක් සිදුවිය.");
    }
  };

  const renderModal = () => {
    if (!showModal) return null;
    return (
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50"
        onClick={() => setShowModal(false)}
      >
        <div
          className="relative p-8 bg-white w-full max-w-lg rounded-lg shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            onClick={() => setShowModal(false)}
          >
            <XCircle size={24} />
          </button>
          <h3 className="text-2xl font-bold mb-4">
            {isEditing ? "Update Product" : "Add New Product"}
          </h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Product Name</label>
              <input
                type="text"
                name="product_name"
                value={currentProduct.product_name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Price (Rs.)</label>
              <input
                type="number"
                name="price"
                value={currentProduct.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Description</label>
              <textarea
                name="description"
                value={currentProduct.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                rows="3"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700">Image URL</label>
              <input
                type="text"
                name="image_url"
                value={currentProduct.image_url}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Category ID</label>
              <input
                type="number"
                name="category_id"
                value={currentProduct.category_id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
             <div>
              <label className="block text-gray-700">Stock Quantity</label>
              <input
                type="number"
                name="stock_quantity"
                value={currentProduct.stock_quantity}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
             <div className="flex items-center">
              <input
                type="checkbox"
                name="is_available"
                checked={currentProduct.is_available}
                onChange={(e) => setCurrentProduct({ ...currentProduct, is_available: e.target.checked })}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <label className="ml-2 text-gray-700">Available</label>
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
    return <div className="p-6 text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
        <button
          onClick={handleOpenAddModal}
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <PlusCircle size={20} className="mr-2" /> Add New Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.product_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.product_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={product.image_url}
                      alt={product.product_name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.product_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rs. {product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-green-600 rounded-md"
                        checked={product.is_available}
                        onChange={() => handleToggleAvailability(product.product_id, product.is_available)}
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {product.is_available ? "Available" : "Not Available"}
                      </span>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={product.stock_quantity}
                      onChange={(e) => setProducts(products.map(p => 
                        p.product_id === product.product_id ? { ...p, stock_quantity: e.target.value } : p
                      ))}
                      onBlur={(e) => handleUpdateStockQuantity(product.product_id, e.target.value)}
                      className="w-20 p-1 border rounded-md text-sm text-center"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button
                      onClick={() => handleOpenEditModal(product)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.product_id)}
                      className="text-red-600 hover:text-red-900 pr-10"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No products found.
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

export default ManageProducts;