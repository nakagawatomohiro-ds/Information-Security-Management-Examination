"use client";
interface ProgressBarProps{value:number;color?:string;height?:number;showLabel?:boolean;}
export function ProgressBar({value,color="bg-blue-500",height=8,showLabel=false}:ProgressBarProps){const pct=Math.round(Math.min(Math.max(value,0),1)*100);return(<div className="w-full"><div className="w-full bg-slate-200 rounded-full overflow-hidden" style={{height}}><div className={`h-full rounded-full ${color} animate-progress transition-all duration-500`} style={{width:`${pct}%`}}/></div>{showLabel&&<span className="text-xs text-slate-500 mt-1">{pct}%</span>}</div>);}
