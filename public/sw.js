// Service Worker para Mi Farmacia - PWA completo con caching y offline
const CACHE_NAME = 'mi-farmacia-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/vite.svg',
]

// Install event - cachear assets estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Cache creado')
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.log('Algunos assets no se cachéaron:', err)
      })
    })
  )
  self.skipWaiting()
})

// Activate event - limpiar caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Borrando cache antiguo:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - estrategia de caching
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // No cachear requests a API o Firebase
  if (url.pathname.startsWith('/api') || url.hostname !== location.hostname) {
    return event.respondWith(
      fetch(request).catch(() => {
        return new Response('Offline - API no disponible', {
          status: 503,
          statusText: 'Service Unavailable',
        })
      })
    )
  }

  // Para HTML, CSS, JS: Network first, fallback a cache
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    return event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request) || new Response('Página no disponible offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
          });
        })
    );
  }

  // Para otros assets: Cache first, fallback a network
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(request).then((response) => {
        if (request.destination !== '' && request.destination !== 'script') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return response;
      }).catch(() => {
        return new Response('Recurso no disponible', {
          status: 404,
          statusText: 'Not Found',
          headers: { 'Content-Type': 'text/plain' }
        });
      });
    })
  );
})

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  const options = {
    body: data.body || 'Nueva notificación de Mi Farmacia',
    icon: '/vite.svg',
    badge: '/vite.svg',
    tag: data.tag || 'notification',
    requireInteraction: false,
  }

  event.waitUntil(self.registration.showNotification(data.title || 'Mi Farmacia', options))
})

// Notificación al clickear push
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) return client.focus()
      }
      if (clients.openWindow) return clients.openWindow('/')
    })
  )
})