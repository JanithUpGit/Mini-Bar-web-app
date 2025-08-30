// src/pages/CartPage.jsx

import React from "react";
import Navbar from "../components/nav";
import { Link } from "react-router-dom";
import { useCart } from "../store/CartContext";
import { ShoppingCart, Trash2, ArrowLeft } from "lucide-react";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
  };
  const isCartEmpty = cartItems.length === 0;

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 mt-14 md:p-8 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center">
            <ArrowLeft size={20} className="mr-1" /> Back to Products
          </Link>
        </div>

        {isCartEmpty ? (
          <div className="text-center py-20">
            <ShoppingCart size={64} className="text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">Your cart is empty.</p>
            <p className="text-gray-500">Add some products to your cart to see them here.</p>
            <Link
              to="/"
              className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Go to Store
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Remove</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <tr key={item.product_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-20 h-20">
                            <img 
                              className="w-full h-full object-cover rounded-md" 
                              src={item.image_url || "https://placehold.co/80x80/cbd5e1/475569?text=Product"} 
                              alt={item.product_name}
                            />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-sm font-semibold text-gray-900">{item.product_name}</h3>
                            <p className="text-xs text-gray-500">{item.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Rs. {parseFloat(item.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="px-2 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-4 text-sm text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="px-2 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                        Rs. {(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex justify-end">
              <div className="w-full max-w-sm">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Cart Total</h2>
                  <div className="flex justify-between items-center text-xl font-semibold text-gray-700">
                    <p>Subtotal:</p>
                    <p>Rs. {calculateTotalPrice().toFixed(2)}</p>
                  </div>
                  <Link
                    to="/checkout"
                    className="mt-6 w-full inline-block text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;