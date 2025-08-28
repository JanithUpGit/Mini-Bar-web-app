import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // icons

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-bold text-blue-600">
            MyBrand
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 transition">Home</a>
            <a href="/about" className="text-gray-700 hover:text-blue-600 transition">About</a>
            <a href="/services" className="text-gray-700 hover:text-blue-600 transition">Services</a>
            <a href="/contact" className="text-gray-700 hover:text-blue-600 transition">Contact</a>
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
          <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-blue-100">Home</a>
          <a href="/about" className="block px-4 py-2 text-gray-700 hover:bg-blue-100">About</a>
          <a href="/services" className="block px-4 py-2 text-gray-700 hover:bg-blue-100">Services</a>
          <a href="/contact" className="block px-4 py-2 text-gray-700 hover:bg-blue-100">Contact</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
