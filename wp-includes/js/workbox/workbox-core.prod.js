this.workbox=this.workbox||{},this.workbox.core=function(){"use strict";try{self.workbox.v["workbox:core:4.0.0-beta.0"]=1}catch(e){}var e={debug:0,log:1,warn:2,error:3,silent:4};const t=/^((?!chrome|android).)*safari/i.test(navigator.userAgent);let r=(()=>e.warn)();const n=e=>r<=e,a=e=>r=e,s=()=>r,o=e.error,c=function(r,a,s){const c=0===r.indexOf("group")?o:e[r];if(!n(c))return;if(!s||"groupCollapsed"===r&&t)return void console[r](...a);const i=["%cworkbox",`background: ${s}; color: white; padding: 2px 0.5em; `+"border-radius: 0.5em;"];console[r](...i,...a)},i=()=>{n(o)&&console.groupEnd()},l={groupEnd:i,unprefixed:{groupEnd:i}},u={debug:"#7f8c8d",log:"#2ecc71",warn:"#f39c12",error:"#c0392b",groupCollapsed:"#3498db"};Object.keys(u).forEach(e=>((e,t)=>{l[e]=((...r)=>c(e,r,t)),l.unprefixed[e]=((...t)=>c(e,t))})(e,u[e]));const h=(e,...t)=>{let r=e;return t.length>0&&(r+=` :: ${JSON.stringify(t)}`),r};class g extends Error{constructor(e,t){super(h(e,t)),this.name=e,this.details=t}}const d=new Set;class p{constructor(e,t,{onupgradeneeded:r,onversionchange:n=this.e}={}){this.t=e,this.r=t,this.n=r,this.e=n,this.a=null}get db(){return this.a}async open(){if(!this.a)return this.a=await new Promise((e,t)=>{let r=!1;setTimeout(()=>{r=!0,t(new Error("The open request was blocked and timed out"))},this.OPEN_TIMEOUT);const n=indexedDB.open(this.t,this.r);n.onerror=(()=>t(n.error)),n.onupgradeneeded=(e=>{r?(n.transaction.abort(),e.target.result.close()):this.n&&this.n(e)}),n.onsuccess=(({target:t})=>{const n=t.result;r?n.close():(n.onversionchange=this.e,e(n))})}),this}async getKey(e,t){return(await this.getAllKeys(e,t,1))[0]}async getAll(e,t,r){return await this.getAllMatching(e,{query:t,count:r})}async getAllKeys(e,t,r){return(await this.getAllMatching(e,{query:t,count:r,includeKeys:!0})).map(({key:e})=>e)}async getAllMatching(e,{index:t,query:r=null,direction:n="next",count:a,includeKeys:s}={}){return await this.transaction([e],"readonly",(o,c)=>{const i=o.objectStore(e),l=t?i.index(t):i,u=[];l.openCursor(r,n).onsuccess=(({target:e})=>{const t=e.result;if(t){const{primaryKey:e,key:r,value:n}=t;u.push(s?{primaryKey:e,key:r,value:n}:n),a&&u.length>=a?c(u):t.continue()}else c(u)})})}async transaction(e,t,r){return await this.open(),await new Promise((n,a)=>{const s=this.a.transaction(e,t);s.onabort=(({target:e})=>a(e.error)),s.oncomplete=(()=>n()),r(s,e=>n(e))})}async s(e,t,r,...n){return await this.transaction([t],r,(r,a)=>{r.objectStore(t)[e](...n).onsuccess=(({target:e})=>{a(e.result)})})}e(){this.close()}close(){this.a&&this.a.close()}}p.prototype.OPEN_TIMEOUT=2e3;const w={readonly:["get","count","getKey","getAll","getAllKeys"],readwrite:["add","put","clear","delete"]};for(const[e,t]of Object.entries(w))for(const r of t)r in IDBObjectStore.prototype&&(p.prototype[r]=async function(t,...n){return await this.s(r,t,e,...n)});const f={prefix:"workbox",suffix:self.registration.scope,googleAnalytics:"googleAnalytics",precache:"precache",runtime:"runtime"},y=e=>[f.prefix,e,f.suffix].filter(e=>e.length>0).join("-"),m={updateDetails:e=>{Object.keys(f).forEach(t=>{void 0!==e[t]&&(f[t]=e[t])})},getGoogleAnalyticsName:e=>e||y(f.googleAnalytics),getPrecacheName:e=>e||y(f.precache),getRuntimeName:e=>e||y(f.runtime)};var v="cacheDidUpdate",b="cacheWillUpdate",q="cachedResponseWillBeUsed",E="fetchDidFail",L="requestWillFetch",x=(e,t)=>e.filter(e=>t in e);const N=e=>{const t=new URL(e,location);return t.origin===location.origin?t.pathname:t.href},O=async({cacheName:e,request:t,event:r,matchOptions:n,plugins:a=[]})=>{const s=await caches.open(e);let o=await s.match(t,n);for(let s of a)q in s&&(o=await s[q].call(s,{cacheName:e,request:t,event:r,matchOptions:n,cachedResponse:o}));return o},k=async({request:e,response:t,event:r,plugins:n})=>{let a=t,s=!1;for(let t of n)if(b in t&&(s=!0,!(a=await t[b].call(t,{request:e,response:a,event:r}))))break;return s||(a=a.ok?a:null),a||null},D={put:async({cacheName:e,request:t,response:r,event:n,plugins:a=[]}={})=>{if(!r)throw new g("cache-put-with-no-response",{url:N(t.url)});let s=await k({request:t,response:r,event:n,plugins:a});if(!s)return;const o=await caches.open(e),c=x(a,v);let i=c.length>0?await O({cacheName:e,request:t}):null;try{await o.put(t,s)}catch(e){throw"QuotaExceededError"===e.name&&await async function(){for(const e of d)await e()}(),e}for(let r of c)await r[v].call(r,{cacheName:e,request:t,event:n,oldResponse:i,newResponse:s})},match:O},A={fetch:async({request:e,fetchOptions:t,event:r,plugins:n=[]})=>{if(r&&r.preloadResponse){const e=await r.preloadResponse;if(e)return e}"string"==typeof e&&(e=new Request(e));const a=x(n,E),s=a.length>0?e.clone():null;try{for(let t of n)L in t&&(e=await t[L].call(t,{request:e.clone(),event:r}))}catch(e){throw new g("plugin-error-request-will-fetch",{thrownError:e})}const o=e.clone();try{return await fetch(e,t)}catch(e){for(let t of a)await t[E].call(t,{error:e,event:r,originalRequest:s.clone(),request:o.clone()});throw e}}};var R=Object.freeze({DBWrapper:p,deleteDatabase:async e=>{await new Promise((t,r)=>{const n=indexedDB.deleteDatabase(e);n.onerror=(({target:e})=>{r(e.error)}),n.onblocked=(()=>{r(new Error("Delete blocked"))}),n.onsuccess=(()=>{t()})})},migrateDb:(e,t)=>{let{oldVersion:r,newVersion:n}=e;const a=e=>{const r=()=>{++e<=n&&a(e)},s=t[`v${e}`];"function"==typeof s?s(r):r()};a(r)},WorkboxError:g,assert:null,cacheNames:m,cacheWrapper:D,fetchWrapper:A,getFriendlyURL:N,logger:l});var K=new class{constructor(){try{self.workbox.v=self.workbox.v||{}}catch(e){}}get cacheNames(){return{googleAnalytics:m.getGoogleAnalyticsName(),precache:m.getPrecacheName(),runtime:m.getRuntimeName()}}setCacheNameDetails(e){m.updateDetails(e)}get logLevel(){return s()}setLogLevel(t){if(t>e.silent||t<e.debug)throw new g("invalid-value",{paramName:"logLevel",validValueDescription:"Please use a value from LOG_LEVELS, i.e 'logLevel = workbox.core.LOG_LEVELS.debug'.",value:t});a(t)}};return Object.assign(K,{_private:R,LOG_LEVELS:e,registerQuotaErrorCallback:function(e){d.add(e)}})}();

//# sourceMappingURL=workbox-core.prod.js.map