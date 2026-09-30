import {useState} from 'react';
import type {usePalettes} from './palettes';
interface Props{pal:ReturnType<typeof usePalettes>;color:string;setColor:(c:string)=>void}
export default function PalettePanel({pal,color,setColor}:Props){
  const [nn,setNn]=useState('');
  return <div className="card"><h3>Cor e paleta</h3>
    <div className="row"><input type="color" value={color} onChange={e=>setColor(e.target.value)}/>
      <select style={{flex:1}} value={pal.name} onChange={e=>pal.setName(e.target.value)}>{Object.keys(pal.pals).map(k=><option key={k}>{k}</option>)}</select></div>
    <div className="sw">{pal.colors.map((c,i)=><i key={c+i} style={{background:c}} className={c===color?'sel':''}
      onClick={e=>e.shiftKey?pal.remove(i):setColor(c)}/>)}</div>
    <div className="row" style={{marginTop:8}}><button onClick={()=>pal.add(color)}>+ Cor atual</button><small>Shift+clique remove</small></div>
    <div className="row" style={{marginTop:8}}><input type="text" placeholder="Nova paleta" style={{flex:1}} value={nn} onChange={e=>setNn(e.target.value)}/>
      <button onClick={()=>{pal.create(nn.trim(),color);setNn('')}}>Criar</button></div></div>;
}
