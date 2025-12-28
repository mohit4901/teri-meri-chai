console.log("🔥 SW LOADED");

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/* 🔔 SINGLE MESSAGE HANDLER */
self.addEventListener("message", (event) => {
  console.log("📩 SW RECEIVED MESSAGE", event.data);

  if (event.data?.type === "NEW_ORDER") {
    const { title, body, url } = event.data.payload;

    self.registration.showNotification(title, {
      body,
      icon: "/logo.png",
      badge: "/badge.png",
      vibrate: [200, 100, 200],
      data: { url }
    });
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((list) => {
        for (const client of list) {
          if (client.url.includes("/kitchen")) {
            return client.focus();
          }
        }
        return clients.openWindow("/kitchen");
      })
  );
});

