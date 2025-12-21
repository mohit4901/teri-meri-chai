import React, { useEffect, useRef, useState } from "react";
import { socket } from "../utils/socket";
import api from "../utils/api";
import { unlockSound, playBeep } from "../utils/sound";

const Kitchen = () => {
  const [orders, setOrders] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioUnlockedRef = useRef(false);

  // 🔓 USER INTERACTION → UNLOCK AUDIO
  const enableSound = () => {
    try {
      unlockSound();
      audioUnlockedRef.current = true;
      setSoundEnabled(true);
      localStorage.setItem("soundEnabled", "true");
    } catch (e) {
      console.error("Sound unlock failed");
    }
  };

  // 🔁 RESTORE SOUND STATE
  useEffect(() => {
    const enabled = localStorage.getItem("soundEnabled") === "true";
    if (enabled) {
      audioUnlockedRef.current = true;
      setSoundEnabled(true);
    }
  }, []);

  // ===============================
  // SOCKET SETUP (HYBRID REALTIME)
  // ===============================
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      socket.emit("join_kitchen");
      console.log("🔌 Kitchen connected");
    });

    socket.on("new-order", (order) => {
      setOrders((prev) => [order, ...prev]);

      if (audioUnlockedRef.current) {
        playBeep();
        navigator.vibrate?.([200, 100, 200]);
      }
    });

    socket.on("order-updated", (order) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === order._id ? order : o))
      );
    });

    socket.on("order-deleted", ({ orderId }) => {
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    });

    // 🔥 IMPORTANT: DO NOT disconnect socket on unmount
    return () => {
      socket.off("new-order");
      socket.off("order-updated");
      socket.off("order-deleted");
    };
  }, []);

  // ===============================
  // INITIAL + FALLBACK FETCH (NO ORDER LOSS)
  // ===============================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/restaurant-order/all");
        setOrders(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch orders");
      }
    };

    fetchOrders(); // initial load

    const interval = setInterval(fetchOrders, 3000); // 🔥 fallback every 3s

    return () => clearInterval(interval);
  }, []);

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    await api.delete(`/api/restaurant-order/delete/${id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🍳 Kitchen Panel</h1>

      {!soundEnabled && (
        <button
          onClick={enableSound}
          className="mb-4 bg-black text-white px-4 py-2 rounded"
        >
          🔔 Enable Order Sound
        </button>
      )}

      {orders.map((order, i) => (
        <div key={order._id} className="p-4 bg-white border rounded mb-4">
          <h2 className="font-bold">
            Order #{order.dailyOrderNumber ?? i + 1}
          </h2>
          <p>Table: {order.tableNumber}</p>
          <p>Customer: {order.customerName}</p>

          <ul className="ml-5 list-disc">
            {order.items.map((it, idx) => (
              <li key={idx}>
                {it.name} × {it.qty}
              </li>
            ))}
          </ul>

          <p className="font-semibold mt-2">₹{order.total}</p>

          <button
            onClick={() => deleteOrder(order._id)}
            className="mt-2 bg-red-600 text-white w-full py-1 rounded"
          >
            Delete Order
          </button>
        </div>
      ))}
    </div>
  );
};

export default Kitchen;

