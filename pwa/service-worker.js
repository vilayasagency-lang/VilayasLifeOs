const CACHE_NAME = 'lifeos-v1';
const assets = ['/', '/index.html', '/css/style.css', '/js/supabase-config.js'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(assets)));
});

self.addEventListener('fetch', e => {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
