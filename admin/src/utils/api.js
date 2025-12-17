import axios from "axios";

const backend = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: backend,
  headers: {
    "Content-Type": "application/json"
  }
});

// ✅ Inject token properly
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // 🔥 MAIN FIX
  }

  return config;
});

export default api;
