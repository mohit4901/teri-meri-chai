import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket"], // 🔥 polling removed (delay killer)
  autoConnect: false,        // 🔥 manual control
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000
});
