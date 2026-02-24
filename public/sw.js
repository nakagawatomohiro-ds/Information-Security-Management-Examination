const CACHE_NAME="dscss-sg-v1";
self.addEventListener("install",(e)=>{self.skipWaiting();});
self.addEventListener("activate",(e)=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE_NAME).map(x=>caches.delete(x)))));});
self.addEventListener("fetch",(e)=>{e.respondWith(caches.match(e.request).then(c=>{const f=fetch(e.request).then(r=>{if(r.ok){const cl=r.clone();caches.open(CACHE_NAME).then(ca=>ca.put(e.request,cl));}return r;}).catch(()=>c);return c||f;}));});
