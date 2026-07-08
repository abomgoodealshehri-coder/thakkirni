const CACHE_NAME = 'thakkirni-v1';
const ASSETS = [
'./',
'./index.html'
];

// تثبيت الـ Service Worker وحفظ الملفات في الكاش
self.addEventListener('install', (e) => {
e.waitUntil(
caches.open(CACHE_NAME).then((cache) => {
return cache.addAll(ASSETS);
})
);
self.skipWaiting();
});

self.addEventListener('activate', (e) => {
e.waitUntil(self.clients.claim());
});

// استقبال الأوامر من الصفحة الرئيسية لجدولة الإشعارات في الخلفية
self.addEventListener('message', (event) => {
if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
const { title, body, delay } = event.data;
// جدولة الإشعار ليعمل بعد الوقت المحدد بالملي ثانية
setTimeout(() => {
self.registration.showNotification(title, {
body: body,
vibrate: [200, 100, 200],
data: { url: self.location.origin }
});
}, delay);
}
});

// فتح التطبيق عند الضغط على الإشعار
self.addEventListener('notificationclick', (event) => {
event.notification.close();
event.waitUntil(
clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
for (let client of windowClients) {
if (client.url === event.notification.data.url && 'focus' in client) {
return client.focus();
}
}
if (clients.openWindow) {
return clients.openWindow(event.notification.data.url);
}
})
);
});

