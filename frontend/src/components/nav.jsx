import React, { useState } from "react";
import { Menu, X, ShoppingCart, LogIn, LogOut } from "lucide-react";
import { useCart } from "../store/CartContext";
import { useAuth } from "../hooks/useAuth";// AuthContext එක ආනයනය කරන්න

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();
  const { user } = useAuth(); // useAuth හුක් එක භාවිත කරන්න
  console.log(user);
  const isAdmin = user?.role === 'ADMIN';

  const getInitials = (name) => {
    if (!name) return 'U'; // Display 'U' if no name is available
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-bold text-blue-600">
            Mini Bar
          </div>

          {/* Desktop Menu and Auth */}
          <div className="hidden md:flex space-x-8 items-center">
            {/* Navigation Links */}
            <a href="/" className="text-gray-700 hover:text-blue-600 transition">Home</a>
            <a href="/offers" className="text-gray-700 hover:text-blue-600 transition">Offers</a>
            <a href="/store" className="text-gray-700 hover:text-blue-600 transition">Store</a>
            <a href="/orders" className="text-gray-700 hover:text-blue-600 transition">Orders</a>
            <a href="/contact" className="text-gray-700 hover:text-blue-600 transition">Contact</a>
            
            
            {/* Show Dashboard only to admins */}
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

            {/* Login / User avatar */}
            {user ? (
              <a 
                href="/profile" 
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition ml-10"
                title={user.user_email|| 'User profile'}
              >
                <div className="h-10 w-10 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center border-2 border-blue-600">
                  {getInitials(user.user_email)}
                </div>
                <p className="ml-2">{user.user_email}</p>
              </a>
              
            ) : (
              <a href="/login" className="text-blue-600 hover:underline font-medium">
                Login
              </a>
            )}
          </div>

          {/* Mobile hamburger and cart icon */}
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
            
            {/* Mobile login / user avatar */}
            {user ? (
              <a 
                href="/profile" 
                className="focus:outline-none"
                title={user.user_email || 'User profile'}
              >
                <div className="h-10 w-10 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center border-2 border-blue-600">
                  {getInitials(user.name || user.email)}
                </div>
              </a>
            ) : (
              <a href="/login" className="text-blue-600 hover:underline font-medium">
                Login
              </a>
            )}
            
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
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
