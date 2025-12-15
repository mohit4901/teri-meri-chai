import React, { useEffect, useState } from "react";
import { socket } from "../utils/socket";
import api from "../utils/api";

const Kitchen = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // connect socket
    socket.connect();

    // join kitchen room
    socket.emit("join_kitchen");

    console.log("Joining kitchen room...");

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("SOCKET ERROR:", err.message);
    });

    // receive new orders in realtime
    socket.on("new-order", (order) => {
      console.log("NEW ORDER RECEIVED:", order);
      setOrders((prev) => [order, ...prev]);
    });

    // cleanup
    return () => {
      socket.off("connect");
      socket.off("new-order");
      socket.off("connect_error");
    };
  }, []);

  // fetch existing orders
  useEffect(() => {
    const fetchOrders = async () => {
      const res = await api.get("/api/restaurant-order/all");
      setOrders(res.data.orders || []);
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Kitchen Panel</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="p-4 bg-white shadow rounded">
            <p><strong>Table:</strong> {order.tableNumber}</p>
            <p><strong>Name:</strong> {order.customerName}</p>
            <p><strong>Items:</strong></p>

            <ul className="ml-4 list-disc">
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>

            <p><strong>Status:</strong> {order.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kitchen;
