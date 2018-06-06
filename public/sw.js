var CACHE_NAME = 'ep-site-demo';
var urlsToCache = [
  // Don't Cache styles for now
  // '/style/style.css',
  'router.js',
  'manifest.json'
];

var urlsToCacheOnLoad = [
  '/scripts/lib/',
  '/images/',
  '/locales/',
  // Don't Cache styles for now
  // '/style/'
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
          // If not match, there is no rejection but an undefined response.
          if (!response) {
            // Go to network.
            return fetch(event.request.clone()).then(function (response) {
              // Put in cache and return the network response.
              if (urlsToCacheOnLoad.indexOf(response.url) >= 0) {
                return cache.put(event.request, response.clone()).then(function () {
                  return response;
                });
              }
            });
          }
          return response
        });
      })
  );
});