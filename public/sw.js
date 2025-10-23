const CACHE_NAME = "fiora-v1";
const STATIC_CACHE_NAME = "fiora-static-v1";
const DYNAMIC_CACHE_NAME = "fiora-dynamic-v1";

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/shops",
  "/cart",
  "/orders",
  "/account",
  "/manifest.json",
  // Add critical CSS and JS files here when available
];

// Assets to cache dynamically
const DYNAMIC_CACHE_PATTERNS = [
  /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  /^https:\/\/fonts\.googleapis\.com/,
  /^https:\/\/fonts\.gstatic\.com/,
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("Service Worker: Static assets cached");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Service Worker: Error caching static assets", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME
            ) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Activated");
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith("http")) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log("Service Worker: Serving from cache", request.url);
        return cachedResponse;
      }

      // Clone the request for caching
      const fetchRequest = request.clone();

      return fetch(fetchRequest)
        .then((response) => {
          // Check if response is valid
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Check if we should cache this response
          const shouldCache =
            DYNAMIC_CACHE_PATTERNS.some((pattern) =>
              pattern.test(request.url)
            ) || request.url.includes(self.location.origin);

          if (shouldCache) {
            const responseToCache = response.clone();
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              console.log("Service Worker: Caching dynamic asset", request.url);
              cache.put(request, responseToCache);
            });
          }

          return response;
        })
        .catch((error) => {
          console.error("Service Worker: Fetch failed", error);

          // Return offline page for navigation requests
          if (request.destination === "document") {
            return (
              caches.match("/offline.html") ||
              new Response("You are offline. Please check your connection.", {
                status: 503,
                statusText: "Service Unavailable",
                headers: { "Content-Type": "text/plain" },
              })
            );
          }

          // Return placeholder for images
          if (request.destination === "image") {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f5f5f5"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Image unavailable</text></svg>',
              { headers: { "Content-Type": "image/svg+xml" } }
            );
          }

          throw error;
        });
    })
  );
});

// Background sync for order updates
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync", event.tag);

  if (event.tag === "order-sync") {
    event.waitUntil(syncOrderUpdates());
  }
});

// Push notifications for order updates
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push received", event);

  const options = {
    body: "Your order status has been updated!",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "view-order",
        title: "View Order",
        icon: "/icons/action-view.png",
      },
      {
        action: "dismiss",
        title: "Dismiss",
        icon: "/icons/action-dismiss.png",
      },
    ],
  };

  if (event.data) {
    const data = event.data.json();
    options.body = data.message || options.body;
    options.data = { ...options.data, ...data };
  }

  event.waitUntil(
    self.registration.showNotification("Fiora - Order Update", options)
  );
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked", event);

  event.notification.close();

  if (event.action === "view-order") {
    event.waitUntil(clients.openWindow("/orders"));
  } else if (event.action === "dismiss") {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(clients.openWindow("/"));
  }
});

// Helper function to sync order updates
async function syncOrderUpdates() {
  try {
    // In a real app, this would sync with your backend
    console.log("Service Worker: Syncing order updates...");

    // Simulate API call
    const response = await fetch("/api/orders/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lastSync: localStorage.getItem("lastOrderSync") || 0,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Service Worker: Order sync successful", data);

      // Update last sync time
      localStorage.setItem("lastOrderSync", Date.now().toString());

      // Show notification if there are updates
      if (data.hasUpdates) {
        self.registration.showNotification("Fiora - Order Update", {
          body: "Your order status has been updated!",
          icon: "/icons/icon-192x192.png",
          badge: "/icons/badge-72x72.png",
        });
      }
    }
  } catch (error) {
    console.error("Service Worker: Order sync failed", error);
  }
}
