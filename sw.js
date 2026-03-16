const CACHE_NAME = 'claw-empire-v2.0.4';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/styles.css',
  '/manifest.json',
  '/js/app.js',
  '/js/store.js',
  '/js/data.js',
  '/js/components.js',
  '/js/dashboard.js',
  '/js/chat.js',
  '/js/agents.js',
  '/js/kanban.js',
  '/js/meetings.js',
  '/js/messenger.js',
  '/js/office.js',
  '/js/reports.js',
  '/js/settings.js',
  '/js/skills.js',
  '/js/i18n.js',
];

// Install: cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first for API, cache-first for static
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET and API requests (always network)
  if (event.request.method !== 'GET') return;
  if (url.pathname.startsWith('/api/')) return;
  if (url.hostname.includes('supabase') || url.hostname.includes('googleapis')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      // Return cached if available, but also fetch fresh copy
      const fetchPromise = fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
