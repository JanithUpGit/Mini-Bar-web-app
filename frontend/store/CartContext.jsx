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
      // භාණ්ඩය දැනටමත් cart එකේ තිබේදැයි පරීක්ෂා කිරීම
      const existingItem = prevItems.find((item) => item.product_id === product.product_id);
      if (existingItem) {
        // තිබේ නම්, quantity එක වැඩි කිරීම
        return prevItems.map((item) =>
          item.product_id === product.product_id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // නැතහොත්, නව භාණ්ඩයක් ලෙස එකතු කිරීම
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

  // Cart එකේ තිබෙන මුළු භාණ්ඩ ගණන
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Cart එකේ මුළු මිල ගණන
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, getTotalItems, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

// පහසුවෙන් Context එක භාවිතා කිරීම සඳහා custom hook එකක්
export const useCart = () => {
  return useContext(CartContext);
};
