import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ loading: true, user: null });

useEffect(() => {
  const checkAuth = async () => {
    try {
      console.log("🔍 Checking auth...");
      const res = await authAPI.getProfile();
      console.log("✅ Auth response:", res);
      setAuth({ loading: false, user: res.user });
    } catch (err) {
      console.error("❌ Auth error:", err);
      setAuth({ loading: false, user: null });
    }
  };

  checkAuth();
}, []);


  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
