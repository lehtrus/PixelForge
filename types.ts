export type Tool='pencil'|'eraser'|'fill'|'pick'|'line';
export interface Layer{id:string;name:string;vis:boolean;d:Uint32Array}
export interface Frame{layers:Layer[]}
export interface Project{w:number;h:number;frames:Frame[];f:number;l:number}
export type Palettes=Record<string,string[]>;
