export async function requestNotificationPermission() {
  if (!("Notification" in window)) return;

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
}

export function notifyNewOrder(order) {
  if (Notification.permission !== "granted") return;

  new Notification("🛎 New Order Received", {
    body: `Order #${order.dailyOrderNumber} • ₹${order.total}`,
    icon: "/logo.png",   // optional
    silent: false        // 🔥 sound allow
  });
}
