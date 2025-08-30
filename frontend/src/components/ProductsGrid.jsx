import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ selectedCategoryId, allProducts, loading, error }) => {
  if (loading) {
    return (
      <div className="text-center text-xl text-gray-600">
        Products පූරණය වෙමින් පවතී...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-xl text-red-500 font-bold">{error}</div>
    );
  }
  
  const filteredProducts = selectedCategoryId
    ? allProducts.filter(
        (product) => product.category_id.toString() === selectedCategoryId
      )
    : allProducts.slice(0, 20);

  return (
   <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
  {filteredProducts.map((product) => (
    <ProductCard product={product} key={product.product_id} />
  ))}
</div>
  );
};

export default ProductGrid;