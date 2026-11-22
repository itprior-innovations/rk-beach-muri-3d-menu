/* Menu book engine. Mobile first. No framework. See README for the renderer plugin contract. */
(()=>{
const REN={};let teardown=null;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isNum=n=>typeof n=='number'&&isFinite(n);
const safeUrl=u=>typeof u=='string'&&u&&!/^\s*(javascript|vbscript):/i.test(u)&&(!/^\s*data:/i.test(u)||/^\s*data:image\/(webp|png|jpeg|gif);base64,[a-z0-9+\/=\s]+$/i.test(u))?u:'';
const st={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:v}catch(e){return d}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const getJSON=async u=>{try{const r=await fetch(u);return r.ok?await r.json():null}catch(e){return null}};
const getTxt=async u=>{try{const r=await fetch(u);return r.ok?await r.text():''}catch(e){return ''}};
const ic={heart:'<svg viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9.3-9A5.3 5.3 0 0 1 12 6a5.3 5.3 0 0 1 9.3 6C19 16.5 12 21 12 21z"/></svg>',globe:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>',l:'<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',r:'<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>'};
const COURSE={starters:'starters',biryani:'main',rice:'main',dessert:'desserts',drink:'drinks'};
const cOf=i=>COURSE[i.cat]||'main';

async function mount(root,opts){
 root=root||document.body;unmount();opts=opts||{};
 const $=s=>root.querySelector(s),on=[];
 const listen=(t,e,f)=>{t.addEventListener(e,f);on.push(()=>t.removeEventListener(e,f))};
 const [M0,U1,U2]=await Promise.all([getJSON(window.MENU_URL||'56-menu.json'),getJSON('51-ui.json'),getJSON('ui2.json')]);
 if(!M0||!Array.isArray(M0.items)){root.innerHTML='<div style="padding:40px;text-align:center;font:16px sans-serif;color:#c7b08f">Menu unavailable. Please try again.</div>';return}
 const M=Object.assign({currency:''},M0);M.items=M0.items.filter(i=>i&&typeof i=='object'&&i.n&&typeof i.n=='object');
 const UI={};const ks=new Set([...Object.keys(U1||{}),...Object.keys(U2||{}),'en']);ks.forEach(k=>UI[k]=Object.assign({},(U1||{})[k],(U2||{})[k]));
 const P=new URLSearchParams(location.search),RTL=['ar','he','fa','ur'];
 let L=P.get('lang')||st.get('lang','')||(navigator.language||'en').slice(0,2);if(!UI[L])L='en';
 const tr=k=>(UI[L]&&UI[L][k])||(UI.en&&UI.en[k])||k,t=k=>esc(tr(k));
 const nm=i=>esc(i.n[L]||i.n.en||''),ds=i=>esc((i.d&&(i.d[L]||i.d.en))||''),money=n=>isNum(n)?esc(M.currency)+n.toLocaleString('en-IN'):'';
 const vgs=i=>i.veg===1||i.veg===0||i.veg===true||i.veg===false?`<span class="vg ${i.veg?'':'nv'}"></span>`:'';
 const A=window.A||{};let FISH='',GLBURL='';
 const [f,...gp]=await Promise.all([window.FISH_FILE?getTxt(window.FISH_FILE):'',...(window.GLB_PARTS||[]).map(getTxt)]);
 if(f&&/^[A-Za-z0-9+\/=\s]+$/.test(f))FISH='data:image/webp;base64,'+f.trim();
 try{const b=gp.join('').replace(/\s/g,'');if(b){const x=atob(b),u=new Uint8Array(x.length);for(let i=0;i<x.length;i++)u[i]=x.charCodeAt(i);GLBURL=URL.createObjectURL(new Blob([u],{type:'model/gltf-binary'}))}}catch(e){}
 const IMG=i=>esc(safeUrl(A[i.img]||i.imgUrl)||FISH);
 const hasR=i=>!!(i.renderer&&REN[i.renderer]);
 const hasMV=i=>!!i.glb&&!!GLBURL&&!!(window.customElements&&(window.USE_MV||customElements.get('model-viewer')));
 const has3d=i=>hasR(i)||hasMV(i);
 let PK=[];try{PK=JSON.parse(st.get('pk','[]'));if(!Array.isArray(PK))PK=[]}catch(e){PK=[]}
 const courses=['starters','main','desserts','drinks'].filter(c=>M.items.some(i=>cOf(i)==c));
 let cf=courses[0],vf='all',pg=0,det=-1,inst=null,dir=0;
 const isPk=i=>PK.includes(i.id),savePk=()=>st.set('pk',JSON.stringify(PK));
 const vis=()=>M.items.map((i,x)=>x).filter(x=>cOf(M.items[x])==cf&&(vf=='all'||(M.items[x].veg!=null&&(vf=='veg')==!!M.items[x].veg)));
 const cols=()=>innerWidth>=900?2:1,ps=()=>innerHeight<700?3:4;
 const E=h=>{const d=document.createElement('div');d.innerHTML=h.trim();return d.firstChild};
 root.innerHTML=`<div id="app"><header><div class="hl"><button class="ib" id="bp" aria-label="picks">${ic.heart}<em id="pc"></em></button></div><div class="mark"><b id="wm"></b><i id="spec"></i></div><button class="ib lp" id="bl">${ic.globe}<span id="lc"></span></button></header><nav id="flt"></nav><main id="book"></main></div><div class="sheet" id="sheet" hidden></div><div id="det" hidden></div>`;
 const app=$('#app');
 function head(){document.documentElement.lang=L;document.documentElement.dir=RTL.includes(L)?'rtl':'ltr';$('#wm').textContent=(M.brand||M.name||'').toUpperCase();const tg=M.tagline;$('#spec').textContent=tg?(tg[L]||tg.en||''):tr('spec');$('#lc').textContent=(UI[L]&&UI[L].l)||L;$('#bl').onclick=langPick;$('#bp').onclick=picks;const e=$('#pc');e.textContent=PK.length||'';$('#bp').classList.toggle('on',!!PK.length)}
 function flt(){const f=$('#flt');f.innerHTML=`<div class="tabs">${courses.map(c=>`<button data-c="${c}" class="${c==cf?'on':''}">${t(c)}</button>`).join('')}</div><div class="diet">${[['all','all'],['veg','veg'],['nv','nonveg']].map(([k,l])=>`<button data-v="${k}" class="${k==vf?'on':''}">${k=='all'?'':`<span class="vg ${k=='nv'?'nv':''}"></span>`}${t(l)}</button>`).join('')}</div>`;
  f.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{cf=b.dataset.c;pg=0;dir=0;render()});f.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{vf=b.dataset.v;pg=0;dir=0;render()})}
 function row(x){const i=M.items[x];return `<div class="dish" data-x="${x}">${IMG(i)?`<img src="${IMG(i)}" alt="" loading="lazy">`:'<span class="noimg"></span>'}<div class="dt"><b>${vgs(i)}${nm(i)}${has3d(i)?'<span class="t3">3D</span>':''}</b><small>${ds(i)}</small><em>${money(i.price)}</em></div><button class="hb ${isPk(i)?'on':''}" data-h="${x}" aria-label="${t('pick')}">${ic.heart}</button></div>`}
 function book(){const v=vis(),n=ps(),c=cols(),per=n*c,pages=Math.max(1,Math.ceil(v.length/per));if(pg>=pages)pg=pages-1;if(pg<0)pg=0;
  const sl=v.slice(pg*per,pg*per+per),b=$('#book');
  const pageHtml=(arr,first)=>`<section class="page">${first?`<h1>${t(cf)}</h1>`:'<h1>&nbsp;</h1>'}${arr.map(row).join('')}</section>`;
  b.innerHTML=v.length?`<div class="paper ${dir>0?'tn':dir<0?'tp':''}">${c==2?pageHtml(sl.slice(0,n),1)+pageHtml(sl.slice(n),0):pageHtml(sl,1)}</div><div class="pgn"><button class="ib" id="pp" ${pg==0?'disabled':''} aria-label="prev">${ic.l}</button><span>${pg+1} / ${pages}</span><button class="ib" id="pn" ${pg>=pages-1?'disabled':''} aria-label="next">${ic.r}</button></div>`:`<div class="emp">${t('none')}</div>`;
  const turn=d=>{const np=pg+d;if(np<0||np>=pages)return;pg=np;dir=d;book()};
  const pp=$('#pp'),pn=$('#pn');if(pp){const rt=RTL.includes(L);pp.onclick=()=>turn(-1);pn.onclick=()=>turn(1);let sx=null;const ppr=b.querySelector('.paper');ppr.ontouchstart=e=>sx=e.touches[0].clientX;ppr.ontouchend=e=>{if(sx==null)return;const d=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(d)>60)turn((d<0?1:-1)*(rt?-1:1))}}
  b.querySelectorAll('.dish').forEach(r=>r.onclick=e=>{const h=e.target.closest('[data-h]');if(h){tog(M.items[+h.dataset.h]);return}openDet(+r.dataset.x)})}
 function tog(i){PK=isPk(i)?PK.filter(x=>x!=i.id):[...PK,i.id];savePk();dir=0;render();if(det>=0)detail()}
 function render(){head();flt();book()}
 function closeInst(){if(inst){try{inst.unmount&&inst.unmount()}catch(e){}inst=null}}
 function openDet(x){det=x;detail();$('#det').hidden=false}
 function closeDet(){det=-1;closeInst();const d=$('#det');d.hidden=true;d.innerHTML=''}
 function detail(){const i=M.items[det],d=$('#det');closeInst();
  d.innerHTML=`<button class="ib back" id="bk" aria-label="${t('back')}">${ic.l}</button><div class="dst" id="dst"></div><div class="dinfo"><h2>${vgs(i)}${nm(i)}</h2><p>${ds(i)}</p><div class="dpr">${money(i.price)}</div><button class="pickbtn ${isPk(i)?'on':''}" id="pk">${ic.heart}<span>${t(isPk(i)?'picked':'pick')}</span></button><small class="trn">${has3d(i)?t('turn'):''}</small></div>`;
  const s=$('#dst');
  if(hasR(i)){const el=document.createElement('div');el.className='rend';s.append(el);try{inst=REN[i.renderer]({item:i,lang:L,rtl:RTL.includes(L),t:tr});inst.mount(el,{item:i,lang:L,rtl:RTL.includes(L),spin:true})}catch(e){closeInst();el.remove();s.innerHTML=`<div class="ph">${IMG(i)?`<img src="${IMG(i)}" alt="">`:''}</div>`}}
  else if(hasMV(i)){s.innerHTML=`<model-viewer src="${GLBURL}" alt="${nm(i)}" camera-controls auto-rotate auto-rotate-delay="600" rotation-per-second="22deg" environment-image="neutral" exposure="1.3" shadow-intensity="1.1" shadow-softness="1" camera-orbit="25deg 66deg auto" min-camera-orbit="auto 0deg auto" max-camera-orbit="auto 95deg auto" field-of-view="28deg"></model-viewer>`}
  else s.innerHTML=`<div class="ph">${IMG(i)?`<img src="${IMG(i)}" alt="${nm(i)}">`:''}</div><span class="pend">${t('pending')}</span>`;
  $('#bk').onclick=closeDet;$('#pk').onclick=()=>tog(i);
  let sx=null;const step=dd=>{const v=vis();if(v.length<2)return;det=v[(v.indexOf(det)+dd+v.length)%v.length];detail()};
  d.ontouchstart=e=>sx=e.touches[0].clientX;d.ontouchend=e=>{if(sx==null)return;const q=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(q)>90&&!e.target.closest('model-viewer,.rend'))step((q<0?1:-1)*(RTL.includes(L)?-1:1))}}
 function sheet(h){const s=$('#sheet');s.hidden=false;s.innerHTML=`<div class="panel">${h}</div>`;s.onclick=e=>{if(e.target==s)closeSheet()};return s}
 function closeSheet(){const s=$('#sheet');s.hidden=true;s.innerHTML=''}
 function langPick(){const s=sheet(`<h3>${t('langs')}</h3><input id="lq" placeholder="${t('searchlang')}" autocomplete="off"><div class="list" id="ll"></div><div class="gt"><button class="ib lp" id="gm">${ic.globe} ${t('more')}</button></div>`);
  const draw=q=>{const l=$('#ll');l.innerHTML='';Object.keys(UI).filter(k=>UI[k].l&&((UI[k].l+k).toLowerCase().includes(q))).forEach(k=>{const b=E(`<button class="${k==L?'on':''}">${esc(UI[k].l)}</button>`);b.onclick=()=>{L=k;st.set('lang',k);closeSheet();render();if(det>=0)detail()};l.append(b)})};
  draw('');$('#lq').oninput=e=>draw(e.target.value.toLowerCase());
  $('#gm').onclick=()=>{closeSheet();window.gtInit=()=>new google.translate.TranslateElement({pageLanguage:'en',autoDisplay:false},'gt2');const d=E('<div id="gt2" style="position:fixed;bottom:10px;left:10px;z-index:30;background:#fff;padding:6px;border-radius:8px"></div>');root.append(d);const sc=document.createElement('script');sc.src='https://translate.google.com/translate_a/element.js?cb=gtInit';document.body.append(sc)}}
 function picks(){const it=PK.map(id=>M.items.find(i=>i.id==id)).filter(Boolean);const s=sheet(`<h3>${t('mypicks')}</h3>${it.length?`<p class="show">${t('show')}</p><div class="list">${it.map(i=>`<button data-r="${esc(i.id)}">${IMG(i)?`<img src="${IMG(i)}" alt="">`:''}<span>${vgs(i)} ${nm(i)}</span><i class="x">✕</i></button>`).join('')}</div>`:`<small style="display:block;padding:14px;color:var(--mut)">${t('nopicks')}</small>`}`);
  s.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{PK=PK.filter(x=>x!=b.dataset.r);savePk();render();picks()})}
 function hint(){if(st.get('seen','')&&!P.get('hint'))return;const h=E(`<div id="hint"><div class="hc"><div class="hd"><svg viewBox="0 0 24 24"><path d="M9 11V5a1.5 1.5 0 0 1 3 0v5l5 1.2c1 .3 1.6 1.2 1.4 2.2L18 19a2 2 0 0 1-2 1.7h-5a2 2 0 0 1-1.6-.8L5.5 14a1.4 1.4 0 0 1 2-2L9 13.5"/></svg></div><p>${t('h_tap')}</p><div class="sp"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div><p>${t('h_swipe')}</p><button class="gb">${t('gotit')}</button></div></div>`);h.onclick=()=>{st.set('seen','1');h.remove()};root.append(h)}
 listen(document,'keydown',e=>{if(e.key=='Escape'){if(!$('#sheet').hidden)closeSheet();else if(det>=0)closeDet()}});
 let rz;listen(window,'resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{dir=0;book()},150)});
 render();hint();
 const o=P.get('open');if(o){const x=M.items.findIndex(i=>i.id==o);if(x>=0){cf=cOf(M.items[x]);render();openDet(x)}}
 teardown=()=>{on.forEach(f=>f());closeInst();GLBURL&&URL.revokeObjectURL(GLBURL);root.innerHTML=''};
}
function unmount(){if(teardown){teardown();teardown=null}}
function registerRenderer(name,factory){if(typeof name=='string'&&typeof factory=='function')REN[name]=factory}
window.MenuApp={mount,unmount,registerRenderer};
if(!window.MENU_MANUAL){if(document.readyState=='loading')document.addEventListener('DOMContentLoaded',()=>mount());else mount()}
})();
