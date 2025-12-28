import React, { useEffect, useState } from "react";
import { socket } from "../utils/socket";
import api from "../utils/api";

/* 🔔 FIRE OS NOTIFICATION VIA SERVICE WORKER */
function fireOrderNotification(order) {
  if (Notification.permission !== "granted") return;
  if (!navigator.serviceWorker?.controller) return;

  navigator.serviceWorker.controller.postMessage({
    type: "NEW_ORDER",
    payload: {
      title: "🛎 New Order Received",
      body: `Order #${order.dailyOrderNumber} • ₹${order.total}`,
      url: "/kitchen",
    },
  });
}

const Kitchen = () => {
  const [orders, setOrders] = useState([]);
  const [alertsEnabled, setAlertsEnabled] = useState(false);

  /* 🔔 ENABLE ALERTS = ONLY PERMISSION */
  const enableAlerts = async () => {
    const res = await Notification.requestPermission();
    if (res === "granted") {
      setAlertsEnabled(true);
    } else {
      alert("Notifications blocked. Sound will not play.");
    }
  };

  /* ===============================
     SOCKET SETUP
  =============================== */
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      socket.emit("join_kitchen");
      console.log("🔌 Kitchen connected");
    });

    socket.on("new-order", (order) => {
      setOrders((prev) => [order, ...prev]);

      // 🔔 OS LEVEL SOUND (GUARANTEED)
      fireOrderNotification(order);
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

  /* ===============================
     FETCH ORDERS
  =============================== */
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
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">🍳 Kitchen Panel</h1>

        <button
          onClick={enableAlerts}
          className={`px-4 py-2 rounded-lg font-bold
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

      {/* ORDERS */}
      {orders.map((order, i) => (
        <div key={order._id} className="p-4 bg-white border rounded mb-4">
          <h2 className="font-bold text-lg">
            Order #{order.dailyOrderNumber ?? i + 1}
          </h2>
          <p>Table: {order.tableNumber}</p>
          <p>Customer: {order.customerName}</p>
          <p className="font-semibold">₹{order.total}</p>

          <button
            onClick={() => deleteOrder(order._id)}
            className="mt-2 bg-red-600 text-white w-full py-2 rounded"
          >
            Delete Order
          </button>
        </div>
      ))}
    </div>
  );
};

export default Kitchen;
