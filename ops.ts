import type {Layer,Project} from './types';
import {newLayer,nid} from './pixels';
const upF=(p:Project,fn:(l:Layer[])=>Layer[]):Project=>({...p,frames:p.frames.map((f,i)=>i===p.f?{layers:fn(f.layers)}:f)});
const L=(p:Project)=>p.frames[p.f].layers;
export const addLayer=(p:Project):Project=>{const n=[...L(p),newLayer(p.w,p.h,'Camada '+(L(p).length+1))];return{...upF(p,()=>n),l:n.length-1}};
export const delLayer=(p:Project,i:number):Project=>{if(L(p).length<2)return p;const n=L(p).filter((_,j)=>j!==i);return{...upF(p,()=>n),l:Math.min(p.l,n.length-1)}};
export const moveLayer=(p:Project,i:number,d:number):Project=>{const n=[...L(p)],j=i+d;if(j<0||j>=n.length)return p;[n[i],n[j]]=[n[j],n[i]];return{...upF(p,()=>n),l:p.l===i?j:p.l===j?i:p.l}};
export const toggleVis=(p:Project,i:number)=>upF(p,ls=>ls.map((l,j)=>j===i?{...l,vis:!l.vis}:l));
export const rename=(p:Project,i:number,name:string)=>upF(p,ls=>ls.map((l,j)=>j===i?{...l,name}:l));
const ins=(p:Project,layers:Layer[]):Project=>{const f=[...p.frames];f.splice(p.f+1,0,{layers});return{...p,frames:f,f:p.f+1,l:0}};
export const addFrame=(p:Project)=>ins(p,[newLayer(p.w,p.h,'Camada 1')]);
export const dupFrame=(p:Project)=>ins(p,L(p).map(l=>({...l,id:nid(),d:l.d.slice()})));
export const delFrame=(p:Project):Project=>p.frames.length<2?p:{...p,frames:p.frames.filter((_,i)=>i!==p.f),f:Math.max(0,p.f-1),l:0};
export const setSize=(p:Project,n:number):Project=>({...p,w:n,h:n,
  frames:p.frames.map(f=>({layers:f.layers.map(l=>{const d=new Uint32Array(n*n);
    for(let y=0;y<Math.min(n,p.h);y++)for(let x=0;x<Math.min(n,p.w);x++)d[y*n+x]=l.d[y*p.w+x];return{...l,d}})}))});
