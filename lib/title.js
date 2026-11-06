import * as THREE from 'three';
import {between,clamp,ease,lerp} from './timeline.js';
export function createTitle(scene,{title='AN OPEN DOOR',subtitle='A STUDY IN LIGHT & MOTION',eyebrow='A REFERENCE-LED ANIMATION',seed=13}={}){
 const root=new THREE.Group();scene.add(root);
 const ink=new THREE.Color('#04121c');
 const crystalMat=new THREE.MeshPhysicalMaterial({color:'#3b8e9f',metalness:.35,roughness:.22,transmission:.2,thickness:1,clearcoat:1});
 const gold=new THREE.MeshStandardMaterial({color:'#c5a15d',metalness:.8,roughness:.28});
 const shards=[];
 for(let i=0;i<13;i++){
  const g=new THREE.Group();
  const s=new THREE.Mesh(new THREE.OctahedronGeometry(.25+(i%3)*.09,0),crystalMat.clone());
  s.scale.set(.58,1.8,.65);g.add(s);
  const edges=new THREE.LineSegments(new THREE.EdgesGeometry(s.geometry),new THREE.LineBasicMaterial({color:'#d9b77f',transparent:true,opacity:.5}));edges.scale.copy(s.scale);g.add(edges);root.add(g);shards.push(g);
 }
 const hoops=[];
 for(let i=0;i<3;i++){
  const r=new THREE.Mesh(new THREE.TorusGeometry(3.2+i*.22,.012,8,160),gold);
  r.rotation.x=i*.44;r.rotation.y=i*.3;root.add(r);hoops.push(r);
 }
 const specks=[];const pgeo=new THREE.BufferGeometry();
 let x=seed;
 const rand=()=>{x=(1664525*x+1013904223)>>>0;return x/4294967296;};
 for(let i=0;i<220;i++)specks.push((rand()-.5)*22,(rand()-.5)*13,-2-rand()*8);
 pgeo.setAttribute('position',new THREE.Float32BufferAttribute(specks,3));
 const particles=new THREE.Points(pgeo,new THREE.PointsMaterial({color:'#c9ae70',size:.025,transparent:true,opacity:.45}));root.add(particles);
 const text=document.createElement('canvas');text.width=2560;text.height=1000;
 const ctx=text.getContext('2d');
 const tt=new THREE.CanvasTexture(text);tt.colorSpace=THREE.SRGBColorSpace;
 const plane=new THREE.Mesh(new THREE.PlaneGeometry(14.6,5.7),new THREE.MeshBasicMaterial({map:tt,transparent:true,depthTest:false,depthWrite:false}));
 plane.position.z=2.9;plane.renderOrder=50;root.add(plane);
 function spaced(str,y,font,spacing,color){
  ctx.font=font;ctx.fillStyle=color;
  const widths=[...str].map(c=>ctx.measureText(c).width);let x=(2560-widths.reduce((a,b)=>a+b,0)-spacing*(widths.length-1))/2;
  [...str].forEach((c,i)=>{ctx.fillText(c,x,y);x+=widths[i]+spacing;});
 }
 let lastProgress=-1;
 function render(t,duration=8){
  root.visible=t>=0&&t<duration;
  if(!root.visible)return;
  const reveal=between(t,.35,2.4);const fade=1-between(t,duration-1,duration);
  const settle=between(t,0,3);
  shards.forEach((g,i)=>{const a=i/13*Math.PI*2+(.4-.4*settle);const r=lerp(5,3.45,settle);g.position.set(Math.cos(a)*r,Math.sin(a)*r,.2*Math.sin(i));g.rotation.set(.3*Math.sin(t*.22+i),a+t*.06,.15*Math.cos(i));g.scale.setScalar(.8+.12*Math.sin(i*1.2));});
  hoops.forEach((r,i)=>{r.rotation.set(.2+i*.35+t*.018,i*.25+t*.025,i*.16);});
  particles.rotation.z=t*.008;
  const prog=Math.round(reveal*255)/255,alpha=Math.round(fade*255)/255;
  const key=prog*1000+alpha;
  if(key!==lastProgress){
   ctx.clearRect(0,0,2560,1000);ctx.textBaseline='middle';ctx.globalAlpha=alpha;
   spaced(eyebrow,280,'500 31px Georgia',12,'#c1ad83');
   ctx.save();ctx.beginPath();ctx.rect(80,350,2400*prog,260);ctx.clip();
   const grad=ctx.createLinearGradient(0,390,0,600);grad.addColorStop(0,'#fff2cc');grad.addColorStop(.45,'#e5cc91');grad.addColorStop(1,'#9d743c');
   let size=title.length>20?100:138;
   spaced(title,490,`500 ${size}px Georgia`,10,grad);ctx.restore();
   ctx.globalAlpha=alpha*between(t,2,3.3);
   spaced(subtitle,650,'400 39px Georgia',8,'#ddcba8');
   ctx.strokeStyle='#b99451';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(860,590);ctx.lineTo(1700,590);ctx.stroke();
   ctx.globalAlpha=1;tt.needsUpdate=true;lastProgress=key;
  }
  root.scale.setScalar(1+t*.002);
 }
 return {root,render};
}
