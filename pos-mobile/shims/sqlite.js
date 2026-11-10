const P=()=>globalThis.__POS;
class Stmt{constructor(d,s){this.d=d;this.sql=s;this.r=false;this.w=!/^\s*(select|pragma)/i.test(s);}
 raw(v=true){this.r=v;return this;}
 q(a,rows){const s=this.d.h.prepare(this.sql);try{s.bind(a.flat().map(v=>v===undefined?null:typeof v==="boolean"?+v:v));const out=[];while(s.step()){if(rows)out.push(this.r?s.get():s.getAsObject());}return out;}finally{s.free();if(this.w)this.d.dirty();}}
 all(...a){return this.q(a,true);} get(...a){return this.q(a,true)[0];}
 run(...a){this.q(a,false);return{changes:this.d.h.getRowsModified(),lastInsertRowid:this.d.h.exec("select last_insert_rowid()")[0].values[0][0]};}}
class Database{constructor(){const{SQL,bytes}=P();this.h=bytes?new SQL.Database(bytes):new SQL.Database();this.depth=0;this.t=0;P().db=this;}
 prepare(s){return new Stmt(this,s);}
 exec(s){this.h.exec(s);this.dirty();return this;}
 pragma(s,o){try{const r=this.h.exec("PRAGMA "+s)[0];if(o&&o.simple)return r?r.values[0][0]:undefined;return r?r.values.map(v=>Object.fromEntries(r.columns.map((c,i)=>[c,v[i]]))):[];}catch{return o&&o.simple?undefined:[];}}
 transaction(fn){const f=(...a)=>{const n="sp"+this.depth++;this.h.exec(this.depth===1?"BEGIN":"SAVEPOINT "+n);try{const r=fn(...a);this.h.exec(this.depth===1?"COMMIT":"RELEASE "+n);this.depth--;this.dirty();return r;}catch(e){this.h.exec(this.depth===1?"ROLLBACK":"ROLLBACK TO "+n);this.depth--;throw e;}};f.deferred=f.immediate=f.exclusive=f;return f;}
 dirty(){if(this.t)return;this.t=setTimeout(()=>{this.t=0;this.save();},400);}
 save(){if(this.depth)return this.dirty();const b=this.h.export();this.h.exec("PRAGMA foreign_keys=ON");P().put(b);return b;}
 close(){this.save();}}
module.exports=Database;
