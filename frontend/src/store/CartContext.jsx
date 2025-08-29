// src/context/CartContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';

// Context එක නිර්මාණය කිරීම
const CartContext = createContext();

// CartProvider component එක නිර්මාණය කිරීම
export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCartItems = localStorage.getItem('cartItems');
      return storedCartItems ? JSON.parse(storedCartItems) : [];
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cartItems]);

  // භාණ්ඩයක් cart එකට එකතු කිරීම
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product_id === product.product_id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product_id === product.product_id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // භාණ්ඩයක් cart එකෙන් ඉවත් කිරීම
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product_id !== productId)
    );
  };

  // භාණ්ඩයක ප්‍රමාණය යාවත්කාලීන කිරීම සඳහා නව ශ්‍රිතයක් එකතු කිරීම (මෙය cart page එකට වැදගත්)
  const updateQuantity = (productId, quantity) => {
    setCartItems((prevItems) => 
      prevItems.map(item => 
        item.product_id === productId ? { ...item, quantity: quantity } : item
      ).filter(item => item.quantity > 0)
    );
  };

  // Cart එකේ තිබෙන මුළු භාණ්ඩ ගණන
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Cart එකේ මුළු මිල ගණන
  const getTotalPrice = () => {
    // price එක float එකක් බවට හැරවීම
    return cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2);
  };

  // Cart එක හිස් කිරීමේ ශ්‍රිතයක් එකතු කිරීම
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};