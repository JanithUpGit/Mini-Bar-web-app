import React, { createContext, useState, useEffect } from "react";
import { authAPI } from "../services/api"; // authAPI එක නිවැරදි මාර්ගයෙන් import කරන්න
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ loading: true, user: null });

   const login = async () => {
    try {
      const res = await authAPI.getProfile();
      const userData = res.data.user;

      setAuth({ loading: false, user: userData });
      localStorage.setItem('user', JSON.stringify(userData));
      console.log("✅ Loggin and fetch user data from server.");

    } catch (err) {
      console.error("Login successful, but failed to fetch profile:", err);
      setAuth({ loading: false, user: null });
    }
  };
  const logout = async () => {
    try {
      // Server-side logout request එකක් යැවීම
      await authAPI.logout(); 
      console.log("✅ Logged out from server.");
    } catch (err) {
      console.error("❌ Failed to log out from server:", err);
    } finally {
      setAuth({ loading: false, user: null });
      localStorage.removeItem('user');
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      // මුලින්ම local storage එකෙන් user data ලබා ගැනීමට උත්සාහ කරන්න
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        setAuth({ loading: false, user: JSON.parse(storedUser) });
      } else {
        // local storage එකේ data නැතිනම්, server එකෙන් profile එක fetch කරන්න
        try {
          console.log("🔍 Fetching user profile from backend...");
          const res = await authAPI.getProfile();
          const userData = res.data.user;
          setAuth({ loading: false, user: userData });
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (err) {
          console.error("❌ Failed to fetch user profile:", err);
          setAuth({ loading: false, user: null });
        }
      }
    };
    
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};