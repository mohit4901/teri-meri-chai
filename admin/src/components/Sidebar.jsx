import React from "react";
import { NavLink } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const Sidebar = () => {
  const { logout } = useAdminAuth();

  const linkClass =
    "block py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-200 transition";

  return (
    <div className="w-64 bg-white h-screen shadow-md p-4 flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Panel</h2>

      <NavLink to="/orders" className={linkClass}>
        Orders
      </NavLink>

      <NavLink to="/add" className={linkClass}>
        Add Product
      </NavLink>

      <NavLink to="/list" className={linkClass}>
        Product List
      </NavLink>

      <NavLink to="/menu" className={linkClass}>
        Menu List
      </NavLink>

      <NavLink to="/menu/add" className={linkClass}>
        Add Menu Item
      </NavLink>

      <NavLink to="/kitchen" className={linkClass}>
        Kitchen Panel
      </NavLink>

      <button
        onClick={logout}
        className="mt-auto py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
