/* eslint-disable no-restricted-globals */

// ✅ Handle push event and show notifications
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { title: "New Notification", message: event.data.text(), url: "/" };
  }

  const options = {
    body: data.message || "You have a new message",
    icon: "/logo192.png",   // fallback icon
    badge: "/logo192.png",  // small monochrome icon
    vibrate: [200, 100, 200], // better UX feedback
    data: {
      url: data.url || "/", // Deep link route
      timestamp: Date.now(),
    },
    actions: [
      { action: "open", title: "Open App" },
      { action: "close", title: "Dismiss" }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Notification", options)
  );
});

// ✅ Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") {
    return; // user dismissed
  }

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If app already open, focus it
      for (let client of clientList) {
        if ("focus" in client) {
          if (event.notification.data?.url) {
            client.navigate(event.notification.data.url);
          }
          return client.focus();
        }
      }
      // Otherwise, open new window with deep link
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || "/");
      }
    })
  );
});

// ✅ Handle notification close (optional analytics / UX tracking)
self.addEventListener("notificationclose", (event) => {
  console.log("Notification dismissed:", event.notification);
});

// ✅ Offline fallback page (for better UX)
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("pwa-cache").then((cache) => {
      return cache.addAll([OFFLINE_URL, "/logo192.png"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(OFFLINE_URL))
  );
});
