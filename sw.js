// UNIGLOB Service Worker v3 - cache busting
var CACHE = 'uniglob-v3';

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll([
        '/uniglob-app/',
        '/uniglob-app/index.html',
        '/uniglob-app/manifest.json',
        '/uniglob-app/sw.js'
      ]);
    }).catch(function(err){ console.log('cache add error:', err); })
  );
});

self.addEventListener('activate', function(e) {
  // Borrar TODAS las versiones viejas
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; })
            .map(function(k){ console.log('Deleting old cache:', k); return caches.delete(k); })
      );
    }).then(function(){ return clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request);
    })
  );
});
