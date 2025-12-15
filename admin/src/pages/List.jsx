import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { notifySuccess } from "../utils/notify";

const List = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await api.get("/api/product/list");
    setProducts(res.data.products || []);
  };

  const deleteProduct = async (id) => {
    await api.post("/api/product/remove", { productId: id });
    notifySuccess("Deleted");
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Product List</h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Image</th>
            <th className="p-3">Name</th>
            <th className="p-3">Price</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b">
              <td className="p-3">
                <img src={p.image?.[0]} className="w-16 h-16 object-cover rounded" />
              </td>
              <td className="p-3">{p.name}</td>
              <td className="p-3">₹{p.price}</td>
              <td className="p-3">
                <button
                  onClick={() => deleteProduct(p._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td colSpan="4" className="p-3 text-center">No Products Found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default List;
