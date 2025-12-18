import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["polling", "websocket"], // Render safe
  withCredentials: false,
  reconnection: true,
  reconnectionAttempts: 10,
  timeout: 20000
});
