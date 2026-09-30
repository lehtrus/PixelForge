import type {Frame,Layer,Project} from './types';
let uid=0;
export const nid=()=>'l'+uid++;
export const pack=(h:string)=>{const n=parseInt(h.slice(1),16);return((255<<24)|((n&255)<<16)|(((n>>8)&255)<<8)|(n>>16))>>>0};
export const hex=(d:number)=>'#'+[d&255,(d>>8)&255,(d>>16)&255].map(x=>x.toString(16).padStart(2,'0')).join('');
export const newLayer=(w:number,h:number,name:string):Layer=>({id:nid(),name,vis:true,d:new Uint32Array(w*h)});
export const newProject=(w=32,h=32):Project=>({w,h,f:0,l:0,frames:[{layers:[newLayer(w,h,'Camada 1')]}]});
const inb=(w:number,h:number,x:number,y:number)=>x>=0&&y>=0&&x<w&&y<h;
export function plot(d:Uint32Array,w:number,h:number,x:number,y:number,v:number,mir:boolean){
  if(inb(w,h,x,y))d[y*w+x]=v;
  if(mir&&inb(w,h,w-1-x,y))d[y*w+w-1-x]=v;
}
export function line(d:Uint32Array,w:number,h:number,a:number,b:number,c:number,e:number,v:number,mir:boolean){
  const dx=Math.abs(c-a),dy=-Math.abs(e-b),sx=a<c?1:-1,sy=b<e?1:-1;let err=dx+dy;
  for(;;){plot(d,w,h,a,b,v,mir);if(a===c&&b===e)break;const e2=2*err;if(e2>=dy){err+=dy;a+=sx}if(e2<=dx){err+=dx;b+=sy}}
}
function flood1(d:Uint32Array,w:number,h:number,x:number,y:number,v:number){
  if(!inb(w,h,x,y))return;const t=d[y*w+x];if(t===v)return;const st=[[x,y]];
  while(st.length){const [a,b]=st.pop()!;if(!inb(w,h,a,b)||d[b*w+a]!==t)continue;d[b*w+a]=v;st.push([a+1,b],[a-1,b],[a,b+1],[a,b-1])}
}
export function flood(d:Uint32Array,w:number,h:number,x:number,y:number,v:number,mir:boolean){flood1(d,w,h,x,y,v);if(mir)flood1(d,w,h,w-1-x,y,v)}
export function pickAt(fr:Frame,w:number,x:number,y:number):string|null{
  for(let i=fr.layers.length-1;i>=0;i--){const l=fr.layers[i],c=l.d[y*w+x];if(l.vis&&c)return hex(c)}
  return null;
}
export function drawFrame(ctx:CanvasRenderingContext2D,fr:Frame,w:number,h:number){
  for(const l of fr.layers){if(!l.vis)continue;
    const t=document.createElement('canvas');t.width=w;t.height=h;
    t.getContext('2d')!.putImageData(new ImageData(new Uint8ClampedArray(l.d.buffer as ArrayBuffer),w,h),0,0);
    ctx.drawImage(t,0,0)}
}
export function sheet(p:Project,sc:number){
  const c=document.createElement('canvas');c.width=p.w*p.frames.length*sc;c.height=p.h*sc;
  const x=c.getContext('2d')!;x.imageSmoothingEnabled=false;
  p.frames.forEach((f,i)=>{const t=document.createElement('canvas');t.width=p.w;t.height=p.h;
    drawFrame(t.getContext('2d')!,f,p.w,p.h);x.drawImage(t,i*p.w*sc,0,p.w*sc,p.h*sc)});
  return c;
}
