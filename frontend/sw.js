const CACHE_NAME = 'race-control-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  'manifest.json',
];

self.addEventListener('install', installServiceWorker);
self.addEventListener('fetch', fetchResources);
self.addEventListener('activate', updateServiceWorker);


function installServiceWorker(event) {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll(ASSETS_TO_CACHE);
  })());
}

function fetchResources(event) {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
}

function updateServiceWorker(event) {
  const cacheWhiteList = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhiteList.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
}
