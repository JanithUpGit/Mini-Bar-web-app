import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/nav";
import { apiService } from "../services/api";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";
import CategoryCard from "../components/CategoryCard";
import ReadyToOrder from "../components/ReadyToOrder";

const HomePage = () => {
  const [data, setData] = useState({
    categories: [],
    products: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          apiService.categories.getAllCategories(),
          apiService.products.getAvailableProducts(),
        ]);

        setData({
          categories: categoriesResponse.data,
          products: productsResponse.data,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setData(prevData => ({
          ...prevData,
          loading: false,
          error: "Failed to load data. Please try again later.",
        }));
      }
    };

    fetchData();
  }, []); 

  const { categories, products, loading, error } = data;

  return (
    <>
      <Navbar />
      <div className="bg-gray-50">
        <Header />

        {/* Conditional rendering based on state */}
        {loading && (
          <div className="text-center py-12 text-gray-600">Loading data...</div>
        )}
        {error && (
          <div className="text-center py-12 text-red-500 font-bold">{error}</div>
        )}

        {!loading && !error && (
          <>
            <section className="max-w-6xl mx-auto py-12 px-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Categories
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.map((cat) => (
                  <CategoryCard category={cat} key={cat.category_id} />
                ))}
              </div>
            </section>

            <section className="bg-gray-100 py-12 px-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Featured Products
              </h2>
              <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory">
                {products.slice(0, 10).map((product) => (
                  <div className="flex-none w-75 snap-center" key={product.product_id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
        <ReadyToOrder/>
       
      </div>
    </>
  );
};

export default HomePage;