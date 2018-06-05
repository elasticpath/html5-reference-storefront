var CACHE_NAME = 'ep-site-demo';
var urlsToCache = [
  '/',
  '/main.js',
  '/router.js',
  '/?#mycart',
  '/index.html'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
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
  
          return cache.match(event.request)
            .then(response => {
  
              if (response) {
                // return cached file
                console.log('cache fetch: ' + url);
                return response;
              }
  
              // make network request
              return fetch(event.request)
                .then(newreq => {
  
                  console.log('network fetch: ' + url);
                  if (newreq.ok) cache.put(event.request, newreq.clone());
                  return newreq;
  
                })
                // app is offline
                .catch(function(error) {
                    // () => offlineAsset(url)
                })
            });
  
        })
  
    );
  
  });