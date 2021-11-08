const CACHE_NAME = 'cache-v1';
const urlsToCache = [
  '/webrtc-client/main.js',
  '/webrtc-client/index.html',
  '/webrtc-client/favicon.ico',
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(caches.open(CACHE_NAME).then((cache) => {
    return cache.addAll(urlsToCache);
  }));
});

self.addEventListener('activate', (evt) => {
  const cacheWhitelist = [CACHE_NAME];
  evt.waitUntil(caches.keys().then((cacheNames) => {
    return Promise.all(cacheNames.map((cacheName) => {
      if (cacheWhitelist.indexOf(cacheName) === -1) {
        return caches.delete(cacheName);
      }
    }));
  }));
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(caches.match(evt.request).then((response) => {
    if (response) {
      return response;
    }
    const fetchRequest = evt.request.clone();

    return fetch(fetchRequest)
      .then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(evt.request, responseToCache);
          });
        return response;
      });
  }));
});

