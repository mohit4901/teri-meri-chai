import axios from "axios";

const backend = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: backend,
  headers: {
    "Content-Type": "application/json"
  }
});

// Inject token in all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.token = token;
  return config;
});

export default api;
