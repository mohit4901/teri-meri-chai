import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import FloatingCartButton from "./components/FloatingCartButton";

import Welcome from "./pages/Welcome";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import OrderForm from "./pages/OrderForm";
import VerifyOrder from "./pages/VerifyOrder";

const App = () => {

  // 🔥 BACKEND WAKE-UP PING (ONCE)
  useEffect(() => {
    fetch("https://ytmc-backend.onrender.com/api/health")
      .then(() => console.log("✅ Backend awake"))
      .catch(() => console.log("⚠️ Backend sleeping / cold start"));
  }, []);

  return (
    <>
      <Navbar />
      <FloatingCartButton />

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order" element={<OrderForm />} />
        <Route path="/verify" element={<VerifyOrder />} />
      </Routes>
    </>
  );
};

export default App;
