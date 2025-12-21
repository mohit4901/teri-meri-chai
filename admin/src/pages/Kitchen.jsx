import React, { useEffect, useRef, useState } from "react";
import { socket } from "../utils/socket";
import api from "../utils/api";
import { unlockSound, playBeep } from "../utils/sound";

const Kitchen = () => {
  const [orders, setOrders] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(false); // session based
  const audioUnlockedRef = useRef(false);

  // 🔔 USER GESTURE REQUIRED EVERY SESSION
  const enableSound = async () => {
    try {
      await unlockSound(); // MUST be awaited
      audioUnlockedRef.current = true;
      setSoundEnabled(true); // hide button after click
    } catch (e) {
      console.error("Sound unlock failed");
    }
  };

  // ❌ DO NOT AUTO-HIDE BUTTON ON REFRESH
  // Browser requires fresh gesture
  useEffect(() => {
    audioUnlockedRef.current = false;
    setSoundEnabled(false);
  }, []);

  // ===============================
  // SOCKET SETUP
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
        playBeep(); // 🔔 MP3 alarm
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

    return () => {
      socket.off("new-order");
      socket.off("order-updated");
      socket.off("order-deleted");
    };
  }, []);

  // ===============================
  // FETCH ORDERS
  // ===============================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/restaurant-order/all");
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch orders");
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    await api.delete(`/api/restaurant-order/delete/${id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🍳 Kitchen Panel</h1>

      {/* 🔔 MUST CLICK EVERY REFRESH */}
      {!soundEnabled && (
        <div
          onClick={enableSound}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 cursor-pointer"
        >
          <div className="bg-white px-6 py-4 rounded-lg font-bold text-lg">
            🔔 Tap anywhere to enable order sound
          </div>
        </div>
      )}

      {orders.map((order, i) => {
        const isPaid = order.status === "paid";

        return (
          <div key={order._id} className="p-4 bg-white border rounded mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg">
                Order #{order.dailyOrderNumber ?? i + 1}
              </h2>

              <div
                className={`px-5 py-2 rounded-lg text-white font-bold text-lg ${
                  isPaid ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {isPaid ? "PAID" : "UNPAID"}
              </div>
            </div>

            <p className="text-sm">Table: {order.tableNumber}</p>
            <p className="text-sm">Customer: {order.customerName}</p>

            <ul className="ml-5 list-disc mt-2">
              {order.items.map((it, idx) => (
                <li key={idx}>
                  {it.name} × {it.qty}
                </li>
              ))}
            </ul>

            <p className="font-semibold mt-3 text-lg">₹{order.total}</p>

            <button
              onClick={() => deleteOrder(order._id)}
              className="mt-3 bg-red-600 text-white w-full py-2 rounded font-semibold"
            >
              Delete Order
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Kitchen;
