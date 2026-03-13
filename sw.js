// UNIGLOB Service Worker
var CACHE = 'uniglob-pwa-v1';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', function(e) {
  // Dejar pasar todas las requests (la app la maneja GAS)
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request);
    })
  );
});
