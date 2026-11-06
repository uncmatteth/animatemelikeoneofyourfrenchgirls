export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const ease=(v)=>{v=clamp(v);return v*v*(3-2*v);};
export const between=(t,start,end)=>ease((t-start)/(end-start));
export const lerp=(a,b,t)=>a+(b-a)*t;
export function sourceTime(t,insertions=[]){
 let offset=0;
 for(const e of [...insertions].sort((a,b)=>a.at-b.at)){
  const start=e.at+offset;
  if(t<start)return {time:t-offset,insert:null};
  if(t<start+e.duration)return {time:e.at,insert:e,local:t-start};
  offset+=e.duration;
 }
 return {time:t-offset,insert:null};
}
export function speakingAt(cues,t){return cues.find(c=>t>=c.start_seconds && t<c.end_seconds)||null;}
export function mouthAmount(envelope,t,speaker,cues){
 const cue=speakingAt(cues,t);
 if(!cue || cue.speaker!==speaker)return 0;
 const i=Math.floor(t*(envelope.rate||30));
 return clamp((envelope.values?.[i]||0)*1.8);
}
export function validateTimeline(d){
 const errors=[];
 if(!Number.isFinite(d.duration)||d.duration<=0)errors.push('duration must be positive');
 if(!Number.isFinite(d.fps)||d.fps<=0)errors.push('fps must be positive');
 for(const [i,s] of (d.shots||[]).entries()){
  if(!s.id)errors.push(`shot ${i} needs an id`);
  if(!(s.end>s.start)||s.start<0||s.end>d.duration+1e-6)errors.push(`shot ${i} outside timeline`);
  if(i && s.start<d.shots[i-1].end-1e-6)errors.push(`shot ${i} overlaps previous shot`);
 }
 const ids=new Set();
 for(const a of d.anchors||[]){
  if(ids.has(a.id))errors.push(`duplicate anchor ${a.id}`);
  ids.add(a.id);
  if(!Array.isArray(a.position)||a.position.length!==3||a.position.some(v=>!Number.isFinite(v)))errors.push(`invalid anchor ${a.id}`);
 }
 for(const e of d.insertions||[]){if(!Number.isFinite(e.at)||!(e.duration>0))errors.push('invalid timeline insertion');}
 return errors;
}
