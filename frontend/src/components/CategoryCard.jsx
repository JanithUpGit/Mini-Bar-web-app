import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <Link to={`/store/${category.category_id}`}>
      <div
        key={category.category_id}
        className="relative shadow-lg rounded-xl overflow-hidden cursor-pointer h-64 transform -skew-x-6 hover:scale-105 transition"
      >
        <div className="absolute inset-0 transform w-70 skew-x-6">
          <div
            className="absolute inset-0 bg-cover bg-center scale-125 transition-transform duration-300 group-hover:scale-150"
            style={{ backgroundImage: `url(${category.image_url})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative h-full flex items-end justify-center p-4 z-10 transform skew-x-6">
          <h3 className="text-lg font-semibold text-white text-center">
            {category.category_name}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;