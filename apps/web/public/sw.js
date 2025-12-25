const CACHE_NAME = 'frontend-dummies-v10';

const STATIC_ASSETS = [
    '/manifest.json',
    '/favicon.ico',
    '/web-app-manifest-192x192.png',
    '/web-app-manifest-512x512.png',
    '/apple-icon.png',
];

// Cache core static assets during installation
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
});

// Remove old caches and take control immediately
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) =>
            Promise.all(
                names.map((name) => {
                    if (name !== CACHE_NAME) return caches.delete(name);
                })
            )
        )
    );
    self.clients.claim();
});

// Allow client to trigger immediate activation of new worker
self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Intercept requests for caching and offline behavior
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Only handle safe, same-origin GET requests
    if (request.method !== 'GET') return;
    if (!request.url.startsWith(self.location.origin)) return;

    // Always fetch latest HTML documents
    if (request.destination === 'document') {
        event.respondWith(fetch(request));
        return;
    }

    // Serve cached assets first, fallback to network
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;

            return fetch(request).then((response) => {
                if (response && response.status === 200 && response.type === 'basic') {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, clone);
                    });
                }
                return response;
            });
        })
    );
});
