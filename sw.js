/* latisha.ru: кэш для быстрой загрузки. Файлы с хэшем в имени не меняются, их берём из кэша сразу.
   Страницу (HTML) берём из сети, а если сеть не ответила за 2,5 с — из кэша. */
const V='58693f',ST='lt-static',PG='lt-pages',CORE=["/app.fce104.js", "/app.0b04a2.css", "/fonts/jost-0.b7120f.woff2", "/fonts/jost-6.620c0a.woff2"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(ST).then(c=>c.addAll(CORE)).catch(()=>{}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==ST&&k!==PG)await caches.delete(k);
 const c=await caches.open(ST);for(const r of await c.keys()){const p=new URL(r.url).pathname;if(/^\/app\.[0-9a-f]+\.(js|css)$/.test(p)&&!CORE.includes(p))await c.delete(r)}
 await self.clients.claim()})())});
const HASHED=/^\/(app\.[0-9a-f]+\.(js|css)|img\/.+\.[0-9a-f]{6}\.\w+|img\/vuc\/.+|fonts\/.+|data\/.+\.[0-9a-f]{6}\.json|media\/.+\.webp)$/;
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 if(r.mode==='navigate'){e.respondWith((async()=>{const c=await caches.open(PG);
  const net=fetch(r,{cache:'no-cache'}).then(res=>{if(res.ok)c.put('/',res.clone()).catch(()=>{});return res});
  const late=new Promise(ok=>setTimeout(ok,2500)).then(()=>c.match('/'));
  try{return await Promise.race([net,late.then(x=>x||net)])}catch{return (await c.match('/'))||Response.error()}})());return}
 if(HASHED.test(u.pathname)){e.respondWith(caches.open(ST).then(async c=>{const hit=await c.match(r);if(hit)return hit;const res=await fetch(r);if(res.ok)c.put(r,res.clone()).catch(()=>{});return res}))}
});
