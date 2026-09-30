import type {Dispatch} from 'react';
import type {A} from './useEditor';
import type {Project} from './types';
import {addLayer,delLayer,moveLayer,rename,toggleVis} from './ops';
export default function LayersPanel({p,dispatch}:{p:Project;dispatch:Dispatch<A>}){
  const ls=p.frames[p.f].layers,edit=(fn:(p:Project)=>Project)=>dispatch({t:'edit',fn});
  return <div className="card">
    <div className="row" style={{marginBottom:8}}><h3 style={{margin:0}}>Camadas</h3><div className="sp"/><button onClick={()=>edit(addLayer)}>+ Camada</button></div>
    {ls.map((_,i)=>i).reverse().map(i=>{const l=ls[i];return(
      <div key={l.id} className={'ly'+(i===p.l?' sel':'')} onClick={()=>dispatch({t:'set',fn:q=>({...q,l:i})})}>
        <button onClick={e=>{e.stopPropagation();edit(q=>toggleVis(q,i))}}>{l.vis?'●':'○'}</button>
        <input type="text" value={l.name} onClick={e=>e.stopPropagation()} onChange={e=>dispatch({t:'set',fn:q=>rename(q,i,e.target.value)})}/>
        <button onClick={e=>{e.stopPropagation();edit(q=>moveLayer(q,i,1))}}>↑</button>
        <button onClick={e=>{e.stopPropagation();edit(q=>moveLayer(q,i,-1))}}>↓</button>
        <button onClick={e=>{e.stopPropagation();edit(q=>delLayer(q,i))}}>✕</button></div>)})}
  </div>;
}
