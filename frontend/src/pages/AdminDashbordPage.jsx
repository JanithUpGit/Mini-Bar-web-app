import React, { useState } from "react";
import { Users, Package, ShoppingCart, Menu, LayoutGrid } from "lucide-react";
// Importing Components
import ManageUsers from '../components/admin/ManageUsers';
import ManageProducts from '../components/admin/ManageProducts';
import ManageOrders from '../components/admin/ManageOrders';
import ManageCategories from "../components/admin/ManageCategories";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products"); // Default tab is set to Products

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <ManageUsers />;
      case "products":
        return <ManageProducts />;
      case "orders":
        return <ManageOrders />;
      case "categories": // Tab name changed to 'categories'
        return <ManageCategories/>;
      default:
        return <div className="p-4 text-gray-600">Please select an option to manage.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4 hidden md:block">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>
        <nav className="space-y-2">
          <button
            className={`flex items-center gap-2 p-2 rounded w-full text-left ${
              activeTab === "products" ? "bg-blue-500 text-white" : "hover:bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("products")}
          >
            <Package size={18} /> Products
          </button>
          
          <button
            className={`flex items-center gap-2 p-2 rounded w-full text-left ${
              activeTab === "categories" ? "bg-blue-500 text-white" : "hover:bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("categories")}
          >
            <LayoutGrid size={18} /> Categories
          </button>

          <button
            className={`flex items-center gap-2 p-2 rounded w-full text-left ${
              activeTab === "orders" ? "bg-blue-500 text-white" : "hover:bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingCart size={18} /> Orders
          </button>
          
          <button
            className={`flex items-center gap-2 p-2 rounded w-full text-left ${
              activeTab === "users" ? "bg-blue-500 text-white" : "hover:bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <Users size={18} /> Users
          </button>
        </nav>
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white shadow p-3 flex items-center gap-2">
        <Menu size={20} />
        <h2 className="text-lg font-bold text-gray-800">Admin Dashboard</h2>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
    </div>
  );
}