

import React, { useState } from "react";
import { Users, Package, ShoppingCart, Menu } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <div className="p-4">👤 Manage Users content here</div>;
      case "products":
        return <div className="p-4">📦 Manage Products content here</div>;
      case "orders":
        return <div className="p-4">🛒 Manage Orders content here</div>;
      default:
        return <div className="p-4">Select an option</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4 hidden md:block">
        <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
        <nav className="space-y-2">
          <button
            className={`flex items-center gap-2 p-2 rounded w-full text-left ${
              activeTab === "users" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <Users size={18} /> Users
          </button>

          <button
            className={`flex items-center gap-2 p-2 rounded w-full text-left ${
              activeTab === "products" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("products")}
          >
            <Package size={18} /> Products
          </button>

          <button
            className={`flex items-center gap-2 p-2 rounded w-full text-left ${
              activeTab === "orders" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingCart size={18} /> Orders
          </button>
        </nav>
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white shadow p-3 flex items-center gap-2">
        <Menu size={20} />
        <h2 className="text-lg font-bold">Admin Dashboard</h2>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
    </div>
  );
}
