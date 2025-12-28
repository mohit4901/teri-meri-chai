import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { notifySuccess } from "../utils/notify";

const MenuList = () => {
  const [menu, setMenu] = useState([]);

  const fetchMenu = async () => {
    const res = await api.get("/api/menu/list");
    console.log("MENU API RESPONSE:", res.data);
    setMenu(res.data.menu || res.data.data || []);
  };

  const deleteMenu = async (id) => {
    await api.delete(`/api/menu/delete/${id}`);
    notifySuccess("Menu item deleted");
    fetchMenu();
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Restaurant Menu</h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3">Image</th>
            <th className="p-3">Name</th>
            <th className="p-3">Price</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {menu.map((item) => (
            <tr key={item._id} className="border-b">
              <td className="p-3">
                {item.image ? (
                  <img src={item.image} className="w-16 h-16 rounded" />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">
                    No Image
                  </div>
                )}
              </td>
              <td className="p-3">{item.name}</td>
              <td className="p-3">₹{item.price}</td>
              <td className="p-3">
                <button
                  onClick={() => deleteMenu(item._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {menu.length === 0 && (
            <tr>
              <td className="p-3 text-center" colSpan="4">
                No Menu Items.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MenuList;
