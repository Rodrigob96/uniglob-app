// UNIGLOB Service Worker v4
var CACHE_NAME = 'uniglob-v4';
var PRECACHE_URLS = [
  '/uniglob-app/',
  '/uniglob-app/index.html',
  '/uniglob-app/manifest.json',
  '/uniglob-app/sw.js'
];

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(PRECACHE_URLS).catch(function(){});
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.map(function(n) {
          if (n !== CACHE_NAME) { console.log('Borrando caché viejo:', n); return caches.delete(n); }
        })
      );
    }).then(function() { return clients.claim(); })
  );
});

// Estrategia: network-first, fallback a caché
self.addEventListener('fetch', function(e) {
  // Solo manejar requests GET
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(function(response) {
        // Guardar copia fresca en caché
        if (response.ok) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) { cache.put(e.request, clone); });
        }
        return response;
      })
      .catch(function() {
        return caches.match(e.request);
      })
  );
});
