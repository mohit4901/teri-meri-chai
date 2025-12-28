import React, { useState } from "react";
import api from "../utils/api";
import { notifySuccess, notifyError } from "../utils/notify";

const MenuAdd = () => {
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [image, setImage] = useState(null);

  const addMenu = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      if (image) fd.append("image", image);

      await api.post("/api/menu/add", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      notifySuccess("Menu Item Added");
    } catch {
      notifyError("Failed to add menu item");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Add Menu Item</h1>

      <form onSubmit={addMenu} className="bg-white p-6 shadow rounded w-full md:w-1/2">

        <input
          type="text"
          placeholder="Name"
          required
          className="w-full p-3 border rounded mb-3"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <textarea
          placeholder="Description"
          required
          className="w-full p-3 border rounded mb-3"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="number"
          placeholder="Price"
          required
          className="w-full p-3 border rounded mb-3"
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          type="file"
          className="w-full mb-4"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded">
          Add Menu Item
        </button>
      </form>
    </div>
  );
};

export default MenuAdd;
