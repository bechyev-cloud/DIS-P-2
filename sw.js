const PREFIX="discipline-user-";
const CACHE=PREFIX+'v50-chat-full';
const ASSETS=['./','./index.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png','./icons/favicon-32.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const req=e.request,url=new URL(req.url);
 // API, identity, and health are NEVER satisfied from cache, on any origin.
 if(req.method!=='GET'||url.pathname.startsWith('/api/')||url.pathname==='/connection-config.js'||url.origin!==self.location.origin)return;
 e.respondWith(fetch(req).then(res=>{if(res.ok&&res.type==='basic'){const copy=res.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(req,copy)));}return res;}).catch(async()=>{const cached=await caches.match(req);if(cached)return cached;if(req.mode==='navigate')return caches.match('./index.html');return Response.error();}));
});
