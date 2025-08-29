import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import Navbar from "../components/nav";
import { useCart } from "../store/CartContext";
import { apiService } from "../services/api";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading තත්ත්වය කළමනාකරණයට
  const [error, setError] = useState(null); // දෝෂ පණිවිඩ සඳහා

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const categoriesResponse =
          await apiService.categories.getAllCategories();
        setCategories(categoriesResponse.data);

        const productsResponse =
          await apiService.products.getAvailableProducts();
        setProducts(productsResponse.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("දත්ත ලබා ගැනීමේදී දෝෂයක් සිදුවිය. පසුව නැවත උත්සාහ කරන්න.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  console.log("products", products);

  return (
    <>
      <div className="h-16 w-full"></div>
      <Navbar />
      <div className="bg-gray-50">
        <Header />
        {/* Loading සහ Error තත්ත්වයන් කළමනාකරණය */}
        {loading && (
          <div className="text-center py-12 text-gray-600">
            දත්ත ලබා ගනිමින් පවතී...
          </div>
        )}
        {error && (
          <div className="text-center py-12 text-red-500 font-bold">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <section className="max-w-6xl mx-auto py-12 px-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Categories
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.map((cat) => (
                  <div
                    key={cat.category_id}
                    className="relative shadow-lg rounded-xl overflow-hidden cursor-pointer h-64 transform -skew-x-6 hover:scale-105 transition"
                  >
                    {/* Inner wrapper to cancel skew */}
                    <div className="absolute inset-0 transform w-70 skew-x-6">
                      {/* Background Image */}
                      <div
                        className="absolute inset-0 bg-cover bg-center scale-125 transition-transform duration-300 group-hover:scale-150"
                        style={{ backgroundImage: `url(${cat.image_url})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex items-end justify-center p-4 z-10 transform skew-x-6">
                      <h3 className="text-lg font-semibold text-white text-center">
                        {cat.category_name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Products */}
            <section className="bg-gray-100 py-12 px-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Featured Products
              </h2>
              <div className="flex overflow-x-auto gap-6 pb-4">
                {products.slice(0, 10).map((product) => (
                  <div className="flex-none  ">
                    <ProductCard product={product} key={product.product_id} />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

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
