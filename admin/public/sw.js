self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};

  const title = data.title || "🛎 New Order";
  const options = {
    body: data.body || "New order received",
    icon: "/logo.png",
    badge: "/badge.png",
    sound: "/alarm.mp3", // some browsers ignore, OK
    vibrate: [200, 100, 200],
    data: {
      url: data.url || "/kitchen"
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url.includes("/kitchen")) {
            return client.focus();
          }
        }
        return clients.openWindow("/kitchen");
      })
  );
});
