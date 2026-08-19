const APP_CACHE = 'tv-v3.1.2';
const IMAGE_CACHE = 'tv-images-v1';
const ASSETS = ['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(APP_CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== APP_CACHE && key !== IMAGE_CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function cacheFirstImage(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response.ok || response.type === 'opaque') cache.put(request, response.clone()).catch(() => {});
  return response;
}

async function appShell(request) {
  const cache = await caches.open(APP_CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone()).catch(() => {});
  return response;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  if (request.destination === 'image') {
    event.respondWith(cacheFirstImage(request).catch(() => caches.match(request)));
    return;
  }

  const url = new URL(request.url);
  if (url.origin === self.location.origin) {
    event.respondWith(appShell(request).catch(() => caches.match('./index.html')));
    return;
  }

  // API/Dropbox metadata stays network-first and is not placed in the image cache.
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});
