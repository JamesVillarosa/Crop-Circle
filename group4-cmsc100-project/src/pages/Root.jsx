import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./Login";
import Signup from "./Signup";
import AdminLogin from "./AdminLogin";
import WelcomePage from "./WelcomePage";
import Homepage from "./user/Homepage";
import MartPage from "./user/mart/MartPage";
import CartPage from "./user/cart/CartPage";
import OrderPage from "./user/order/OrderPage";
import AdminOrderPage from "./admin/components/order/AdminOrderPage";
import AdminHomepage from "./admin/AdminHomepage";
import UserAccounts from "./admin/components/user/UserAccounts";
import ProductListing from "./admin/components/products/ProductPage";
import Reports from "./admin/components/reports/ReportsPage";
import Admin from "./admin/Admin";

function Root() {
  // Set these conditions for actual implementation
  const isUserSignedIN = !!localStorage.getItem("token");
  const isAdminSignedIN =
    !!localStorage.getItem("token") && location.pathname.startsWith("/admin");

  // Set these conditions for checking.
  // const isUserSignedIN = true;
  // const isAdminSignedIN = true;

  return (
    <div>
      <Navbar />

      <Routes>
        {/* Initial Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* For the User side */}
        {isUserSignedIN && <Route path="/home" element={<Homepage />} />}
        {isUserSignedIN && <Route path="/order" element={<OrderPage />} />}
        {isUserSignedIN && <Route path="/mart" element={<MartPage />} />}
        {isUserSignedIN && <Route path="/cart" element={<CartPage />} />}

        {/* For the Admin side */}
        {isAdminSignedIN && (
          <Route path="/admin/home" element={<AdminHomepage />} />
        )}
        {isAdminSignedIN && (
          <Route path="/admin/users" element={<UserAccounts />} />
        )}
        {isAdminSignedIN && (
          <Route path="/admin/products" element={<ProductListing />} />
        )}
        {isAdminSignedIN && <Route path="/admin/orders" element={<AdminOrderPage />} />}
        {isAdminSignedIN && (
          <Route path="/admin/reports" element={<Reports />} />
        )}
        {isAdminSignedIN && (
          <Route path="/admin/edit" element={<Admin />} />
        )}
      </Routes>
    </div>
  );
}

export default Root;
