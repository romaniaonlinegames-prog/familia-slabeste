/* ============================================================
   Service Worker — caching offline + afișare notificări
   ============================================================ */

const CACHE_NAME = "familia-slabeste-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/data.js",
  "./js/calc.js",
  "./js/notifications.js",
  "./js/pedometer.js",
  "./js/sync.js",
  "./js/firebase-config.js",
  "./js/storage.js",
  "./js/app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  // Nu interceptăm cereri către alte origini (Firebase/Firestore) — ar
  // putea rupe conexiunile de sincronizare în timp real.
  if (new URL(event.request.url).origin !== self.location.origin) return;

  // Rețea întâi: cât timp există internet, aplicația ia mereu varianta
  // cea mai nouă, automat — fără să mai fie nevoie de curățare manuală
  // de cache la fiecare actualizare. Cache-ul rămâne doar ca rezervă
  // pentru momentele fără internet.
  event.respondWith(
    fetch(event.request)
      .then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return resp;
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      if (clientList.length > 0) return clientList[0].focus();
      return self.clients.openWindow("./index.html");
    })
  );
});
