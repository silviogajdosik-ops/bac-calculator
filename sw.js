/**
 * sw.js — Service Worker za BAC Calculator PWA
 * Cache-first strategija za offline support
 */

const CACHE_VERSION = 'bac-v1.4.1';
const CACHE_NAME = `app-${CACHE_VERSION}`;

const ASSETS = [
  '/bac-calculator/',
  '/bac-calculator/index.html',
  '/bac-calculator/css/style.css',
  '/bac-calculator/js/main.js?v=1.4.1',
  '/bac-calculator/js/bac.js?v=1.4.1',
  '/bac-calculator/js/profiles.js?v=1.4.1',
  '/bac-calculator/js/session.js?v=1.4.1',
  '/bac-calculator/js/drinks-db.js?v=1.4.1',
  '/bac-calculator/js/i18n.js?v=1.4.1',
  '/bac-calculator/manifest.json',
  '/bac-calculator/icons/icon-192.png',
  '/bac-calculator/icons/icon-512.png',
];

// Install: cache sve assete
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: briši stare cacheove
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first, fallback na network
self.addEventListener('fetch', event => {
  // Samo GET requestove cachiramo
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || caches.match(event.request, { ignoreSearch: true }))
      .then(cached => {
        if (cached) return cached;

        return fetch(event.request).then(response => {
          // Nemoj cachirati error response
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          return response;
        });
      })
      .catch(() => {
        // Offline fallback za HTML
        if (event.request.destination === 'document') {
          return caches.match('/bac-calculator/index.html');
        }
      })
  );
});
