import React, { useState, useEffect } from "react";
import Navbar from "../components/nav";
import { apiService } from "../services/api";
import { Link, useParams } from "react-router-dom";
import ProductGrid from "../components/ProductsGrid";

const StorePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await apiService.categories.getAllCategories();
        const productsResponse = await apiService.products.getAvailableProducts();
        
        setCategories(categoriesResponse.data);
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

  return (
    <>
      <Navbar />
      <div className="h-16 w-full"></div>

      <div className="flex bg-gray-50 min-h-screen">
        {/* Categories Sidebar */}
        <div className="bg-black/80 shadow-lg left-0 backdrop-blur-sm hidden md:block w-72 text-white p-6 fixed top-16 h-screen overflow-y-auto">
          <h2 className="relative z-10 text-2xl font-bold mb-6">Categories</h2>
          <div className="relative z-10 space-y-4">
            {categories.map((category) => (
              <Link to={`/store/${category.category_id}`} key={category.category_id}>
                <div className="relative shadow-lg rounded-xl overflow-hidden cursor-pointer h-20 transform hover:scale-105 transition my-5">
                  <div className="absolute inset-0 transform w-70">
                    <div
                      className="absolute inset-0 bg-cover bg-center scale-125 transition-transform duration-300 group-hover:scale-150"
                      style={{ backgroundImage: `url(${category.image_url})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                    </div>
                  </div>
                  <div className="relative h-full flex items-end justify-center p-4 z-10 transform">
                    <h3 className="text-lg font-semibold text-white text-center">
                      {category.category_name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:ml-72 flex-1 p-20"> {/* md:ml-72 එකතු කරන්න */}
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center gap-4">Our Products</h1>
          <ProductGrid 
            selectedCategoryId={categoryId} 
            allProducts={products}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </>
  );
};

export default StorePage;