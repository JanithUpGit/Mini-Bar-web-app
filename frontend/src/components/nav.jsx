import React, { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react"; // ShoppingCart icon
import { useCart } from "../../store/CartContext"; // useCart hook
import bgImage from "../assets/images/navlogo.png"; // logo image

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // useCart hook to get total cart items
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();

  const { user } = useAuth();
  console.log(user);
  const isAdmin = user?.role === "ADMIN";

  return (
    <nav className="bg-black/80 shadow-lg fixed w-full top-0 left-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo + Brand */}
          <div className="flex items-center space-x-3">
            <a href="/" className="flex items-center">
              <img
                src={bgImage}
                alt="Logo"
                className="h-40 pt-3 w-auto object-contain"
              />
              <span className="ml-2 text-2xl font-bold text-red-500 hover:text-red-400 transition">
                Sarasawi Wine Store
              </span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <a href="/" className="text-gray-200 hover:text-red-500 transition">
              Home
            </a>
            <a
              href="/products"
              className="text-gray-200 hover:text-red-500 transition"
            >
              Products
            </a>
            <a
              href="/about"
              className="text-gray-200 hover:text-red-500 transition"
            >
              About
            </a>
            <a
              href="/contact"
              className="text-gray-200 hover:text-red-500 transition"
            >
              Contact
            </a>

            {/* Cart Icon */}
            <div className="relative">
              <a
                href="/cart"
                className="text-gray-200 hover:text-red-500 transition"
              >
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
              <a href="/cart" className="text-gray-200 focus:outline-none">
                <ShoppingCart size={28} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </a>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-200 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-black/90 border-t border-red-600 shadow-lg">
          <a
            href="/"
            className="block px-4 py-2 text-gray-200 hover:bg-red-700"
          >
            Home
          </a>
          <a
            href="/products"
            className="block px-4 py-2 text-gray-200 hover:bg-red-700"
          >
            Products
          </a>
          <a
            href="/about"
            className="block px-4 py-2 text-gray-200 hover:bg-red-700"
          >
            About
          </a>
          <a
            href="/contact"
            className="block px-4 py-2 text-gray-200 hover:bg-red-700"
          >
            Contact
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
