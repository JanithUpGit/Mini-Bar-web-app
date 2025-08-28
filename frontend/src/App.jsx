import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashbordPage';
import RegisterPage from './pages/RegisterPage';
import { CartProvider } from '../store/CartContext';
import { AuthProvider, useAuth } from '../store/AuthContext';
import StorePage from './pages/StorePage';
import OrdersPage from './pages/OrderPage';

// Protected route component එක
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
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
        
        {/* Dashboard එකට ඇතුළු වීමට ADMIN role එක අවශ්‍ය වේ */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredRole="ADMIN">
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
