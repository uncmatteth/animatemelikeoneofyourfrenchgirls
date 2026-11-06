// Articulated source-art puppet. Coordinates are in the atlas's original pixels.
// Hidden joints must be drawn into the source artwork before scaling this method.
export function createCanvasPuppet(image,definition){
 const parts=Object.fromEntries(definition.parts.map(p=>[p.id,p]));
 function path(ctx,points){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();}
 function transform(ctx,id,pose,seen=new Set()){
  if(seen.has(id))throw Error(`Cyclic rig parent: ${id}`);seen.add(id);
  const p=parts[id];if(!p)throw Error(`Missing rig part ${id}`);
  if(p.parent)transform(ctx,p.parent,pose,seen);
  const pivot=p.pivot;const s=pose[id]||{};
  ctx.translate(pivot[0]+(s.x||0),pivot[1]+(s.y||0));ctx.rotate(s.angle||0);ctx.translate(-pivot[0],-pivot[1]);
 }
 function draw(ctx,{x,y,height,pose={},opacity=1,flip=false,features={}}={}){
  const sc=height/definition.height;
  ctx.save();ctx.globalAlpha*=opacity;ctx.translate(x,y);ctx.scale((flip?-1:1)*sc,sc);ctx.translate(-definition.ground[0],-definition.ground[1]);
  for(const p of definition.parts){
   if(pose[p.id]?.visible===false)continue;
   ctx.save();transform(ctx,p.id,pose);path(ctx,p.polygon);
   for(const hole of p.holes||[]){ctx.moveTo(...hole[0]);hole.slice(1).forEach(q=>ctx.lineTo(...q));ctx.closePath();}
   ctx.clip('evenodd');ctx.drawImage(image,0,0);features[p.id]?.(ctx);ctx.restore();
  }
  ctx.restore();
 }
 return {draw,definition};
}
