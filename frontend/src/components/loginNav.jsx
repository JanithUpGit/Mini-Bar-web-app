import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import bgImage from "../assets/images/navlogo.png"; // logo image

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black/80 shadow-lg fixed w-full top-0 left-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo + Brand */}

          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center">
              <img
                src={bgImage}
                alt="Logo"
                className="h-40 pt-3 w-auto object-contain"
              />
              <span className="ml-2 text-2xl font-bold text-red-500 hover:text-red-400 transition">
                Sarasavi Wine Stores
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/login"
              className="text-gray-200 hover:text-red-500 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-gray-200 hover:text-red-500 transition"
            >
              Register
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
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
          <Link
            to="/login"
            className="block px-4 py-2 text-gray-200 hover:bg-red-700"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block px-4 py-2 text-gray-200 hover:bg-red-700"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
