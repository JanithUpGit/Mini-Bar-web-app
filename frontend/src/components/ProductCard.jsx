import React from 'react';
import { useCart } from "../store/CartContext";
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom'; // Link component එක ආනයනය කරන්න

const ProductCard = ({ product}) => {
  const { addToCart } = useCart(); 

  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center text-center">
  <div className="w-full aspect-[4/5] rounded-lg mb-4 overflow-hidden">
    <img
      src={product.image_url}
      alt={product.product_name}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "https://placehold.co/200x200/cbd5e1/475569?text=Image";
      }}
    />
  </div>
  
  <p className="text-gray-500 text-sm font-semibold mb-1">{product.category}</p>
  <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight">{product.product_name}</h3>
  <p className="text-blue-600 font-bold text-xl">LKR {product.price}</p>

  <div className="flex space-x-2 mt-4 w-full">
    <button 
      className="flex-1 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
      onClick={() => addToCart(product)}>
      ADD TO CART
    </button>
    <Link 
      to={`/products/${product.product_id}`} 
      className="p-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition flex items-center justify-center"
      title="View Details">
      <ShoppingBag size={20} />
    </Link>
  </div>
</div>

  );
};

export default ProductCard;