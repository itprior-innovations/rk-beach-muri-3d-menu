// Renderer plugin "original-webgl": wraps muri-webgl.js for the menu engine.
// Main screen: drag to turn, zoom - / +, Reset. One "More" button holds the advanced controls.
import {mountMuriScene} from './muri-webgl.js';
const INIT=()=>({yaw:24,tilt:34,zoom:1,detail:'lite',exploded:false});
MenuApp.registerRenderer('original-webgl',({t})=>{
  let api=null,off=[];
  const lab=(k,d)=>{const v=t(k);return v&&v!==k?v:d};
  return{
    mount(el){
      el.textContent='';
      const mk=(tag,cls,txt,attrs)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!=null)n.textContent=txt;for(const a in attrs||{})n.setAttribute(a,attrs[a]);return n};
      const box=mk('div','mscene',null,{tabindex:'0',role:'group','aria-label':lab('r_scene','Illustrative 3D paper cone and mixture. Drag sideways or use arrow keys to turn. Plus and minus zoom.')});
      const cv=mk('canvas',null,null,{'aria-label':'3D paper cone and mixture (illustrative)'});box.append(cv);
      const bar=mk('div','mbar');
      const zo=mk('button','mb','−',{'aria-label':lab('r_zout','Zoom out')}),zi=mk('button','mb','+',{'aria-label':lab('r_zin','Zoom in')});
      const rb=mk('button','mb mtxt',lab('reset','Reset')),mo=mk('button','mb mtxt',lab('r_more','More'),{'aria-expanded':'false'});
      bar.append(zo,zi,rb,mo);
      const panel=mk('div','mpanel');panel.hidden=true;
      const note=mk('div','mnote',null,{'aria-live':'polite'});
      let st=INIT(),saved=null,p=null;
      const bAngle=mk('button','mb mtxt'),bDet=mk('button','mb mtxt'),bLay=mk('button','mb mtxt'),bSave=mk('button','mb mtxt');
      const paint=()=>{bAngle.textContent=lab('r_view','View')+': '+(st.tilt===34?lab('r_table','Table'):lab('r_above','From above'));bDet.textContent=lab('r_detail','Detail')+': '+(st.detail==='lite'?'Lite':'Rich');bLay.textContent=lab('r_layers','Layers')+': '+(st.exploded?lab('r_on','On'):lab('r_off','Off'));bSave.textContent=saved?lab('r_restore','Restore saved view'):lab('r_save','Save view')};
      panel.append(bAngle,bDet,bLay,bSave,note);
      el.append(box,bar,panel);
      try{api=mountMuriScene(cv,st)}catch(e){api=null;el.textContent='';const m=document.createElement('p');m.className='mnote';m.setAttribute('role','status');m.textContent='This device or browser cannot show the 3D scene. Try a browser with WebGL support.';el.append(m);return}
      const go=n=>{st={...st,...n};api.update(st);paint()};
      const on=(n,e,f)=>{n.addEventListener(e,f);off.push(()=>n.removeEventListener(e,f))};
      on(box,'pointerdown',e=>{if(e.button!==0)return;p={x:e.clientX,yaw:st.yaw};box.setPointerCapture(e.pointerId)});
      on(box,'pointermove',e=>{if(p)go({yaw:p.yaw+(e.clientX-p.x)*.7})});
      on(box,'pointerup',()=>p=null);on(box,'pointercancel',()=>p=null);
      on(box,'keydown',e=>{const k=e.key;if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','=','Home'].includes(k))return;e.preventDefault();e.stopPropagation();
        if(k==='ArrowLeft')go({yaw:st.yaw-15});if(k==='ArrowRight')go({yaw:st.yaw+15});if(k==='ArrowUp')go({tilt:Math.min(65,st.tilt+5)});if(k==='ArrowDown')go({tilt:Math.max(18,st.tilt-5)});
        if(k==='+'||k==='=')go({zoom:Math.min(1.25,st.zoom+.1)});if(k==='-')go({zoom:Math.max(.75,st.zoom-.1)});if(k==='Home')go(INIT())});
      on(zi,'click',()=>go({zoom:Math.min(1.25,st.zoom+.1)}));on(zo,'click',()=>go({zoom:Math.max(.75,st.zoom-.1)}));
      on(rb,'click',()=>{saved=null;note.textContent='';go(INIT())});
      on(mo,'click',()=>{panel.hidden=!panel.hidden;mo.setAttribute('aria-expanded',String(!panel.hidden))});
      on(bAngle,'click',()=>go({tilt:st.tilt===34?62:34}));on(bDet,'click',()=>go({detail:st.detail==='lite'?'rich':'lite'}));on(bLay,'click',()=>go({exploded:!st.exploded}));
      on(bSave,'click',()=>{if(saved){st={...saved};api.update(st);note.textContent=lab('r_restored','Saved view restored.')}else{saved={...st};note.textContent=lab('r_saved','View saved for this visit only.')}paint()});
      paint();
    },
    unmount(){off.forEach(f=>f());off=[];if(api){api.destroy();api=null}}
  };
});
