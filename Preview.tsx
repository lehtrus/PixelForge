import {useEffect,useRef,useState} from 'react';
import type {Project} from './types';
import {drawFrame} from './pixels';
export default function Preview({p}:{p:Project}){
  const r=useRef<HTMLCanvasElement>(null),i=useRef(0),[fps,setFps]=useState(6);
  useEffect(()=>{
    const c=r.current!;c.width=p.w;c.height=p.h;const x=c.getContext('2d')!;
    const t=setInterval(()=>{i.current=(i.current+1)%p.frames.length;x.clearRect(0,0,p.w,p.h);drawFrame(x,p.frames[i.current],p.w,p.h)},1000/Math.max(1,fps));
    return()=>clearInterval(t);
  },[p.frames,p.w,p.h,fps]);
  return <div className="card"><h3>Animação</h3><div className="row"><canvas id="pv" ref={r}/>
    <div><label>FPS <input type="number" min={1} max={30} value={fps} style={{width:56}} onChange={e=>setFps(+e.target.value||6)}/></label><br/><small>Prévia dos quadros</small></div></div></div>;
}
