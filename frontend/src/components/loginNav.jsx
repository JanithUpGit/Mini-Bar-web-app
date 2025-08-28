import React, { useState } from "react";
import { Link } from "react-router-dom"; // Link component එක භාවිතයට
import { Menu, X } from "lucide-react"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 text-2xl font-bold text-blue-600">
            <Link to="/">MyBrand</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">Login</Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600 transition">Register</Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-blue-100">Login</Link>
          <Link to="/register" className="block px-4 py-2 text-gray-700 hover:bg-blue-100">Register</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
