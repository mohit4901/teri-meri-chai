import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

const FloatingCartButton = () => {
  return (
    <Link
      to="/cart"
      className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-xl cursor-pointer hover:bg-gray-800 transition"
    >
      <FiShoppingCart size={24} />
    </Link>
  );
};

export default FloatingCartButton;
