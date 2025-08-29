// src/components/admin/ManageOrders.jsx

import React, { useState, useEffect } from "react";
import { apiService } from "../../services/api";
import {
  CheckCircle,
  Clock,
  Package,
  XCircle,
  ChevronDown,
  Eye,
  Edit,
} from "lucide-react";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL"); // පෙරහන් තත්ත්වය
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await apiService.orders.getAllOrders();
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("ඇණවුම් ලබා ගැනීමේදී දෝෂයක් සිදුවිය.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusDisplay = (status) => {
    switch (status) {
      case "PENDING":
        return {
          text: "Pending",
          icon: <Clock size={16} />,
          color: "bg-yellow-100 text-yellow-800",
        };
      case "SHIPPED":
        return {
          text: "Shipped",
          icon: <Package size={16} />,
          color: "bg-blue-100 text-blue-800",
        };
      case "COMPLETED":
        return {
          text: "Completed",
          icon: <CheckCircle size={16} />,
          color: "bg-green-100 text-green-800",
        };
      case "CANCELLED":
        return {
          text: "Cancelled",
          icon: <XCircle size={16} />,
          color: "bg-red-100 text-red-800",
        };
      default:
        return { text: status, icon: null, color: "bg-gray-100 text-gray-800" };
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (
      window.confirm(
        `ඇණවුම #${orderId} හි තත්ත්වය '${newStatus}' ලෙස වෙනස් කරනවාද?`
      )
    ) {
      try {
        await apiService.orders.updateOrderStatus(orderId, {
          status: newStatus,
        });
        const updatedOrders = orders.map((order) =>
          order.order_id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        alert("ඇණවුමේ තත්ත්වය සාර්ථකව යාවත්කාලීන විය!");
      } catch (err) {
        console.error("Failed to update order status:", err);
        alert("තත්ත්වය යාවත්කාලීන කිරීමේදී දෝෂයක් සිදුවිය.");
      }
    }
  };

  const filteredOrders = orders.filter((order) => {
    console.log(order);
    if (filter === "ALL") return true;
    return order.status === filter;
  });

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const renderModal = () => {
    if (!!selectedOrder && !!showModal) {
      return (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50"
          onClick={() => setShowModal(false)} // පිටත ක්ලික් කළ විට Modal එක වැසීමට
        >
          <div
            className="relative p-8 bg-white w-full max-w-2xl rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()} // Modal එක ඇතුළත ක්ලික් කිරීමෙන් වැසීම වැළැක්වීමට
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              <XCircle size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-4">
              Order #{selectedOrder.order_id} Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <p>
                <span className="font-semibold">User Name:</span>{" "}
                {selectedOrder.user_name}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(selectedOrder.order_datetime).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {getStatusDisplay(selectedOrder.status).text}
              </p>
              <p>
                <span className="font-semibold">Total:</span> Rs.{" "}
                {parseFloat(selectedOrder.total_amount).toFixed(2)}
              </p>
              <div className="col-span-2">
                <p className="font-semibold">Delivery Address:</p>
                <p>{selectedOrder.delivery_address}</p>
              </div>
              <div className="col-span-2 mt-4">
                <h4 className="text-lg font-bold mb-2">Items:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedOrder.items?.map((item, index) => (
                    <li key={index}>
                      {item.product_name} x {item.quantity} - Rs.{" "}
                      {(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return <div className="p-6 text-center">ඇණවුම් පූරණය වෙමින් පවතී...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Orders Management</h2>
        <div className="relative">
          <select
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="SHIPPED">Shipped</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const statusInfo = getStatusDisplay(order.status);
                return (
                  <tr key={order.order_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.order_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.user_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.order_datetime).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rs. {parseFloat(order.total_amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`}
                      >
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(order.order_id, "SHIPPED")
                        }
                        className="text-blue-600 hover:text-blue-900"
                        title="Mark as Shipped"
                      >
                        <Package size={20} />
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(order.order_id, "COMPLETED")
                        }
                        className="text-green-600 hover:text-green-900"
                        title="Mark as Completed"
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(order.order_id, "CANCELLED")
                        }
                        className="text-red-600 hover:text-red-900"
                        title="Mark as Cancelled"
                      >
                        <XCircle size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  ඇණවුම් කිසිවක් හමු නොවීය.
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

export default ManageOrders;
