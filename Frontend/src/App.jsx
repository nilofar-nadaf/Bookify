import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Login_Register from "./pages/Login_Register";
import Shop from "./pages/Shop";
import BookDetails from "./pages/BookDetails";
import CategoryPage from "./pages/Categories";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProfile from "./pages/AdminProfile";

import "./index.css";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/auth" element={<Login_Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </>
  );
}

export default App;