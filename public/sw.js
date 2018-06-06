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
          if (response) {
            // return cached file
            console.log('cache fetch: ' + url);
            return response;
          }
          // If not match, there is no rejection but an undefined response.
          else {
            // Go to network.
            return fetch(event.request).then(function (response) {
              console.log('network fetch: ' + url);
              // Put in cache and return the network response.
              length = urlsToCacheOnLoad.length;
              while (length--) {
                if (response.url.indexOf(urlsToCacheOnLoad[length]) != -1) {
                  console.log('network fetch cached: ' + url);
                  cache.put(event.request, response.clone()).then(function () {
                    return response;
                  });
                }
              }
              return response;
            });
          }
        });
      })
  );
});