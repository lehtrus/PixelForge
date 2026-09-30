import {useEffect,useState} from 'react';
import type {Tool} from './types';
import {useEditor} from './useEditor';
import {usePalettes} from './palettes';
import {setSize} from './ops';
import Toolbar,{TOOLS} from './Toolbar';
import CanvasBoard from './CanvasBoard';
import FramesPanel from './FramesPanel';
import PalettePanel from './PalettePanel';
import LayersPanel from './LayersPanel';
import Preview from './Preview';
import ExportDialog from './ExportDialog';
const TICK='★ PIXELFORGE ★ DROP 01 ★ CAMADAS ★ PALETAS CUSTOM ★ SPRITE SHEET ★ FEITO NO NAVEGADOR '.repeat(4);
export default function App(){
  const {p,dispatch}=useEditor(),pal=usePalettes();
  const [tool,setTool]=useState<Tool>('pencil'),[color,setColor]=useState('#ff4d6d');
  const [zoom,setZoom]=useState(14),[grid,setGrid]=useState(true),[mir,setMir]=useState(false),[exp,setExp]=useState(false);
  useEffect(()=>{
    const h=(e:KeyboardEvent)=>{
      if((e.target as HTMLElement).tagName==='INPUT')return;const k=e.key.toLowerCase(),m=e.ctrlKey||e.metaKey;
      if(m&&k==='z'){e.preventDefault();dispatch({t:e.shiftKey?'redo':'undo'});return}
      if(m&&k==='y'){e.preventDefault();dispatch({t:'redo'});return}
      const t=TOOLS.find(x=>x[2]===k);if(t)setTool(t[0]);
    };
    addEventListener('keydown',h);return()=>removeEventListener('keydown',h);
  },[dispatch]);
  return <>
    <header><div className="logo">PF</div><h1>Pixel<span>Forge</span></h1><small>pixel art lab · drop 01</small><div className="sp"/>
      <select value={p.w} onChange={e=>dispatch({t:'edit',fn:q=>setSize(q,+e.target.value)})}>{[16,32,48,64].map(n=><option key={n}>{n}</option>)}</select>
      <button onClick={()=>dispatch({t:'undo'})}>↶ Undo</button><button onClick={()=>dispatch({t:'redo'})}>↷ Redo</button>
      <button id="exp" onClick={()=>setExp(true)}>Exportar</button></header>
    <div className="tick"><div>{TICK}</div></div>
    <main>
      <Toolbar tool={tool} setTool={setTool}/>
      <div className="stage"><div className="card cv"><CanvasBoard p={p} tool={tool} color={color} zoom={zoom} grid={grid} mir={mir} dispatch={dispatch} onPick={c=>{setColor(c);setTool('pencil')}}/></div>
        <FramesPanel p={p} dispatch={dispatch}/></div>
      <div className="side"><PalettePanel pal={pal} color={color} setColor={setColor}/><LayersPanel p={p} dispatch={dispatch}/>
        <div className="card"><h3>Opções</h3>
          <div className="row"><label>Zoom <input type="range" min={4} max={32} value={zoom} onChange={e=>setZoom(+e.target.value)}/></label></div>
          <div className="row" style={{marginTop:6}}><label><input type="checkbox" checked={grid} onChange={e=>setGrid(e.target.checked)}/> Grade</label>
            <label><input type="checkbox" checked={mir} onChange={e=>setMir(e.target.checked)}/> Espelhar</label></div></div>
        <Preview p={p}/></div>
    </main>
    {exp&&<ExportDialog p={p} onClose={()=>setExp(false)}/>}
  </>;
}
