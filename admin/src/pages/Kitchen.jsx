import React, { useEffect, useRef, useState } from "react";
import { socket } from "../utils/socket";
import api from "../utils/api";
import { unlockSound, playBeep } from "../utils/sound";

const Kitchen = () => {
  const [orders, setOrders] = useState([]);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const audioUnlockedRef = useRef(false);

  // 🔔 LOGO / BELL CLICK → ENABLE SOUND + NOTIFICATION
  const enableAlerts = async () => {
    try {
      // 🔊 Unlock sound (user gesture)
      await unlockSound();
      audioUnlockedRef.current = true;
      setAlertsEnabled(true);

      // 🔔 Request notification permission
      if ("Notification" in window) {
        const res = await Notification.requestPermission();
        if (res !== "granted") {
          alert("Notifications blocked. Alerts may be limited.");
        }
      }
    } catch (e) {
      console.error("Enable alerts failed", e);
    }
  };

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

      // 🔊 Sound (only if unlocked)
      if (audioUnlockedRef.current) {
        playBeep();
        navigator.vibrate?.([200, 100, 200]);
      }

      // 🔔 Notification (Service Worker)
      if (Notification.permission === "granted" && navigator.serviceWorker) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification("🛎 New Order Received", {
            body: `Order #${order.dailyOrderNumber} • ₹${order.total}`,
            icon: "/logo.png",
            badge: "/badge.png",
            vibrate: [200, 100, 200],
            data: { url: "/kitchen" },
          });
        });
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
  // FETCH ORDERS (POLLING)
  // ===============================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/restaurant-order/all");
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch {
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
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">🍳 Kitchen Panel</h1>

        {/* 🔔 ALERT BUTTON */}
        <button
          onClick={enableAlerts}
          title={
            !alertsEnabled
              ? "Click to enable sound & notifications"
              : ""
          }
          className={`px-4 py-2 rounded-lg font-bold transition-all
            ${
              alertsEnabled
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white alert-blink"
            }
          `}
        >
          {alertsEnabled ? "🔔 Alerts ON" : "🔕 Enable Alerts"}
        </button>
      </div>

      {/* ================= ORDERS ================= */}
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

            <p className="font-semibold mt-3 text-lg">
              ₹{order.total}
            </p>

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
