// sw.js - نسخة مطورة لإجبار المتصفح على التحديث فوراً
const CACHE_NAME = 'thakkirni-v2'; // تغيير الاسم لإجبار المتصفح على التحديث
const ASSETS = [
'./',
'./index.html',
'./manifest.json'
];

self.addEventListener('install', (e) => {
e.waitUntil(
caches.open(CACHE_NAME).then((cache) => {
return cache.addAll(ASSETS);
})
);
self.skipWaiting(); // تفعيل فوري بدون انتظار اغلاق التبويبات القديمة
});

self.addEventListener('activate', (e) => {
e.waitUntil(
caches.keys().then((keys) => {
return Promise.all(
keys.map((key) => {
if (key !== CACHE_NAME) {
return caches.delete(key); // مسح الكاش القديم نهائياً
}
})
);
}).then(() => self.clients.claim())
);
});

// استقبال أمر جدولة التذكير من الصفحة الرئيسية
self.addEventListener('message', (event) => {
if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
const { title, body, delay } = event.data;

setTimeout(() => {
self.registration.showNotification(title, {
body: body,
vibrate: [200, 100, 200],
badge: './icon.png',
icon: './icon.png'
});
}, delay);
}
});

