import React, { useEffect } from "react";
import { socket } from "../utils/socket";

export default function TestSocket() {
  useEffect(() => {
    console.log("Trying Socket Connection...");

    socket.connect();

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("SOCKET CONNECTION FAILED:", err.message);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  return <h1>Testing Socket Connection…</h1>;
}
