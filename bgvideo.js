/* Night beach background video. Add-on: renders only after the app mounts. */
(()=>{const rm=matchMedia('(prefers-reduced-motion: reduce)').matches||(navigator.connection&&navigator.connection.saveData);if(rm)return;
const add=()=>{if(document.getElementById('bgv'))return true;const app=document.querySelector('#app');if(!app)return false;const v=document.createElement('video');v.id='bgv';v.muted=true;v.loop=true;v.autoplay=true;v.playsInline=true;v.setAttribute('playsinline','');v.preload='auto';v.setAttribute('aria-hidden','true');v.src=(window.BGV||[]).join('');document.body.insertBefore(v,app);const p=v.play();if(p&&p.catch)p.catch(()=>{});return true};
if(add())return;const t=setInterval(()=>{if(add())clearInterval(t)},300);setTimeout(()=>clearInterval(t),15000)})();
