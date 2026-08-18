import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import RouteTracker from "./components/RouteTracker";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import ShippingPolicy from "./pages/policies/ShippingPolicy";
import RefundPolicy from "./pages/policies/RefundPolicy";
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import TermsPolicy from "./pages/policies/TermsPolicy";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <RouteTracker />
            <Routes>
              {/* Admin (own layout, no site header/footer) */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
              </Route>

              {/* Site */}
              <Route
                path="*"
                element={
                  <>
                    <Header />
                    <CartDrawer />
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      <Route path="/shop/:category" element={<ShopPage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/order/:id" element={<OrderSuccessPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/account" element={<AccountPage />} />
                      <Route path="/policies/shipping" element={<ShippingPolicy />} />
                      <Route path="/policies/refunds" element={<RefundPolicy />} />
                      <Route path="/policies/privacy" element={<PrivacyPolicy />} />
                      <Route path="/policies/terms" element={<TermsPolicy />} />
                    </Routes>
                    <Footer />
                  </>
                }
              />
            </Routes>
            <Toaster position="top-center" richColors />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
