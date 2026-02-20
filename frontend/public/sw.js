self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Do NOT intercept cross-origin requests (e.g. API calls to backend.safelyhands.com).
    // Re-fetching cross-origin requests with a body (like file uploads) fails because
    // the request body is already consumed by the browser — causing a fake CORS error.
    if (url.origin !== self.location.origin) {
        return; // Let the browser handle it natively
    }

    // For same-origin requests, pass through
    event.respondWith(fetch(event.request));
});
