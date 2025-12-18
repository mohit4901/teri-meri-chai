import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// 🔐 Attach token EXCEPT on admin-login
api.interceptors.request.use((config) => {
  if (!config.url.includes("/admin-login")) {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
