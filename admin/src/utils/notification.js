export async function requestNotificationPermission() {
  if (!("Notification" in window)) return;

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
}

export async function sendSWNotification(order) {
  if (Notification.permission !== "granted") return;
  if (!navigator.serviceWorker.ready) return;

  const reg = await navigator.serviceWorker.ready;

  reg.showNotification("🛎 New Order Received", {
    body: `Order #${order.dailyOrderNumber} • ₹${order.total}`,
    icon: "/logo.png",
    badge: "/badge.png",
    vibrate: [200, 100, 200],
    data: { url: "/kitchen" }
  });
}
