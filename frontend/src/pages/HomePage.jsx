import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react"; 
import Navbar from "../components/nav";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch data from backend API
  useEffect(() => {
    
    

    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="h-16 w-full"></div> 
      
      <div className="bg-gray-50">
        <section className="bg-gradient-to-r from-blue-600 to-green-500 text-white py-20 text-center">
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
        </section>

        {/* Categories */}
        <section className="max-w-6xl mx-auto py-12 px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.category_id}
                className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-gray-700">
                  {cat.category_name}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-gray-100 py-12 px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <div
                key={product.product_id}
                className="bg-white shadow-md rounded-xl p-4 hover:shadow-xl transition"
              >
                <div className="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <ShoppingBag className="text-gray-400 w-10 h-10" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">
                  {product.product_name}
                </h3>
                <p className="text-gray-500 text-sm mb-2">{product.description}</p>
                <p className="text-blue-600 font-bold">Rs. {product.price}</p>
                <button className="mt-3 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Order? 🚀
          </h2>
          <p className="text-gray-600 mb-6">
            Sign up today and enjoy the best bar experience online.
          </p>
          <div className="space-x-4">
            <Link
              to="/register"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Login
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
