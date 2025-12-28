// admin/src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { notifySuccess, notifyError } from "../utils/notify";

const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

const Orders = () => {
  const [ecomOrders, setEcomOrders] = useState([]);
  const [rOrders, setROrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [ecomRes, rRes] = await Promise.all([
        api.get("/api/order/list"),
        api.get("/api/restaurant-order/all")
      ]);
      setEcomOrders(ecomRes.data.orders || ecomRes.data.data || []);
      setROrders(rRes.data.orders || rRes.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const updateROrderStatus = async (orderId, status) => {
    try {
      await api.post("/api/restaurant-order/update-status", { orderId, status });
      notifySuccess("Status updated");
      fetchAll();
    } catch (err) {
      notifyError("Update failed");
    }
  };

  const stats = {
    totalEcom: ecomOrders.length,
    totalROrder: rOrders.length,
    pendingROrder: rOrders.filter((o) => o.status === "pending").length,
    preparing: rOrders.filter((o) => o.status === "preparing").length,
    ready: rOrders.filter((o) => o.status === "ready").length
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Dashboard & Orders</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card title="Ecommerce Orders" value={stats.totalEcom} />
        <Card title="Restaurant Orders" value={stats.totalROrder} />
        <Card title="Pending (Restaurant)" value={stats.pendingROrder} />
        <Card title="Preparing / Ready" value={`${stats.preparing} / ${stats.ready}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Recent Restaurant Orders</h2>
          <div className="space-y-3">
            {rOrders.slice(0, 8).map((o) => (
              <div key={o._id} className="flex items-center justify-between border p-2 rounded">
                <div>
                  <div className="font-medium">Table {o.tableNumber} — {o.customerName}</div>
                  <div className="text-sm text-gray-500">₹{o.total} — {o.status}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateROrderStatus(o._id, "preparing")} className="px-2 py-1 bg-yellow-500 text-white rounded">Prep</button>
                  <button onClick={() => updateROrderStatus(o._id, "ready")} className="px-2 py-1 bg-green-600 text-white rounded">Ready</button>
                </div>
              </div>
            ))}
            {rOrders.length === 0 && <div>No restaurant orders yet.</div>}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Recent Ecommerce Orders</h2>
          <div className="space-y-3">
            {ecomOrders.slice(0, 8).map((o) => (
              <div key={o._id} className="flex items-center justify-between border p-2 rounded">
                <div>
                  <div className="font-medium">Order {o._id}</div>
                  <div className="text-sm text-gray-500">₹{o.total} — {o.status}</div>
                </div>
              </div>
            ))}
            {ecomOrders.length === 0 && <div>No ecommerce orders yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
