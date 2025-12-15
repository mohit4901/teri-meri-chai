import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:4000", {
  transports: ["websocket", "polling"],
  withCredentials: true,
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: 20,
});
