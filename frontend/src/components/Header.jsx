import React from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/images/home-header-background.jpg";

const Header = () => {
  return (
    <section
      className="relative text-white py-40 text-center" // "relative" class එක එකතු කරන්න
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >

      <div className="absolute inset-0 bg-black opacity-50"></div> {/* opacity එක වෙනස් කරන්න පුළුවන් */}

      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to Mini Bar 🍹
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Discover the best drinks, snacks & more – anytime, anywhere.
        </p>
        <Link
          to="/products"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Explore Menu
        </Link>
      </div>
    </section>
  );
};

export default Header;