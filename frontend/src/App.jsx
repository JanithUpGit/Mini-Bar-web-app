import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashbordPage';
import RegisterPage from './pages/RegisterPage';
import { CartProvider } from '../store/CartContext';
import { AuthProvider } from '../store/AuthContext';
import StorePage from './pages/StorePage';
import OrdersPage from './pages/OrderPage';
const isAuthenticated = () => {
  // මෙහිදී ඔබගේ backend API එකට request එකක් යවා
  // පරිශීලකයාගේ session එක check කළ යුතුය.
  // දැනට, මෙය සරලව true හෝ false ලෙස සලකමු.
  // උදා: cookies check කිරීම
  const isLoggedIn = document.cookie.includes('connect.sid'); 
  return isLoggedIn;
};

// Protected route component එක
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
     <CartProvider> 
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/orders" element={ <ProtectedRoute><OrdersPage/> </ProtectedRoute>} />
        
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboardPage/>
            </ProtectedRoute>
          } 
        />
        

        <Route path="*" element={<h1>404: පිටුව සොයාගත නොහැක</h1>} />
      </Routes>
    </BrowserRouter>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;