import {useEffect,useRef,type Dispatch,type PointerEvent} from 'react';
import type {A} from './useEditor';
import type {Project,Tool} from './types';
import {drawFrame,flood,line,pack,pickAt,plot} from './pixels';
interface Props{p:Project;tool:Tool;color:string;zoom:number;grid:boolean;mir:boolean;dispatch:Dispatch<A>;onPick:(c:string)=>void}
export default function CanvasBoard({p,tool,color,zoom,grid,mir,dispatch,onPick}:Props){
  const ref=useRef<HTMLCanvasElement>(null);
  const st=useRef<{down:boolean;last:[number,number];start:[number,number];base:Uint32Array}>({down:false,last:[0,0],start:[0,0],base:new Uint32Array(0)});
  useEffect(()=>{
    const cv=ref.current!,ctx=cv.getContext('2d')!,W=p.w*zoom,H=p.h*zoom;cv.width=W;cv.height=H;
    const off=document.createElement('canvas');off.width=p.w;off.height=p.h;
    drawFrame(off.getContext('2d')!,p.frames[p.f],p.w,p.h);
    ctx.imageSmoothingEnabled=false;ctx.drawImage(off,0,0,W,H);
    if(grid&&zoom>=8){ctx.strokeStyle='rgba(128,128,128,.25)';ctx.beginPath();
      for(let i=1;i<p.w;i++){ctx.moveTo(i*zoom+.5,0);ctx.lineTo(i*zoom+.5,H)}
      for(let j=1;j<p.h;j++){ctx.moveTo(0,j*zoom+.5);ctx.lineTo(W,j*zoom+.5)}ctx.stroke()}
  },[p,zoom,grid]);
  const at=(e:PointerEvent):[number,number]=>{const r=ref.current!.getBoundingClientRect();
    return[Math.floor((e.clientX-r.left)/r.width*p.w),Math.floor((e.clientY-r.top)/r.height*p.h)]};
  const val=()=>tool==='eraser'?0:pack(color);
  const down=(e:PointerEvent<HTMLCanvasElement>)=>{
    const [x,y]=at(e);if(x<0||y<0||x>=p.w||y>=p.h)return;
    if(tool==='pick'){const c=pickAt(p.frames[p.f],p.w,x,y);if(c)onPick(c);return}
    e.currentTarget.setPointerCapture(e.pointerId);dispatch({t:'cp'});const v=val();
    if(tool==='fill'){dispatch({t:'paint',fn:d=>flood(d,p.w,p.h,x,y,v,mir)});return}
    const s=st.current;s.down=true;s.last=s.start=[x,y];s.base=p.frames[p.f].layers[p.l].d;
    dispatch({t:'paint',fn:d=>plot(d,p.w,p.h,x,y,v,mir)});
  };
  const move=(e:PointerEvent<HTMLCanvasElement>)=>{
    const s=st.current;if(!s.down)return;const [x,y]=at(e),v=val(),[lx,ly]=s.last,[sx,sy]=s.start,base=s.base;
    if(tool==='line')dispatch({t:'paint',fn:d=>{d.set(base);line(d,p.w,p.h,sx,sy,x,y,v,mir)}});
    else{dispatch({t:'paint',fn:d=>line(d,p.w,p.h,lx,ly,x,y,v,mir)});s.last=[x,y]}
  };
  const up=()=>{st.current.down=false};
  return <canvas id="cv" ref={ref} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}/>;
}
