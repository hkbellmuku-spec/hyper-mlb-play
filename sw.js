// ハイパーメジャーリーグ: オフラインでも起動できるように保存しておく(更新は裏で取りに行き、次に開いたとき反映)
const C='hml-v1';const CORE=['./','index.html','manifest.json','icon-192.png','icon-512.png','icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET')return;
// 同じサイトのファイル: 保存しているものをすぐ返し、裏で新しいものを取って保存
if(u.origin===location.origin){e.respondWith(caches.open(C).then(c=>c.match(e.request,{ignoreSearch:true}).then(hit=>{const net=fetch(e.request).then(r=>{if(r&&r.ok)c.put(e.request,r.clone());return r;}).catch(()=>hit);return hit||net;})));return;}
// オンライン対戦用の部品(PeerJS)も一度取れたら保存
if(/unpkg\.com|jsdelivr\.net/.test(u.host)){e.respondWith(caches.open(C).then(c=>c.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r&&r.ok)c.put(e.request,r.clone());return r;}))));}});
