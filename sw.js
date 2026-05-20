const CACHE_NAME = 'brankas-cache-v1';
const ASSETS_TO_CACHE = [
  'index.html',
  'manifest.json',
  'logo-sekolah.png'
];

// 1. Tahap Instalasi: Menyimpan file inti ke Cache
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('PWA: Mengamankan aset inti ke memori cache...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 2. Tahap Aktivasi: Membersihkan cache versi lama jika ada pembaruan
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('PWA: Menghapus cache usang lama...', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Tahap Fetch: Mengambil data dari cache saat offline, atau fetch live saat online
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      return cachedResponse || fetch(e.request).catch(() => {
        // Jika koneksi putus total dan tidak ada di cache, biarkan sistem menghandle secara elegan
        return null;
      });
    })
  );
});
