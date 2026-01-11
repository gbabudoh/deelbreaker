const CACHE_NAME = 'deelbreaker-v1'
const urlsToCache = [
  '/',
  '/deals',
  '/dashboard',
  '/auth/signin',
  '/offline.html'
]

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache)
    })
  )
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response
        const responseClone = response.clone()

        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone)
          })
        }

        return response
      })
      .catch(() => {
        // Return cached version or offline page
        return caches.match(event.request).then(response => {
          return response || caches.match('/offline.html')
        })
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-deals') {
    event.waitUntil(syncDeals())
  }
})

async function syncDeals() {
  try {
    const response = await fetch('/api/deals')
    const data = await response.json()
    
    // Store in IndexedDB or local storage
    const cache = await caches.open(CACHE_NAME)
    cache.put('/api/deals', new Response(JSON.stringify(data)))
  } catch (error) {
    console.error('Sync failed:', error)
  }
}

// Push notifications
self.addEventListener('push', event => {
  const data = event.data.json()
  
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-96x96.png',
    tag: data.tag || 'deelbreaker-notification',
    requireInteraction: false
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Notification click
self.addEventListener('notificationclick', event => {
  event.notification.close()
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/')
      }
    })
  )
})
