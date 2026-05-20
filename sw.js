var CACHE_NAME = 'a0nynx-v2';
var PRECACHE_URLS = [
    './',
    './index.html',
    './icon-192.png',
    './icon-512.png',
    './css/-A-00-variables.css',
    './css/-A-01-frame.css',
    './css/-A-02-theme.css',
    './css/-A-03-desktop.css',
    './css/-A-04-widgets.css',
    './css/-A-05-chat-app.css',
    './css/-A-06-chat-detail.css',
    './css/-A-07-chat-room.css',
    './css/-A-08-chat-detail-alt.css',
    './css/-A-09-chat-detail-alt-settings.css',
    './js/-A-00-utils.js',
    './js/-A-01-app.js',
    './js/-A-02-chat-db.js',
    './js/-A-03-chat-detail-ui.js',
    './js/-A-04-cloud-sync.js',
    './js/-A-05-chat-app.js',
    './js/-A-06-settings-hub.js',
    './js/-A-07-lens-app.js',
    './js/-A-08-worldbook-app.js',
    './js/-A-09-private-space.js',
    './js/-A-10-invite-popup.js',
    './js/-A-11-theatre-app.js',
    './js/-A-12-theatre-scene.js',
    './js/-A-13-chat-room.js',
    './js/-A-14-chat-detail-alt.js',
    './js/-A-15-chat-detail-alt-settings.js',
    './js/-A-16-entity-list.js',
    './js/-A-17-me-page.js',
    './js/-A-18-errbook.js',
    './js/-A-19-api-fab.js'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(PRECACHE_URLS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(names) {
            return Promise.all(
                names.filter(function(name) { return name !== CACHE_NAME; })
                    .map(function(name) { return caches.delete(name); })
            );
        }).then(function() { return self.clients.claim(); })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).then(function(response) {
            if (response && response.status === 200 && response.type === 'basic') {
                var clone = response.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request, clone);
                });
            }
            return response;
        }).catch(function() {
            return caches.match(event.request).then(function(cached) {
                return cached || new Response('Offline');
            });
        })
    );
});

// 通知点击事件
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({type: 'window', includeUncontrolled: true}).then(function(clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if ('focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('./index.html');
            }
        })
    );
});
