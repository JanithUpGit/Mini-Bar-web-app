import React, { useState, useEffect } from "react";
import Navbar from "../components/nav";
import { apiService } from "../services/api";
import { useCart } from '../store/CartContext'; // Cart Context එක භාවිතා කිරීමට
import { ShoppingBag } from "lucide-react";
import ProductCard from "../components/ProductCard";

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
              <ProductCard product={product} key={product.product_id}/>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default StorePage;
