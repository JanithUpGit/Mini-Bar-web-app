import React from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/images/home-header-background.jpg";
import textImg from "../assets/images/navlogo.png";

const Header = () => {
  return (
    <section
      className="relative text-white py-20 text-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        <img
          src={textImg}
          alt="S M Wine Stores Logo"
          className="w-200 mb-6" 
        />
      </div>
    </section>
  );
};

export default Header;