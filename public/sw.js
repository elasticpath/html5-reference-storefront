var CACHE_NAME = 'ep-site-demo';
var urlsToCache = [
  '/style/style.css',
  '/scripts/lib/jquery-1.8.3.js',
  '/scripts/lib/require.js',
  '/scripts/lib/bootstrap.min.js',
  'router.js'
];

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// application fetch network data
self.addEventListener('fetch', event => {
  // abandon non-GET requests
  if (event.request.method !== 'GET') return;
  let url = event.request.url;
  event.respondWith(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.match(event.request).then(function (response) {
          console.log('cache fetch: ' + url);
          return response || fetch(event.request).then(function (response) {
            console.log('network fetch: ' + url);
            // Don't add the response to cache for now
            // cache.put(event.request, response.clone());
            return response;
          });
        });
      })
  );
});