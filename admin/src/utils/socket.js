import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["polling", "websocket"], // 🔥 hybrid (BEST for free)
  upgrade: true,
  autoConnect: false,
  withCredentials: true,

  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  timeout: 20000
});
