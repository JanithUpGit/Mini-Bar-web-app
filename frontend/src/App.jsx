import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./store/CartContext";
import { AuthProvider} from "./store/AuthContext"; 
import { useAuth } from "./hooks/useAuth";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminDashboardPage from "./pages/AdminDashbordPage";
import RegisterPage from "./pages/RegisterPage";
import StorePage from "./pages/StorePage";
import OrdersPage from "./pages/OrderPage";
import CartPage from "./pages/CartPage";
import { Contact } from "lucide-react";
import ContactPage from "./pages/ContactPage";

function AppContent() {
  const { loading } = useAuth();
  if (loading) return <p>Checking authentication...</p>;

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/store" element={<StorePage />} />
      <Route path="/store/:categoryId" element={<StorePage />} /> {/* නව Route එක */}
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/dashboard" element={<AdminDashboardPage />} />

      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}