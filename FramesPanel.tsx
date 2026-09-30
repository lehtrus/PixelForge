import {useEffect,useRef,type Dispatch} from 'react';
import type {A} from './useEditor';
import type {Frame,Project} from './types';
import {addFrame,delFrame,dupFrame} from './ops';
import {drawFrame} from './pixels';
function Thumb({fr,w,h,sel,onClick}:{fr:Frame;w:number;h:number;sel:boolean;onClick:()=>void}){
  const r=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{const c=r.current!;c.width=w;c.height=h;const x=c.getContext('2d')!;x.clearRect(0,0,w,h);drawFrame(x,fr,w,h)},[fr,w,h]);
  return <canvas ref={r} className={sel?'sel':''} onClick={onClick}/>;
}
export default function FramesPanel({p,dispatch}:{p:Project;dispatch:Dispatch<A>}){
  const edit=(fn:(p:Project)=>Project)=>dispatch({t:'edit',fn});
  return <div className="card">
    <div className="row" style={{marginBottom:8}}><h3 style={{margin:0}}>Quadros</h3><div className="sp"/>
      <button onClick={()=>edit(addFrame)}>+ Novo</button><button onClick={()=>edit(dupFrame)}>Duplicar</button><button onClick={()=>edit(delFrame)}>Excluir</button></div>
    <div className="fr">{p.frames.map((f,i)=><Thumb key={i} fr={f} w={p.w} h={p.h} sel={i===p.f}
      onClick={()=>dispatch({t:'set',fn:q=>({...q,f:i,l:Math.min(q.l,q.frames[i].layers.length-1)})})}/>)}</div></div>;
}
