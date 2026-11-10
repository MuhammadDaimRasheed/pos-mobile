import initSqlJs from "sql.js";
const open=()=>new Promise((res,rej)=>{const r=indexedDB.open("pos",1);r.onupgradeneeded=()=>r.result.createObjectStore("kv");r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});
const idb=async(mode,fn)=>{const d=await open();return new Promise((res,rej)=>{const q=fn(d.transaction("kv",mode).objectStore("kv"));q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error);});};
(async()=>{
 const SQL=await initSqlJs({locateFile:f=>"./"+f});
 const bytes=await idb("readonly",s=>s.get("db"));
 globalThis.__POS={SQL,bytes:bytes?new Uint8Array(bytes):null,put:b=>idb("readwrite",s=>s.put(b,"db"))};
 require("./vendor/main/index.js"); await Promise.resolve(); await new Promise(r=>setTimeout(r,0));
 require("./vendor/preload/index.js");
 const H=globalThis.__handlers, fail=m=>async()=>({ok:false,error:m});
 for(const c of ["print:raw","print:test","print:report","print:receipt","print:kitchen"])H[c]=fail("Phone se printing abhi support nahi hai");
 H["printers:list"]=async()=>({ok:true,data:[]}); H["settings:pickImage"]=fail("Logo phone se abhi change nahi ho sakta");
 H["backup:create"]=async()=>{const b=__POS.db.save()||__POS.db.h.export();const n="pos-backup-"+new Date().toISOString().slice(0,10)+".db";const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([b]));a.download=n;a.click();return{ok:true,data:n};};
 H["backup:restore"]=()=>new Promise(res=>{const i=document.createElement("input");i.type="file";i.accept=".db";i.onchange=async()=>{await __POS.put(new Uint8Array(await i.files[0].arrayBuffer()));res({ok:true,data:i.files[0].name});location.reload();};i.click();});
 addEventListener("pagehide",()=>__POS.db.save());
 const s=document.createElement("script");s.type="module";s.src="./assets/"+window.__RENDERER;document.body.appendChild(s);
})();
