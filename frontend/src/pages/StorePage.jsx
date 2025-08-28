import React, { useState, useEffect } from "react";
import Navbar from "../components/nav";
import { apiService } from "../services/api";
import { useCart } from '../../store/CartContext'; // Cart Context එක භාවිතා කිරීමට
import { ShoppingBag } from "lucide-react";

const StorePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToCart } = useCart(); // addToCart function එක ලබා ගනිමු

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiService.products.getAvailableProducts();
        setProducts(response.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("දත්ත ලබා ගැනීමේදී දෝෂයක් සිදුවිය. පසුව නැවත උත්සාහ කරන්න.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="h-16 w-full"></div> {/* Navbar එකට ඉඩ තැබීමට */}
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Our Products
        </h1>
        {loading && (
          <div className="text-center text-xl text-gray-600">
            Products පූරණය වෙමින් පවතී...
          </div>
        )}
        {error && (
          <div className="text-center text-xl text-red-500 font-bold">
            {error}
          </div>
        )}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.product_id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                {/* Product image */}
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ShoppingBag size={64} className="text-gray-400" />
                  )}
                </div>
                
                {/* Product details */}
                <div className="p-6 text-center">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {product.product_name}
                  </h2>
                  <p className="text-gray-600 mb-4 h-12 overflow-hidden text-sm">
                    {product.description}
                  </p>
                  <p className="text-green-600 font-bold text-xl mb-4">
                    Rs. {product.price}
                  </p>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default StorePage;
