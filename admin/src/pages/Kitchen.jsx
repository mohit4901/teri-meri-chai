import React, { useEffect, useRef, useState } from "react";
import { socket } from "../utils/socket";
import api from "../utils/api";

const Kitchen = () => {
  const [orders, setOrders] = useState([]);
  const alarmRef = useRef(null);

  // ===============================
  // SOCKET SETUP (ONE TIME)
  // ===============================
  useEffect(() => {
    // 🔔 preload alarm (browser policy safe)
    alarmRef.current = new Audio("/alarm.mp3");
    alarmRef.current.load();

    socket.connect();

    socket.on("connect", () => {
      console.log("🔌 Kitchen socket connected:", socket.id);
      socket.emit("join_kitchen");
    });

    // 🔥 NEW ORDER → INSTANT UI + ALARM
    socket.on("new-order", (order) => {
      console.log("🔥 New order received:", order);
      setOrders((prev) => [order, ...prev]);

      // 🔔 PLAY ALARM
      if (alarmRef.current) {
        alarmRef.current.currentTime = 0;
        alarmRef.current
          .play()
          .catch(() => console.log("🔕 Alarm blocked (user interaction needed)"));
      }
    });

    // 🔁 ORDER STATUS UPDATE
    socket.on("order-updated", (order) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === order._id ? order : o))
      );
    });

    // ❌ ORDER DELETED
    socket.on("order-deleted", ({ orderId }) => {
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket error:", err.message);
    });

    return () => {
      socket.off("new-order");
      socket.off("order-updated");
      socket.off("order-deleted");
      socket.disconnect();
    };
  }, []);

  // ===============================
  // FETCH EXISTING ORDERS (ON LOAD)
  // ===============================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/restaurant-order/all");
        setOrders(res.data.data || []);
      } catch (err) {
        console.error("❌ Fetch orders failed:", err);
      }
    };
    fetchOrders();
  }, []);

  // ===============================
  // DELETE ORDER (ADMIN)
  // ===============================
  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      await api.delete(`/api/restaurant-order/delete/${id}`);
      // socket will auto update via "order-deleted"
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🍳 Kitchen Panel</h1>

      {orders.length === 0 && (
        <p className="text-gray-500">No orders yet.</p>
      )}

      <div className="space-y-4">
        {orders.map((order, index) => (
          <div
            key={order._id}
            className="p-4 bg-white shadow rounded border"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">
                Order #{order.dailyOrderNumber ?? index + 1}
              </h2>

              <span className="text-xs font-semibold px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                {order.status}
              </span>
            </div>

            <p><strong>Table:</strong> {order.tableNumber}</p>
            <p><strong>Customer:</strong> {order.customerName}</p>

            <div className="mt-2">
              <strong>Items:</strong>
              <ul className="ml-5 list-disc">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} × {item.qty}
                  </li>
                ))}
              </ul>
            </div>

            {order.notes && (
              <p className="mt-2 text-sm text-gray-600">
                <strong>Note:</strong> {order.notes}
              </p>
            )}

            <p className="mt-2 font-semibold">
              Total: ₹{order.total}
            </p>

            <button
              onClick={() => deleteOrder(order._id)}
              className="mt-3 w-full bg-red-600 text-white py-2 rounded text-sm"
            >
              Delete Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kitchen;
