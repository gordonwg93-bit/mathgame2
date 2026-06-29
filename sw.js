const CACHE_NAME = 'math-adventure-v3';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './main.js',
  './core_audio.js',
  './core_i18n.js',
  './core_ai.js',
  './core_storage.js',
  './engine.js',
  './games_registry.js',
  './game_counting.js',
  './game_addition.js',
  './game_colors.js',
  './game_subtraction.js',
  './game_patterns.js',
  './game_compare.js',
  './game_missing.js',
  './game_shadow.js',
  './game_shapes.js',
  './game_sorting.js',
  './game_measure.js',
  './feature_album.js',
  './feature_pet.js',
  './feature_quiz.js',
  './feature_report.js',
  './feature_coloring.js',
  './feature_daily.js',
  './feature_story.js',
  './feature_memory.js',
  './feature_tracing.js',
  './feature_badges.js'
];

// Install: Cache all core files
self.addEventListener('install', event => {
  self.skipWaiting(); // Activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      );
    })
  );
  self.clients.claim(); // Take control immediately
});

// Fetch: Network first, fallback to cache (Perfect for AI images)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone and cache the new response for offline use
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request)) // Offline fallback
  );
});

