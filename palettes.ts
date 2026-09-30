import {useEffect,useState} from 'react';
import type {Palettes} from './types';
export const PRESETS:Palettes={
'PICO-8':['#000000','#1d2b53','#7e2553','#008751','#ab5236','#5f574f','#c2c3c7','#fff1e8','#ff004d','#ffa300','#ffec27','#00e436','#29adff','#83769c','#ff77a8','#ffccaa'],
'Gameboy':['#0f380f','#306230','#8bac0f','#9bbc0f'],
'Pastel':['#ffd6e0','#ffefcf','#fdffb6','#caffbf','#9bf6ff','#a0c4ff','#bdb2ff','#ffc6ff']};
export function usePalettes(){
  const [pals,setPals]=useState<Palettes>(()=>{try{const r=localStorage.getItem('pf_pals');if(r)return JSON.parse(r) as Palettes}catch{}return PRESETS});
  const [name,setName]=useState(Object.keys(pals)[0]);
  useEffect(()=>{try{localStorage.setItem('pf_pals',JSON.stringify(pals))}catch{}},[pals]);
  const colors=pals[name]??[];
  return{pals,name,setName,colors,
    add:(c:string)=>setPals(p=>p[name].includes(c)?p:{...p,[name]:[...p[name],c]}),
    remove:(i:number)=>setPals(p=>({...p,[name]:p[name].filter((_,j)=>j!==i)})),
    create:(n:string,c:string)=>{if(!n||pals[n])return;setPals(p=>({...p,[n]:[c]}));setName(n)}};
}
