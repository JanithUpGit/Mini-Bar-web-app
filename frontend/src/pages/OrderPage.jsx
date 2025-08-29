import React, { useState, useEffect } from "react";
import Navbar from "../components/nav";
import { apiService } from "../services/api";
import { useAuth } from '../store/AuthContext';
import { Package, CheckCircle, Clock } from "lucide-react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Auth context එකෙන් user ගේ තොරතුරු ලබා ගනිමු
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchOrders = async () => {
      // පරිශීලකයෙක් login වී ඇත්දැයි පරීක්ෂා කරමු
      if (!user) {
        setLoading(false);
        setError("ඔබගේ orders බැලීම සඳහා ඔබ log in විය යුතුය.");
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
  }, [user]); // user state එක වෙනස් වන විට නැවත දත්ත ලබා ගනිමු

  // Pending සහ Completed orders වෙන් කරමු
  const pendingOrders = orders.filter(order => order.status === 'PENDING');
  const completedOrders = orders.filter(order => order.status === 'COMPLETED');

  const renderOrderCard = (order, status) => {
    // total_price එක නැතිනම් එය ගණනය කරමු
    const totalPrice = order.total_price || order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return (
      <div key={order.order_id} className="bg-white rounded-xl shadow-md p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Order #{order.order_id}</h3>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
          }`}>
            {status === 'PENDING' ? <Clock size={16} /> : <CheckCircle size={16} />}
            {status === 'PENDING' ? 'Pending' : 'Completed'}
          </div>
        </div>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Date:</span> {new Date(order.order_date).toLocaleDateString()}
        </p>
        <p className="text-gray-600 mb-4">
          <span className="font-semibold">Total:</span> Rs. {totalPrice.toFixed(2)}
        </p>
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Items:</h4>
          <ul className="list-disc list-inside space-y-1">
            {order.items.map((item, index) => (
              <li key={index} className="text-gray-600 text-sm">
                {item.product_name} x {item.quantity} - Rs. {(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
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
          <>
            {/* Pending Orders */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-700 mb-6 flex items-center gap-3">
                <Clock size={28} /> Pending Orders
              </h2>
              {pendingOrders.length > 0 ? (
                pendingOrders.map(order => renderOrderCard(order, 'PENDING'))
              ) : (
                <p className="text-gray-500 text-lg">
                  ඔබගේ pending orders නොමැත.
                </p>
              )}
            </section>

            {/* Completed Orders */}
            <section>
              <h2 className="text-3xl font-bold text-gray-700 mb-6 flex items-center gap-3">
                <CheckCircle size={28} /> Completed Orders
              </h2>
              {completedOrders.length > 0 ? (
                completedOrders.map(order => renderOrderCard(order, 'COMPLETED'))
              ) : (
                <p className="text-gray-500 text-lg">
                  ඔබගේ completed orders නොමැත.
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default OrdersPage;
