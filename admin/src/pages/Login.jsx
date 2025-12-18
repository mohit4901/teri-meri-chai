import React, { useState } from "react";
import api from "../utils/api";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import { notifyError } from "../utils/notify";

const Login = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/user/admin-login", form);

      if (res.data.success) {
        login(res.data.token);
        navigate("/orders");
      } else {
        notifyError(res.data.message || "Login failed");
      }
    } catch (err) {
      notifyError(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          className="w-full mb-4 px-4 py-3 border rounded-lg"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          className="w-full mb-6 px-4 py-3 border rounded-lg"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full py-3 bg-blue-600 text-white rounded-lg">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
