// Original 3D geometry for the RK Beach concept. No image textures or third-party models.
const VS=`attribute vec3 aPosition;attribute vec3 aNormal;attribute vec3 aColor;attribute float aLift;uniform mat4 uMVP;uniform float uExplode;varying vec3 vNormal;varying vec3 vColor;varying vec3 vPosition;void main(){vec3 p=aPosition;p.y+=aLift*uExplode;vPosition=p;vNormal=aNormal;vColor=aColor;gl_Position=uMVP*vec4(p,1.0);}`;
const FS=`precision highp float;varying vec3 vNormal;varying vec3 vColor;varying vec3 vPosition;void main(){vec3 n=normalize(vNormal);vec3 light=normalize(vec3(-0.6,1.0,0.8));float diffuse=max(dot(n,light),0.0);float back=max(dot(n,normalize(vec3(0.6,0.3,-0.5))),0.0);float noise=fract(sin(dot(floor(vPosition*210.0),vec3(12.9898,78.233,37.719)))*43758.5453);float food=step(0.7,vColor.g)*step(0.11,vColor.r-vColor.b);float spice=step(0.975,noise)*food;float grain=sin(vPosition.x*95.0)*sin(vPosition.y*107.0)*0.012;vec3 color=vColor*(0.61+0.36*diffuse+0.09*back)+grain;color=mix(color,vec3(0.43,0.25,0.08),spice*.65);gl_FragColor=vec4(color,1.0);}`;
const norm=a=>{const n=Math.hypot(...a)||1;return a.map(x=>x/n)};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
function multiply(a,b){const m=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)m[c*4+r]+=a[k*4+r]*b[c*4+k];return m;}
function framingPoints(mesh){const pts=[],ext=Array(8).fill(null),values=[Infinity,-Infinity,Infinity,-Infinity,Infinity,-Infinity,Infinity,-Infinity];for(let i=0;i<mesh.length;i+=10){const p=[mesh[i],mesh[i+1],mesh[i+2],mesh[i+9]];if(i%1500===0)pts.push(p);const v=[p[0],p[0],p[1],p[1],p[2],p[2],p[1]+p[3],p[1]+p[3]];for(let k=0;k<8;k++)if((k%2?v[k]>values[k]:v[k]<values[k])){values[k]=v[k];ext[k]=p}}return pts.concat(ext.filter(Boolean));}
function camera(yaw,elevation,zoom,aspect,exploded=false,points=[]){
 const y=(yaw-15)*Math.PI/180,e=elevation*Math.PI/180,target=[-.15,exploded?.03:-.2,.1];
 const matrixAt=d=>{const eye=[Math.sin(y)*Math.cos(e)*d+target[0],Math.sin(e)*d+target[1],Math.cos(y)*Math.cos(e)*d+target[2]],z=norm(eye.map((v,i)=>v-target[i])),x=norm(cross([0,1,0],z)),up=cross(z,x);const view=new Float32Array([x[0],up[0],z[0],0,x[1],up[1],z[1],0,x[2],up[2],z[2],0,-dot(x,eye),-dot(up,eye),-dot(z,eye),1]);const f=1/Math.tan(38*Math.PI/360),near=.1,far=40,projection=new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0]);return multiply(projection,view)};
 const box=m=>{const b=[Infinity,-Infinity,Infinity,-Infinity];for(const p of points){const x=p[0],yy=p[1]+(exploded?p[3]:0),z=p[2],w=m[3]*x+m[7]*yy+m[11]*z+m[15],px=(m[0]*x+m[4]*yy+m[8]*z+m[12])/w,py=(m[1]*x+m[5]*yy+m[9]*z+m[13])/w;b[0]=Math.min(b[0],px);b[1]=Math.max(b[1],px);b[2]=Math.min(b[2],py);b[3]=Math.max(b[3],py)}return b};
 let distance=5.4/1.25;
 if(points.length)for(let i=0;i<3;i++){const b=box(matrixAt(distance)),span=Math.max((b[1]-b[0])/2,(b[3]-b[2])/2);if(span<=.87)break;distance*=span/.87;}
 const result=matrixAt(distance*1.25/zoom);
 if(points.length){const b=box(result),cx=(b[0]+b[1])/2,cy=(b[2]+b[3])/2;for(let c=0;c<4;c++){result[c*4]-=cx*result[c*4+3];result[c*4+1]-=cy*result[c*4+3];}}
 return result;
}
function random(seed){return()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296}}
function geometry(detail){
 const out=[],rnd=random(126),rich=detail==='rich';
 const vertex=(p,n,c,lift=0)=>out.push(...p,...n,...c,lift);
 const tri=(a,b,c,n,color,lift=0)=>{vertex(a,n,color,lift);vertex(b,n,color,lift);vertex(c,n,color,lift)};
 const u=[.794,0,.608],axis=[.608,0,-.794],front=axis.map(x=>-x),mouth=[-.32,-.03,.35];
 const add=(a,b,k=1)=>a.map((v,i)=>v+b[i]*k);
 const loc=(x,y,z)=>add(add(add(mouth,u,x),[0,1,0],y),front,z);
 function ellipsoid(center,scale,rotation,color,lift=0,rough=.04){
  const cy=Math.cos(rotation[0]),sy=Math.sin(rotation[0]),cz=Math.cos(rotation[1]),sz=Math.sin(rotation[1]),phase=rnd()*6.28;
  const rotate=v=>{const x=v[0]*cz-v[1]*sz,y=v[0]*sz+v[1]*cz;return[x*cy-v[2]*sy,y,x*sy+v[2]*cy]};
  const point=(t,p)=>{const unit=[Math.cos(p)*Math.cos(t),Math.sin(p),Math.cos(p)*Math.sin(t)],w=1+rough*Math.sin(t*3+phase)*Math.cos(p*4+phase);const local=rotate(unit.map((v,i)=>v*scale[i]*w));return{p:local.map((v,i)=>v+center[i]),n:norm(rotate(unit.map((v,i)=>v/scale[i])))};};
  for(let j=0;j<6;j++)for(let i=0;i<10;i++){
   const a=i*Math.PI/5,b=(i+1)*Math.PI/5,c=-Math.PI/2+j*Math.PI/6,d=c+Math.PI/6;
   const ps=[point(a,c),point(b,c),point(b,d),point(a,d)];for(const k of [0,1,2,0,2,3])vertex(ps[k].p,ps[k].n,color,lift);
  }
 }
 const shell=(angle,t,offset=0)=>{const r=.91*(1-t)+.018+offset,w=.012*Math.sin(angle*7+t*8)*(1-t);return add(add(add(mouth,axis,2.12*t),u,(r+w)*Math.cos(angle)),[0,1,0],(r+w)*Math.sin(angle)-.07*t)};
 // Original off-white paper cone. No image texture or copied newspaper print.
 for(let side=0;side<2;side++)for(let j=0;j<10;j++)for(let i=0;i<72;i++){
  const a=i*Math.PI/36,b=(i+1)*Math.PI/36,t=j/10,v=(j+1)/10;
  
  const normal=norm(add(add(u.map(x=>x*Math.cos((a+b)/2)),[0,1,0],Math.sin((a+b)/2)),axis,.43)).map(x=>x*(side?-1:1));
  const col=side?[.90,.89,.85]:[.95,.94,.9],off=side?-.015:0;
  tri(shell(a,t,off),shell(b,t,off),shell(b,v,off),normal,col);tri(shell(a,t,off),shell(b,v,off),shell(a,v,off),normal,col);
 }
 // Small abstract ink dashes suggest paper print without copying stock text.
 for(let row=0;row<18;row++)for(let k=0;k<28;k++){
  const t=.08+row*.045,a=k*Math.PI/14+.04*(row%2),b=a+.07+rnd()*.085,dt=.005+rnd()*.004;
  const n=norm(add(u.map(x=>x*Math.cos(a)),[0,1,0],Math.sin(a)));
  const col=[.40+rnd()*.11,.42,.40];tri(shell(a,t,.004),shell(b,t,.004),shell(b,t+dt,.004),n,col);tri(shell(a,t,.004),shell(b,t+dt,.004),shell(a,t+dt,.004),n,col);
 }
 // Folded catch-paper under the mouth, plus a faint geometric contact shadow.

 const paper=[loc(-.88,-.94,-.25),loc(.78,-.94,-.25),loc(.88,-.94,.78),loc(-1.0,-.94,.67)];
 tri(paper[0],paper[1],paper[2],[0,1,0],[.96,.955,.93]);tri(paper[0],paper[2],paper[3],[0,1,0],[.96,.955,.93]);
 // A rounded interior fill supports the separate, genuinely volumetric grains.
 ellipsoid(loc(0,0,.08),[.78,.79,.34],[.65,0],[.85,.76,.52],0,.06);
 const surface=()=>{const r=Math.sqrt(rnd())*.78,a=rnd()*Math.PI*2;return loc(Math.cos(a)*r,Math.sin(a)*r,.18+.29*(1-r*r/.7)+rnd()*.12)};
 for(let i=0;i<(rich?780:430);i++){
  const p=surface(),shade=.95+rnd()*.05,lift=.12+rnd()*.44;
  ellipsoid(p,[.077+rnd()*.039,.027+rnd()*.014,.032+rnd()*.011],[rnd()*6.28,(rnd()-.5)*2.8],[shade,shade*.945,shade*.80],lift,.10);
 }
 // Decorative reference-inspired shapes only, not a real ingredient/allergen claim.
 for(let i=0;i<(rich?29:20);i++)ellipsoid(surface(),[.071,.05,.044],[rnd()*6.28,rnd()*2],[.49+rnd()*.11,.18+rnd()*.05,.075],.16+rnd()*.35,.07);
 function cube(center,size,color,lift){
  const p=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(v=>v.map((x,i)=>center[i]+x*size[i]));
  for(const [ids,n] of [[[0,1,2,3],[0,0,-1]],[[4,7,6,5],[0,0,1]],[[0,4,5,1],[0,-1,0]],[[3,2,6,7],[0,1,0]],[[0,3,7,4],[-1,0,0]],[[1,5,6,2],[1,0,0]]]){tri(p[ids[0]],p[ids[1]],p[ids[2]],n,color,lift);tri(p[ids[0]],p[ids[2]],p[ids[3]],n,color,lift);}
 }
 for(let i=0;i<12;i++)cube(surface(),[.054,.046,.047],[.94,.84,.56],.23+rnd()*.3);
 for(let i=0;i<24;i++){const p=surface();cube(p,[.035,.027,.032],i%3?[.88,.80,.79]:[.68,.39,.53],.18+rnd()*.35)}
 for(let i=0;i<(rich?94:62);i++)ellipsoid(surface(),[.075+rnd()*.04,.019,.021],[rnd()*6.28,rnd()*3],[.94,.62+rnd()*.15,.15],.16+rnd()*.4,.045);
 for(let i=0;i<30;i++){
  const p=surface(),c=[.12+rnd()*.13,.39+rnd()*.15,.11],lift=.22+rnd()*.35;
  const a=add(p,u,-.065),b=add(add(p,[0,1,0],.025),front,.048),d=add(p,u,.075),under=add(p,[0,1,0],-.013);
  tri(a,b,d,[0,.7,.6],c,lift);tri(a,d,under,[0,-1,0],c,lift);tri(a,under,b,[-1,0,0],c,lift);tri(d,b,under,[1,0,0],c,lift);
 }
 // Green ring-shaped accents have a real opening, not flat image cutouts.
 for(let k=0;k<7;k++){
  const center=surface();for(let i=0;i<18;i++)for(let j=0;j<6;j++){
   const a=i*Math.PI/9,b=(i+1)*Math.PI/9,c=j*Math.PI/3,d=c+Math.PI/3;
   const pos=(x,y)=>add(add(add(center,u,(.068+.018*Math.cos(y))*Math.cos(x)),[0,1,0],(.068+.018*Math.cos(y))*Math.sin(x)),front,.018*Math.sin(y)+.05);
   const n=norm(add(add(u.map(x=>x*Math.cos((a+b)/2)*Math.cos((c+d)/2)),[0,1,0],Math.sin((a+b)/2)*Math.cos((c+d)/2)),front,Math.sin((c+d)/2)));
   tri(pos(a,c),pos(b,c),pos(b,d),n,[.22,.43,.1],.35);tri(pos(a,c),pos(b,d),pos(a,d),n,[.22,.43,.1],.35);
  }
 }
 // A few loose shapes on the catch-paper make the cone's depth easy to see.
 for(let i=0;i<48;i++){
  const p=loc((rnd()-.5)*1.55,-.90+rnd()*.008,.25+rnd()*.45);
  ellipsoid(p,[.075+rnd()*.025,.028,.034],[rnd()*6.28,(rnd()-.5)*.35],[.98,.92,.75],0,.09);
 }
 for(let i=0;i<5;i++)ellipsoid(loc((rnd()-.5)*1.45,-.89,.3+rnd()*.35),[.072,.05,.045],[rnd()*6.28,.2],[.56,.21,.08],0,.06);
 return new Float32Array(out);
}
export function mountMuriScene(canvas,initial={}){
 const gl=canvas.getContext('webgl',{antialias:true,alpha:false,powerPreference:'low-power',preserveDrawingBuffer:false});if(!gl)throw new Error('WebGL is unavailable');
 const shader=(type,text)=>{const s=gl.createShader(type);gl.shaderSource(s,text);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const msg=gl.getShaderInfoLog(s);gl.deleteShader(s);throw new Error(msg)}return s};
 const program=gl.createProgram(),vs=shader(gl.VERTEX_SHADER,VS),fs=shader(gl.FRAGMENT_SHADER,FS);gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('3D shader could not link');gl.useProgram(program);
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
 for(const [name,size,offset]of[['aPosition',3,0],['aNormal',3,12],['aColor',3,24],['aLift',1,36]]){const location=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,size,gl.FLOAT,false,40,offset)}
 const matrix=gl.getUniformLocation(program,'uMVP'),explode=gl.getUniformLocation(program,'uExplode');
 let state={yaw:24,tilt:34,zoom:1,detail:'lite',exploded:false,...initial},count=0,points=[],loadedDetail='',frame=0,disposed=false;
 function draw(){frame=0;if(disposed||gl.isContextLost())return;const dpr=Math.min(window.devicePixelRatio||1,3),w=Math.max(1,Math.round(canvas.clientWidth*dpr)),h=Math.max(1,Math.round(canvas.clientHeight*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}gl.viewport(0,0,w,h);gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.clearColor(.957,.937,.925,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);if(loadedDetail!==state.detail){const mesh=geometry(state.detail);count=mesh.length/10;points=framingPoints(mesh);gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);loadedDetail=state.detail;}gl.uniformMatrix4fv(matrix,false,camera(state.yaw,state.tilt,state.zoom,w/h,state.exploded,points));gl.uniform1f(explode,state.exploded?1:0);gl.drawArrays(gl.TRIANGLES,0,count);canvas.dataset.renderer='webgl';canvas.dataset.vertices=String(count);canvas.dataset.zoom=String(state.zoom);if(!canvas.dataset.readyMs)canvas.dataset.readyMs=String(Math.round(performance.now()));}
 const schedule=()=>{if(!frame&&!disposed)frame=requestAnimationFrame(draw)};
 const resize=typeof ResizeObserver==='function'?new ResizeObserver(schedule):null;resize?.observe(canvas);window.addEventListener('resize',schedule);draw();
 return {update(next){state={...state,...next};schedule()},render:draw,destroy(){disposed=true;if(frame)cancelAnimationFrame(frame);resize?.disconnect();window.removeEventListener('resize',schedule);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs)}};
    }
