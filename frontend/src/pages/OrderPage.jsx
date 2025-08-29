// src/pages/OrdersPage.jsx

import React, { useState, useEffect } from "react";
import Navbar from "../components/nav";
import { apiService } from "../services/api";
import { Package, CheckCircle, Clock, XCircle, Edit2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleCancelOrder = async (orderId) => {
    if (window.confirm("ඔබට මෙම ඇණවුම අවලංගු කිරීමට අවශ්‍ය බව තහවුරු කරන්න?")) {
      try {
        await apiService.orders.cancelOrder(orderId);
        const response = await apiService.orders.getUserOrders(user.id);
        setOrders(response.data);
        alert(`Order #${orderId} successfully cancelled.`);
      } catch (err) {
        console.error("Failed to cancel order:", err);
        alert("ඇණවුම අවලංගු කිරීමේදී දෝෂයක් සිදුවිය. පසුව නැවත උත්සාහ කරන්න.");
      }
    }
  };

  const handleEditOrder = (orderId) => {
    alert(`ඇණවුම #${orderId} සංස්කරණය කිරීමට සූදානම්...`);
    // මෙහිදී ඔබව වෙනම සංස්කරණ පිටුවකට යොමු කළ හැක
    // navigate(`/orders/${orderId}/edit`);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        navigate('/login');
        return; 
      }
      
      try {
        const response = await apiService.orders.getUserOrders(user.id);
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("ඔබගේ orders ලබා ගැනීමේදී දෝෂයක් සිදුවිය. පසුව නැවත උත්සාහ කරන්න.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]); 

  const pendingOrders = orders.filter(order => order.status === 'PENDING');
  const shippedOrders = orders.filter(order => order.status === 'SHIPPED');
  const completedOrders = orders.filter(order => order.status === 'COMPLETED');
  const cancelledOrders = orders.filter(order => order.status === 'CANCELLED');
  
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'PENDING':
        return { text: 'Pending', icon: <Clock size={16} />, color: 'bg-yellow-100 text-yellow-800' };
      case 'SHIPPED':
        return { text: 'Shipped', icon: <Package size={16} />, color: 'bg-blue-100 text-blue-800' };
      case 'COMPLETED':
        return { text: 'Completed', icon: <CheckCircle size={16} />, color: 'bg-green-100 text-green-800' };
      case 'CANCELLED':
        return { text: 'Cancelled', icon: <XCircle size={16} />, color: 'bg-red-100 text-red-800' };
      default:
        return { text: status, icon: null, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const renderOrderCard = (order) => {
    const statusInfo = getStatusDisplay(order.status);
    const totalPrice = order.total_amount;

    return (
      <div key={order.order_id} className="bg-white rounded-xl shadow-md p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Order #{order.order_id}</h3>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
            {statusInfo.icon}
            {statusInfo.text}
          </div>
        </div>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Date:</span> {new Date(order.order_datetime).toLocaleDateString()}
        </p>
        <p className="text-gray-600 mb-4">
          <span className="font-semibold">Total:</span> Rs. {parseFloat(totalPrice).toFixed(2)}
        </p>
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Delivery Address:</h4>
          <p className="text-gray-600 text-sm">{order.delivery_address}</p>
        </div>

        {/* 'PENDING' තත්ත්වයේ ඇණවුම් සඳහා පමණක් බොත්තම් පෙන්වන්න */}
        {order.status === 'PENDING' && (
          <div className="mt-4 flex space-x-2 justify-end">
            <button
              onClick={() => handleEditOrder(order.order_id)}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 size={16} /> Edit Address
            </button>
            <button
              onClick={() => handleCancelOrder(order.order_id)}
              className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <X size={16} /> Cancel Order
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="h-16 w-full"></div>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          My Orders
        </h1>
        {loading && (
          <div className="text-center text-xl text-gray-600">
            Orders පූරණය වෙමින් පවතී...
          </div>
        )}
        {error && (
          <div className="text-center text-xl text-red-500 font-bold">
            {error}
          </div>
        )}
        {!loading && !error && (
          <div className="max-w-4xl mx-auto">
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-700 mb-6 flex items-center gap-3">
                <Clock size={28} /> Ongoing Orders
              </h2>
              {[...pendingOrders, ...shippedOrders].length > 0 ? (
                [...pendingOrders, ...shippedOrders].map(renderOrderCard)
              ) : (
                <p className="text-gray-500 text-lg">
                  ඔබගේ ongoing orders නොමැත.
                </p>
              )}
            </section>
            
            <hr className="my-8 border-gray-300" />

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-700 mb-6 flex items-center gap-3">
                <CheckCircle size={28} /> Completed Orders
              </h2>
              {completedOrders.length > 0 ? (
                completedOrders.map(renderOrderCard)
              ) : (
                <p className="text-gray-500 text-lg">
                  ඔබගේ completed orders නොමැත.
                </p>
              )}
            </section>

            <hr className="my-8 border-gray-300" />

            <section>
              <h2 className="text-3xl font-bold text-gray-700 mb-6 flex items-center gap-3">
                <XCircle size={28} /> Cancelled Orders
              </h2>
              {cancelledOrders.length > 0 ? (
                cancelledOrders.map(renderOrderCard)
              ) : (
                <p className="text-gray-500 text-lg">
                  ඔබගේ cancelled orders නොමැත.
                </p>
              )}
            </section>
          </div>
        )}
      </div>
    </>
  );
};

export default OrdersPage;