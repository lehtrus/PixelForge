import {useEffect,useMemo,useRef,useState} from 'react';
import type {Project} from './types';
import {sheet} from './pixels';
export default function ExportDialog({p,onClose}:{p:Project;onClose:()=>void}){
  const r=useRef<HTMLDialogElement>(null),[sc,setSc]=useState(4);
  useEffect(()=>{r.current?.showModal()},[]);
  const url=useMemo(()=>sheet(p,sc).toDataURL('image/png'),[p,sc]);
  return <dialog ref={r} onClose={onClose}><b>Sprite sheet</b><br/>
    <small>{p.frames.length} quadro(s) · {p.w*p.frames.length*sc}×{p.h*sc}px · quadro {p.w*sc}×{p.h*sc}px, em linha</small>
    <img src={url} alt="sprite sheet"/>
    <div className="row"><select value={sc} onChange={e=>setSc(+e.target.value)}>{[1,2,4,8].map(n=><option key={n} value={n}>{n}x</option>)}</select>
      <a href={url} download="spritesheet.png"><button>Baixar PNG</button></a><button onClick={()=>r.current?.close()}>Fechar</button></div></dialog>;
}
