import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "../store/CartContext";
import { useAuth } from "../hooks/useAuth";
import bgImage from "../assets/images/navlogo.png"; // logo image

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();
  const { user } = useAuth();
  console.log(user);
  const isAdmin = user?.user_role === 'ADMIN';

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <nav className="bg-black/80 shadow-lg fixed w-full top-0 left-0 z-50 backdrop-blur-sm">
      <div className="mx-10 px-4 ">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo + Brand */}
          <div>
            <Link to="/">
              <img
                src={bgImage}
                alt="Logo"
                className="h-16 top-1 w-auto  fixed"
              />

            </Link>
          </div>
          <div className="hidden md:flex md:space-x-10 items-center">
            {/* Navigation Links */}
            <div className="w-20"></div>
            <Link to="/" className="text-gray-200 hover:text-red-500 transition">Home</Link>
            <Link to="/store" className="text-gray-200 hover:text-red-500 transition">Store</Link>
            <Link to="/orders" className="text-gray-200 hover:text-red-500 transition">Orders</Link>
            <Link to="/contact" className="text-gray-200 hover:text-red-500 transition">Contact</Link>
            
            
            {/* Show Dashboard only to admins */}
            {isAdmin && (
              <Link to="/dashboard" className="text-gray-200 hover:text-red-500 transition">Dashboard</Link>
            )}

            {/* Cart Icon */}
            <div className="relative">
              <Link to="/cart" className="text-gray-200 hover:text-red-500 transition">
                <ShoppingCart size={28} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Login / User avatar */}
            {user ? (
              <Link 
                to="/profile" 
                className="flex items-center space-x-1 text-gray-200 hover:text-red-500 transition ml-10"
                title={user.user_email|| 'User profile'}
              >
                <div className="h-10 w-10 bg-red-600 text-white font-bold rounded-full flex items-center justify-center border-2 border-red-600">
                  {getInitials(user.user_email)}
                </div>
                <p className="ml-2">{user.user_email}</p>
              </Link>
              
            ) : (
              <Link to="/login" className="text-gray-200 hover:text-red-500 transition">
                Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger and cart icon */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Cart Icon for mobile */}
            <div className="relative">
              <Link to="/cart" className="text-gray-200 focus:outline-none">
                <ShoppingCart size={28} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
            
            {/* Mobile login / user avatar */}
            {user ? (
              <Link 
                to="/profile" 
                className="focus:outline-none"
                title={user.user_email || 'User profile'}
              >
                <div className="h-10 w-10 bg-red-600 text-white font-bold rounded-full flex items-center justify-center border-2 border-red-600">
                  {getInitials(user.name || user.email)}
                </div>
              </Link>
            ) : (
              <Link to="/login" className="text-gray-200 hover:text-red-500 transition">
                Login
              </Link>
            )}
            
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-200 focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden bg-black/90 border-t border-red-600 shadow-lg">
          <Link to="/" className="block px-4 py-2 text-gray-200 hover:bg-red-700">Home</Link>
          <Link to="/offers" className="block px-4 py-2 text-gray-200 hover:bg-red-700">Offers</Link>
          <Link to="/store" className="block px-4 py-2 text-gray-200 hover:bg-red-700">Store</Link>
          <Link to="/orders" className="block px-4 py-2 text-gray-200 hover:bg-red-700">Orders</Link>
          <Link to="/contact" className="block px-4 py-2 text-gray-200 hover:bg-red-700">Contact</Link>
          
          {isAdmin && (
             <Link to="/dashboard" className="block px-4 py-2 text-gray-200 hover:bg-red-700">Dashboard</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;