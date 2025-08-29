// src/pages/PaymentPage.jsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";
import { CheckCircle, XCircle } from "lucide-react";
import { useCart } from "../store/CartContext";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [deliveryAddress, setDeliveryAddress] = useState(""); // delivery address සඳහා නව state එකක්
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { cartItems, clearCart } = useCart(); // clearCart ශ්‍රිතය import කරගන්න

  const navigate = useNavigate();

  // state එක නොමැති නම් නැවත cart එකට යොමු කරයි
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  if (!cartItems || cartItems.length === 0) {
    return null; // Redirecting...
  }

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!deliveryAddress) {
      setError("කරුණාකර බෙදාහැරීමේ ලිපිනය ඇතුළත් කරන්න.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
        delivery_address: deliveryAddress, // state එක භාවිතා කරයි
      };

      await apiService.orders.createOrder(orderData);
      
      clearCart(); // ඇණවුම සාර්ථක වූ පසු Cart එක හිස් කරයි

      setSuccess(true);

      // තත්පර 3කට පසු සාර්ථක පණිවිඩය පෙන්වා navigate කිරීමට
      setTimeout(() => {
        navigate("/orders"); // orders පිටුවට යොමු කරයි
      }, 3000);
    } catch (err) {
      console.error("Failed to place order:", err);
      // backend එකෙන් ලැබෙන error පණිවිඩය පෙන්වීමට
      setError(
        err.response?.data?.error || "ඇණවුම සිදු කිරීමේදී දෝෂයක් සිදුවිය. නැවත උත්සාහ කරන්න."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-4">
        <CheckCircle size={64} className="text-green-500 animate-bounce" />
        <h2 className="text-3xl font-bold text-green-700 mt-4">Order Placed Successfully!</h2>
        <p className="text-green-600 mt-2">ඔබගේ ඇණවුම සාර්ථකව සිදු විය.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden md:flex">
        <div className="md:w-2/3 p-6 md:p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Payment Details</h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-700">Delivery Address</h3>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              rows="4"
              placeholder="Enter your delivery address here..."
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
            ></textarea>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-700">Select Payment Method</h3>
            <div className="flex items-center space-x-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-radio text-blue-600 h-5 w-5"
                />
                <span className="ml-2 text-gray-700">Card Payment</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-radio text-blue-600 h-5 w-5"
                />
                <span className="ml-2 text-gray-700">Cash on Delivery</span>
              </label>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center">
              <XCircle size={20} className="mr-2" />
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-lg text-white transition-colors duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>

        <div className="md:w-1/3 bg-gray-50 p-6 md:p-10 border-t md:border-t-0 md:border-l border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
          <ul className="space-y-3 mb-6">
            {cartItems.map((item, index) => (
              <li key={index} className="flex justify-between items-center text-sm text-gray-600">
                <span className="font-medium text-gray-700">
                  {item.product_name} x {item.quantity}
                </span>
                <span className="font-semibold text-gray-800">
                  Rs. {(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-300 pt-4">
            <div className="flex justify-between items-center font-bold text-gray-800 text-lg">
              <span>Total Amount</span>
              <span>Rs. {totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;