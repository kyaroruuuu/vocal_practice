/* 卡羅＠寫作系統：離線使用。同站的 GET 請求先試網絡（拿到最新版並存一份），沒有網絡時用存下的那份。
   模組不經這裏：安裝後已保存在 IndexedDB。 */
const CACHE = 'kv-site-2';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./']).catch(() => {}))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  const home = u.pathname.endsWith('/') || u.pathname.endsWith('/index.html');
  e.respondWith(fetch(r).then(res => { if (res.ok && res.type === 'basic') { const c = res.clone(); caches.open(CACHE).then(ca => ca.put(home ? './' : r, c)); } return res; })
    .catch(() => caches.match(home ? './' : r, { ignoreSearch: true }).then(m => m || Response.error())));
});
