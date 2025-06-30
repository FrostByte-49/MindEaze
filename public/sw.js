const CACHE_NAME = 'mindeaze-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/images/Icon_192x192.webp',
  '/assets/images/Icon_512x512.webp',
  '/assets/images/Icon_180x180.webp',
  '/assets/images/Picture_1.webp'
];

// Install - Cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch - Network-first with cache fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache new responses
        const cacheCopy = networkResponse.clone();
        caches.open(CACHE_NAME)
          .then((cache) => cache.put(event.request, cacheCopy));
        return networkResponse;
      })
      .catch(() => caches.match(event.request)
        .then((cachedResponse) => cachedResponse || offlineResponse())
      )
  );
});

// Offline fallback
function offlineResponse() {
  return new Response('<h1>Offline Mode</h1><p>MindEaze will sync when online</p>', {
    headers: { 'Content-Type': 'text/html' }
  });
}

// Activate - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    })
  );
});