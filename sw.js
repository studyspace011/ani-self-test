// sw.js
const CACHE_NAME = '3rd-sem-mcq-cache-v1'; // सुनिश्चित करें कि यह नाम यूनिक है

// ✅ सही URLs बिना शुरू वाले स्लैश के
const urlsToCache = [
  './', // यह index.html को दर्शाता है
  './index.html',
  './analytics.html',
  './style.css',
  './script.js',
  './manifest.json',
  './subjects.json',
  './subjects/MJC-3/1.1.csv',
  './subjects/MJC-3/1.2.csv',
  './subjects/MJC-3/1.3.csv',
  './subjects/MJC-3/1.4.csv',
  './subjects/MJC-3/1.5.csv',
  './subjects/MJC-3/1.6.csv',
  './subjects/MJC-3/1.7.csv',
  './subjects/MJC-3/2.1.csv',
  './subjects/MJC-3/2.2.csv',
  './subjects/MJC-3/2.3.csv',
  './subjects/MJC-3/2.4.csv',
  './subjects/MJC-3/2.5.csv',
  './subjects/MJC-3/3.1.csv',
  './subjects/MJC-3/3.2.csv',
  './subjects/MJC-3/3.3.csv',
  './subjects/MJC-3/3.4.csv',
  './subjects/MIC-3/1.1.csv',
  './subjects/MIC-3/1.2.csv',
  './subjects/MIC-3/1.3.csv',
  './subjects/MIC-3/1.4.csv',
  './subjects/MIC-3/2.1.csv',
  './subjects/MIC-3/2.2.csv',
  './subjects/MIC-3/2.3.csv',
  './subjects/MIC-3/2.4.csv',
  './subjects/MIC-3/3.1.csv',
  './subjects/MIC-3/3.2.csv',
  './subjects/MIC-3/3.3.csv',
  './subjects/MIC-3/3.4.csv',
  './subjects/MIC-3/4.1.csv',
  './subjects/MIC-3/4.2.csv',
  './subjects/MIC-3/4.3.csv',
  './subjects/MIC-3/5.1.csv',
  './subjects/MIC-3/5.2.csv',
  './subjects/MIC-3/5.3.csv',
  './subjects/MIC-3/6.1.csv',
  './subjects/MIC-3/6.2.csv',
  './subjects/MIC-3/6.3.csv',
  './subjects/MDC-3/1.1.csv',
  './subjects/MDC-3/1.2.csv',
  './subjects/MDC-3/1.3.csv',
  './subjects/MDC-3/2.1.csv',
  './subjects/MDC-3/3.1.csv',
  './subjects/MDC-3/4.1.csv',
  './subjects/MDC-3/4.2.csv',
  './subjects/MDC-3/5.1.csv',
  './subjects/MDC-3/5.2.csv',
  './subjects/MDC-3/6.1.csv',
  './subjects/MDC-3/6.2.csv',
  './subjects/MDC-3/7.1.csv',
  './subjects/MDC-3/7.2.csv',
  './subjects/SEC-3/1.1.csv',
  './subjects/SEC-3/1.2.csv',
  './subjects/SEC-3/1.3.csv',
  './subjects/SEC-3/1.4.csv',
  './subjects/SEC-3/1.5.csv',
  './subjects/SEC-3/2.1.csv',
  './subjects/SEC-3/2.2.csv',
  './subjects/SEC-3/2.3.csv',
  './subjects/SEC-3/3.1.csv',
  './subjects/SEC-3/3.2.csv',
  './subjects/SEC-3/3.3.csv',
  './subjects/SEC-3/3.4.csv',
  './subjects/SEC-3/3.5.csv',
  './subjects/SEC-3/3.6.csv',
  './subjects/SEC-3/3.7.csv',
  './subjects/SEC-3/3.8.csv',
  './subjects/SEC-3/4.1.csv',
  './subjects/SEC-3/4.2.csv',
  './subjects/SEC-3/4.3.csv',
  './subjects/SEC-3/4.4.csv',
  './subjects/SEC-3/4.5.csv',
  './subjects/SEC-3/4.6.csv',
  './subjects/SEC-3/4.7.csv',
  './subjects/SEC-3/4.8.csv',
  './subjects/SEC-3/4.9.csv',
  './subjects/AEC-3/1.1.csv',
  './subjects/AEC-3/1.2.csv',
  './subjects/AEC-3/1.2.1.csv',
  './subjects/AEC-3/1.2.2.csv',
  './subjects/AEC-3/1.3.csv',
  './subjects/AEC-3/2.1.csv',
  './subjects/AEC-3/2.2.csv',
  './subjects/AEC-3/2.3.csv',
  './subjects/AEC-3/3.1.csv',
  './subjects/AEC-3/3.2.csv',
  './subjects/AEC-3/3.3.csv',
  './subjects/AEC-3/3.4.csv',
  './subjects/AEC-3/3.5.csv',
  './subjects/AEC-3/3.6.csv',
  './subjects/AEC-3/3.7.csv'
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



