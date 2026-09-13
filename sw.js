// sw.js
const CACHE_NAME = '3rd-sem-mcq-cache-v2'; // Ensure the cache key changes so the new AEC-04 paths are picked up
self.skipWaiting();

// ✅ सही URLs बिना शुरू वाले स्लैश के
const urlsToCache = [
  './', // यह index.html को दर्शाता है
  './index.html',
  './analytics.html',
  './style.css',
  './script.js',
  './manifest.json',
  './subjects.json',

  // MJC-05
  './subjects/MJC-05/1.1.csv',
  './subjects/MJC-05/2.1.csv',
  './subjects/MJC-05/3.1.csv',
  './subjects/MJC-05/3.2.csv',
  './subjects/MJC-05/3.3.csv',
  './subjects/MJC-05/3.4.csv',
  './subjects/MJC-05/4.1.csv',
  './subjects/MJC-05/4.2.csv',
  './subjects/MJC-05/4.3.csv',
  './subjects/MJC-05/4.4.csv',
  './subjects/MJC-05/4.5.csv',
  './subjects/MJC-05/4.6.csv',
  './subjects/MJC-05/4.7.csv',

  // MJC-06
  './subjects/MJC-06/1.1.csv',
  './subjects/MJC-06/1.2.csv',
  './subjects/MJC-06/1.3.csv',
  './subjects/MJC-06/2.1.csv',
  './subjects/MJC-06/2.2.csv',
  './subjects/MJC-06/2.3.csv',
  './subjects/MJC-06/3.1.csv',
  './subjects/MJC-06/3.2.csv',
  './subjects/MJC-06/3.3.csv',
  './subjects/MJC-06/4.1.csv',
  './subjects/MJC-06/4.2.csv',
  './subjects/MJC-06/4.3.csv',

  // MJC-07
  './subjects/MJC-07/1.1.csv',
  './subjects/MJC-07/2.1.csv',
  './subjects/MJC-07/2.2.csv',
  './subjects/MJC-07/2.3.csv',
  './subjects/MJC-07/2.4.csv',
  './subjects/MJC-07/3.1.csv',
  './subjects/MJC-07/4.1.csv',

  // MIC-4
  './subjects/MIC-4/1.1.1.csv',
  './subjects/MIC-4/1.1.2.csv',
  './subjects/MIC-4/1.2.1.csv',
  './subjects/MIC-4/1.2.2.csv',
  './subjects/MIC-4/2.1.1.csv',
  './subjects/MIC-4/2.1.2.csv',
  './subjects/MIC-4/2.1.3.csv',
  './subjects/MIC-4/2.2.1.csv',
  './subjects/MIC-4/2.2.2.csv',
  './subjects/MIC-4/2.2.3.csv',
  './subjects/MIC-4/3.1.1.csv',
  './subjects/MIC-4/3.1.2.csv',
  './subjects/MIC-4/3.1.3.csv',
  './subjects/MIC-4/3.2.1.csv',
  './subjects/MIC-4/3.2.2.csv',
  './subjects/MIC-4/3.2.3.csv',

  // AEC-4
  './subjects/AEC-04/1.1.csv',
  './subjects/AEC-04/1.2.csv',
  './subjects/AEC-04/1.3.csv',
  './subjects/AEC-04/1.4.csv',
  './subjects/AEC-04/2.1.csv',
  './subjects/AEC-04/2.2.csv',
  './subjects/AEC-04/2.3.csv',
  './subjects/AEC-04/2.4.csv',
  './subjects/AEC-04/3.1.csv',
  './subjects/AEC-04/3.2.csv',
  './subjects/AEC-04/3.3.csv',
  './subjects/AEC-04/3.4.csv',
  './subjects/AEC-04/4.1.csv',
  './subjects/AEC-04/4.2.csv',
  './subjects/AEC-04/4.3.csv',
  './subjects/AEC-04/4.4.csv',
  './subjects/AEC-04/P.1.csv',
  './subjects/AEC-04/P.2.csv',
  './subjects/AEC-04/P.3.csv',
  './subjects/AEC-04/P.4.csv',
  './subjects/AEC-04/P.5.csv',
  './subjects/AEC-04/P.6.csv'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache and caching assets');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error('Failed to cache files during install:', err);
            })
    );
});
// Fetch: Serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request)
          .catch(error => {
            console.error('Fetch failed:', error);
            // Optionally return a fallback response
          });
      })
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );

});



