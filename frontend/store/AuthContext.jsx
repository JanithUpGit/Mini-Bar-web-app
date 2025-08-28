// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Context එක නිර්මාණය කිරීම
const AuthContext = createContext();

// AuthProvider component එක නිර්මාණය කිරීම
export const AuthProvider = ({ children }) => {
  // පරිශීලකයාගේ දත්ත state එකක ගබඩා කිරීම. ආරම්භයේදී null වේ.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // යෙදුම ආරම්භයේදී පරිශීලකයාගේ තත්ත්වය පරීක්ෂා කිරීම
  useEffect(() => {

    const checkUserStatus = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        // user ගේ role එක සමඟ දත්ත parse කරගන්න
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    checkUserStatus();
  }, []);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // පරිශීලකයා ලොග් අවුට් වූ විට ක්‍රියාත්මක වන function එක
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };
  
  // සරල register function එකක්
  const register = (userData) => {
    // මෙහිදී ඔබගේ register logic එක එකතු කළ හැකිය
    // සාර්ථක වුවහොත්, login function එක කැඳවන්න
    login(userData);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// පහසුවෙන් Context එක භාවිතා කිරීම සඳහා custom hook එකක්
export const useAuth = () => {
  return useContext(AuthContext);
};
