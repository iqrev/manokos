const CACHE_NAME = 'manokos-v1';

// Shell statis yang di-cache saat install
const STATIC_SHELL = [
  '/',
  '/cari',
  '/login',
  '/daftar',
  '/manifest.json',
];

// Install: pre-cache shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_SHELL))
  );
  self.skipWaiting();
});

// Activate: bersihkan cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: Network First untuk API, Cache First untuk assets statis
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Jangan cache request non-GET atau ke API eksternal
  if (request.method !== 'GET') return;
  if (url.pathname.startsWith('/api/')) return;

  // Untuk navigasi halaman: Network First, fallback ke cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache halaman yang berhasil diambil
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match('/')))
    );
    return;
  }

  // Untuk aset statis (gambar, font, JS, CSS): Cache First
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|webp|woff2?|ico)$/)
  ) {
    event.respondWith(
      caches.match(request).then(
        cached => cached || fetch(request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
      )
    );
  }
});
