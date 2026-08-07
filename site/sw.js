// Kill-switch: unregisters the legacy Gatsby offline service worker
// (gatsby-plugin-offline) still active in returning visitors' browsers,
// clears its caches, and forces a fresh load. Safe to remove once
// enough time has passed that no old SW registrations remain (check
// analytics / ask if anyone still reports a blank page).
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clientsList = await self.clients.matchAll({ type: "window" });
      clientsList.forEach((client) => client.navigate(client.url));
    })()
  );
});
