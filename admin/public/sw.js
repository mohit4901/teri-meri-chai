self.addEventListener("message", (event) => {
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

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes("/kitchen")) {
            return client.focus();
          }
        }
        return clients.openWindow("/kitchen");
      })
  );
});
