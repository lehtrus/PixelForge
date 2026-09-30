import type {Tool} from './types';
export const TOOLS:[Tool,string,string][]=[['pencil','Lápis [P]','p'],['eraser','Borracha [E]','e'],['fill','Balde [G]','g'],['pick','Gotas [I]','i'],['line','Linha [L]','l']];
export default function Toolbar({tool,setTool}:{tool:Tool;setTool:(t:Tool)=>void}){
  return <div className="card tools">{TOOLS.map(([k,label])=>
    <button key={k} className={tool===k?'on':''} onClick={()=>setTool(k)}>{label}</button>)}</div>;
}
