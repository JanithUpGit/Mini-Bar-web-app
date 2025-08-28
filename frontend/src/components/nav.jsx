import React, { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react"; 

import { useCart } from "../../store/CartContext";
import { useAuth } from "../../store/AuthContext";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();
  
  const { user } = useAuth();
  console.log(user);
  const isAdmin = user?.role === 'ADMIN';

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-bold text-blue-600">
            Mini Bar
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <a href="/" className="text-gray-700 hover:text-blue-600 transition">Home</a>
            <a href="/offers" className="text-gray-700 hover:text-blue-600 transition">Offers</a>
             <a href="/store" className="text-gray-700 hover:text-blue-600 transition">Store</a>
            <a href="/orders" className="text-gray-700 hover:text-blue-600 transition">Orders</a>
            <a href="/contact" className="text-gray-700 hover:text-blue-600 transition">Contact</a>
            
            
            {/* Admin පමණක් Dashboard දකිනු ඇත */}
            {isAdmin && (
              <a href="/dashboard" className="text-gray-700 hover:text-blue-600 transition">Dashboard</a>
            )}

            {/* Cart Icon */}
            <div className="relative">
              <a href="/cart" className="text-gray-700 hover:text-blue-600 transition">
                <ShoppingCart size={28} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </a>
            </div>
          </div>

          {/* Mobile Hamburger and Cart Icon */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Cart Icon for mobile */}
            <div className="relative">
              <a href="/cart" className="text-gray-700 focus:outline-none">
                <ShoppingCart size={28} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </a>
            </div>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-blue-100">Home</a>
          <a href="/offers" className="block px-4 py-2 text-gray-700 hover:bg-blue-100">Offers</a>
          <a href="/store" className="block px-4 py-2 text-gray-700 hover:bg-blue-100">Store</a>
          <a href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-blue-100">Orders</a>
          <a href="/contact" className="block px-4 py-2 text-gray-700 hover:bg-blue-100">Contact</a>
          
          {isAdmin && (
             <a href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-blue-100">Dashboard</a>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
