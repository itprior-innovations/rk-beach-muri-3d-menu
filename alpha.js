(async()=>{
const $=s=>document.querySelector(s),J=u=>fetch(u).then(r=>r.json());
const [M,U1,U2]=await Promise.all([J('56-menu.json'),J('51-ui.json'),J('ui2.json')]);
const UI={};for(const k in U1)UI[k]=Object.assign({},U1[k],U2[k]);
const P=new URLSearchParams(location.search),RTL=['ar'];
let L=P.get('lang')||localStorage.lang||((navigator.language||'en').slice(0,2));if(!UI[L])L='en';
let cur=Math.max(0,M.items.findIndex(i=>i.id==(P.get('open')||'cb'))),light='studio',spin=true,tilt=false;
const t=k=>(UI[L]&&UI[L][k])||UI.en[k]||k;
const nm=i=>i.n[L]||i.n.en,ds=i=>i.d[L]||i.d.en,money=n=>M.currency+n.toLocaleString('en-IN');
const E=h=>{const d=document.createElement('div');d.innerHTML=h.trim();return d.firstChild};
const ic={search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',globe:'<svg viewBox="0 0 24 24" style="width:16px;height:16px"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>',l:'<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',r:'<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',spin:'<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-3-6.2"/><path d="M20 4v5h-5"/></svg>',top:'<svg viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="9" ry="9"/><ellipse cx="12" cy="12" rx="4" ry="4"/></svg>',side:'<svg viewBox="0 0 24 24"><ellipse cx="12" cy="14" rx="9" ry="4"/><path d="M3 14v-2c0-3 4-5 9-5s9 2 9 5v2"/></svg>',sun:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>',phone:'<svg viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>'};
document.body.innerHTML=`<div id="app"><header><button class="ib" id="bs" aria-label="search">${ic.search}</button><div class="mark"><b>RK BEACH MURI</b><i id="spec"></i></div><button class="ib lp" id="bl">${ic.globe}<span id="lc"></span></button></header><main><div class="stage" id="stage"></div><div class="side"><div class="info" id="info"></div><div class="rail" id="rail"></div></div></main></div><div class="sheet" id="sheet" hidden></div>`;
const pending=i=>!i.glb;
let GLBURL='',FISH='';
const txt=u=>fetch(u).then(r=>r.ok?r.text():'').catch(()=>'');
const A=window.A;
const IMG=n=>A[n]||FISH;
const [f,g1,g2]=await Promise.all([txt('fish.b64.txt'),txt('dish.b64.1.txt'),txt('dish.b64.2.txt')]);
FISH=f?'data:image/webp;base64,'+f.trim():'';
if(g1){const x=atob((g1+g2).replace(/\s/g,'')),u=new Uint8Array(x.length);for(let i=0;i<x.length;i++)u[i]=x.charCodeAt(i);GLBURL=URL.createObjectURL(new Blob([u],{type:'model/gltf-binary'}))}
function stage(){const i=M.items[cur],s=$('#stage');s.innerHTML='';
 let h='';
 if(!pending(i)&&GLBURL){h=`<model-viewer src="${GLBURL}" alt="${nm(i)}" camera-controls ${spin?'auto-rotate':''} auto-rotate-delay="800" rotation-per-second="22deg" interaction-prompt="auto" ar ar-modes="webxr scene-viewer quick-look" environment-image="neutral" exposure="${light=='studio'?1.35:.8}" shadow-intensity="${light=='studio'?1.1:2}" shadow-softness="1" camera-orbit="25deg 66deg auto" min-camera-orbit="auto 0deg auto" max-camera-orbit="auto 95deg auto" field-of-view="28deg"><button slot="ar-button" class="arb">${t('ar')}</button></model-viewer>`}
 else{h=`<div class="ph"><img src="${IMG(i.img)}" alt="${nm(i)}"></div><span class="pend">${t('pending')}</span>`}
 s.innerHTML=h+`<button class="ib nav l" id="pv">${ic.l}</button><button class="ib nav r" id="nx">${ic.r}</button><div class="tools">${!pending(i)?`<button class="ib ${spin?'on':''}" id="tsp" title="${t('spin')}">${ic.spin}</button><button class="ib" id="ttop" title="${t('top')}">${ic.top}</button><button class="ib" id="tsd" title="${t('side')}">${ic.side}</button><button class="ib ${light=='night'?'on':''}" id="tli" title="${t(light=='studio'?'night':'studio')}">${ic.sun}</button>`:''}<button class="ib ${tilt?'on':''}" id="tti" title="${t('tiltm')}">${ic.phone}</button></div>`;
 const mv=s.querySelector('model-viewer');
 $('#pv').onclick=()=>go(-1);$('#nx').onclick=()=>go(1);
 const q=(id,fn)=>{const e=$(id);if(e)e.onclick=fn};
 q('#tsp',()=>{spin=!spin;mv.autoRotate=spin;$('#tsp').classList.toggle('on',spin)});
 q('#ttop',()=>{mv.cameraOrbit='0deg 8deg auto';mv.autoRotate=false;mv.jumpCameraToGoal&&0});
 q('#tsd',()=>{mv.cameraOrbit='25deg 70deg auto';mv.autoRotate=spin});
 q('#tli',()=>{light=light=='studio'?'night':'studio';stage()});
 q('#tti',async()=>{tilt=!tilt;if(tilt&&window.DeviceOrientationEvent&&DeviceOrientationEvent.requestPermission){try{await DeviceOrientationEvent.requestPermission()}catch(e){}}stage()});
 const ph=s.querySelector('.ph img');
 const move=(x,y)=>{if(ph)ph.style.transform=`rotateY(${x*18}deg) rotateX(${-y*18}deg) scale(1.04)`;else if(mv&&tilt){mv.cameraOrbit=`${25+x*120}deg ${66+y*40}deg auto`}};
 s.onpointermove=e=>{if(ph){const r=s.getBoundingClientRect();move((e.clientX-r.left)/r.width-.5,(e.clientY-r.top)/r.height-.5)}};
 window.ondeviceorientation=e=>{if((tilt||ph)&&e.gamma!=null)move(Math.max(-.5,Math.min(.5,e.gamma/60)),Math.max(-.5,Math.min(.5,(e.beta-50)/90)))};
 let sx=null;s.ontouchstart=e=>sx=e.touches[0].clientX;s.ontouchend=e=>{if(sx==null)return;const d=e.changedTouches[0].clientX-sx;sx=null;if(ph&&Math.abs(d)>70)go(d<0?1:-1)};
}
function info(){const i=M.items[cur];const el=$('#info');el.style.animation='none';el.offsetHeight;el.style.animation='';
 el.innerHTML=`<h2>${nm(i)}</h2><div class="meta"><span class="vg ${i.veg?'':'nv'}"></span><span class="price">${money(i.price)}</span><span class="cat">${t(i.cat)}</span></div><p>${ds(i)}</p>`}
function rail(){const r=$('#rail');r.innerHTML='';M.items.forEach((i,x)=>{const b=E(`<button class="${x==cur?'on':''}" aria-label="${nm(i)}"><img src="${IMG(i.img)}" alt="">${pending(i)?'':'<span class="d3">3D</span>'}</button>`);b.onclick=()=>{cur=x;render()};r.append(b)});
 const on=r.querySelector('.on');on&&on.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'})}
function go(d){cur=(cur+d+M.items.length)%M.items.length;render();if(navigator.vibrate)navigator.vibrate(8)}
function head(){document.documentElement.lang=L;document.documentElement.dir=RTL.includes(L)?'rtl':'ltr';$('#spec').textContent=t('spec');$('#lc').textContent=UI[L].l;$('#bs').onclick=dishSearch;$('#bl').onclick=langPick}
function render(){head();stage();info();rail()}
function sheet(h){const s=$('#sheet');s.hidden=false;s.innerHTML=`<div class="panel">${h}</div>`;s.onclick=e=>{if(e.target==s)close()};return s}
function close(){const s=$('#sheet');s.hidden=true;s.innerHTML=''}
function langPick(){const s=sheet(`<h3>${t('langs')}</h3><input id="lq" placeholder="${t('searchlang')}" autocomplete="off"><div class="list" id="ll"></div><div class="gt" id="gt"><button class="ib lp" id="gm">${ic.globe} ${t('more')}</button></div>`);
 const draw=q=>{const l=$('#ll');l.innerHTML='';Object.keys(UI).filter(k=>(UI[k].l+k).toLowerCase().includes(q)).forEach(k=>{const b=E(`<button class="${k==L?'on':''}">${UI[k].l}</button>`);b.onclick=()=>{L=k;localStorage.lang=k;close();render()};l.append(b)})};
 draw('');$('#lq').oninput=e=>draw(e.target.value.toLowerCase());
 $('#gm').onclick=()=>{close();window.gtInit=()=>new google.translate.TranslateElement({pageLanguage:'en',autoDisplay:false},'gt2');const d=E('<div id="gt2" style="position:fixed;bottom:10px;left:10px;z-index:30;background:#fff;padding:6px;border-radius:8px"></div>');document.body.append(d);const sc=document.createElement('script');sc.src='https://translate.google.com/translate_a/element.js?cb=gtInit';document.body.append(sc)}}
function dishSearch(){const s=sheet(`<input id="dq" placeholder="${t('searchdish')}" autocomplete="off"><div class="list" id="dl"></div>`);
 const draw=q=>{const l=$('#dl');l.innerHTML='';const r=M.items.map((i,x)=>[i,x]).filter(([i])=>(Object.values(i.n).join(' ')+' '+ds(i)).toLowerCase().includes(q));if(!r.length)l.innerHTML=`<small style="padding:10px;color:var(--mut)">${t('none')}</small>`;r.forEach(([i,x])=>{const b=E(`<button><img src="${IMG(i.img)}" alt=""><span>${nm(i)}<small>${money(i.price)}</small></span></button>`);b.onclick=()=>{cur=x;close();render()};l.append(b)})};
 draw('');const q=$('#dq');q.oninput=e=>draw(e.target.value.toLowerCase());setTimeout(()=>q.focus(),250)}
document.onkeydown=e=>{if(e.key=='ArrowRight')go(RTL.includes(L)?-1:1);if(e.key=='ArrowLeft')go(RTL.includes(L)?1:-1);if(e.key=='Escape')close()};
render();
})();
