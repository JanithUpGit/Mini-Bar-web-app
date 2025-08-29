// src/components/admin/ManageProducts.jsx

import React from 'react';

const ManageProducts = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Products</h2>
      <p className="text-gray-600">
        සියලුම නිෂ්පාදන මෙහි කළමනාකරණය කරන්න.
      </p>
      {/* මෙහිදී ඔබට products ලැයිස්තුවක්, add new product button එකක් සහ search bar එකක් එකතු කළ හැක */}
    </div>
  );
};

export default ManageProducts;