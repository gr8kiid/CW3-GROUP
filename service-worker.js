var cacheName = 'lessons-v1';
// files to cache
var cacheFiles = [
    'index.html',
    'products.js',
    'products.webmanifest',
    'images',
];

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    // prevents the Service Worker from being marked as installed until the code inside the waitUntil block has finished running.
    e.waitUntil(
        // opens the cache with the specified name and adds all of the files in cacheFiles to it.
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all the files');
            return cache.addAll(cacheFiles);
        })
    );
});

// cache the third-party files
self.addEventListener('fetch', function (e) {
    e.respondWith(
        // searches the cache for a matching request and returns the corresponding response, if it exists
        caches.match(e.request).then(function (r) {
            // if a matching response is not found in the cache, fetch the requested resource from the network and add it to the cache.
            return r || fetch(e.request).then(function (response) {
                // add the new file to cache
                return caches.open(cacheName).then(function (cache) {
                    // response.clone is used to save a copy of the headers, third-party libraries for the browser to use
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});