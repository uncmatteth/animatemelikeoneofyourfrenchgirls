// A real separated sprite atlas, not polygon slices of one flattened standing pose.
// Each frame has its own complete artwork and overlap at the specified pivot.
export function trimAtlasFrames(image,{columns=4,rows=3,threshold=16}={}){
 const c=document.createElement('canvas');c.width=image.width;c.height=image.height;
 const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);
 const pixels=ctx.getImageData(0,0,c.width,c.height).data,frames=[];
 for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
  const x0=Math.round(col*c.width/columns),x1=Math.round((col+1)*c.width/columns),y0=Math.round(row*c.height/rows),y1=Math.round((row+1)*c.height/rows);
  let left=x1,right=x0,top=y1,bottom=y0;
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(pixels[(y*c.width+x)*4+3]>=threshold){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
  frames.push(right>=left&&bottom>=top?{x:left,y:top,w:right-left+1,h:bottom-top+1}:null);
 }
 return frames;
}
export function validateRig(def){
 const errors=[],ids=new Set(def.parts.map(p=>p.id));
 for(const p of def.parts){
  if(p.parent&&!ids.has(p.parent))errors.push(`missing parent ${p.parent}`);
  let next=p;const seen=new Set();
  while(next){if(seen.has(next.id)){errors.push(`cyclic joint ${p.id}`);break;}seen.add(next.id);next=def.parts.find(q=>q.id===next.parent);}
  if(!p.size||p.size.length!==2||p.size.some(n=>!(n>0)))errors.push(`invalid size ${p.id}`);
 }
 if(ids.size!==def.parts.length)errors.push('duplicate part id');return errors;
}
export function createAtlasRig(image,frames,definition){
 const errors=validateRig(definition);if(errors.length)throw Error(errors.join('; '));
 const byId=Object.fromEntries(definition.parts.map(p=>[p.id,p]));
 function transform(ctx,part,pose){
  if(part.parent)transform(ctx,byId[part.parent],pose);
  const s=pose[part.id]||{};ctx.translate(part.anchor[0]+(s.x||0),part.anchor[1]+(s.y||0));ctx.rotate((part.angle||0)+(s.angle||0));
 }
 function draw(ctx,{x,y,height,pose={},opacity=1,flip=false}={}){
  ctx.save();ctx.globalAlpha*=opacity;ctx.translate(x,y);ctx.scale((flip?-1:1)*height/definition.height,height/definition.height);
  for(const p of definition.parts){
   const s=pose[p.id]||{};if(s.visible===false)continue;
   const frame=frames[s.frame??p.frame];if(!frame)continue;
   ctx.save();transform(ctx,p,pose);const o=p.origin||[.5,0];
   ctx.drawImage(image,frame.x,frame.y,frame.w,frame.h,-p.size[0]*o[0],-p.size[1]*o[1],...p.size);ctx.restore();
  }
  ctx.restore();
 }
 return {draw,frames,definition};
}
