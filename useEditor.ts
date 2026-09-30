import {useReducer} from 'react';
import type {Project} from './types';
import {newProject} from './pixels';
interface S{p:Project;past:Project[];future:Project[]}
export type A=
 |{t:'cp'}
 |{t:'paint';fn:(d:Uint32Array)=>void}
 |{t:'edit';fn:(p:Project)=>Project}
 |{t:'set';fn:(p:Project)=>Project}
 |{t:'undo'}|{t:'redo'};
const cap=(a:Project[],p:Project)=>[...a.slice(-59),p];
function red(s:S,a:A):S{
  switch(a.t){
    case 'cp':return{...s,past:cap(s.past,s.p),future:[]};
    case 'edit':return{p:a.fn(s.p),past:cap(s.past,s.p),future:[]};
    case 'set':return{...s,p:a.fn(s.p)};
    case 'paint':{const p=s.p;
      const frames=p.frames.map((f,i)=>i!==p.f?f:{layers:f.layers.map((l,j)=>{if(j!==p.l)return l;const d=l.d.slice();a.fn(d);return{...l,d}})});
      return{...s,p:{...p,frames}}}
    case 'undo':return s.past.length?{p:s.past[s.past.length-1],past:s.past.slice(0,-1),future:[...s.future,s.p]}:s;
    case 'redo':return s.future.length?{p:s.future[s.future.length-1],past:[...s.past,s.p],future:s.future.slice(0,-1)}:s;
  }
}
export function useEditor(){
  const [s,dispatch]=useReducer(red,undefined,():S=>({p:newProject(),past:[],future:[]}));
  return{p:s.p,dispatch};
}
