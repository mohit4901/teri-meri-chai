import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import FloatingCartButton from "./components/FloatingCartButton";

import Welcome from "./pages/Welcome";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import OrderForm from "./pages/OrderForm";
import VerifyOrder from "./pages/VerifyOrder";

const App = () => {
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
