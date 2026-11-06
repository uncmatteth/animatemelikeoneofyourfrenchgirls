import * as THREE from 'three';
// Layers are complete transparent drawings. The caller must repair concealed
// pixels in the artwork; overlapping polygon slices alone do not satisfy this.
export async function createSpriteRig(def){
 const root=new THREE.Group();const joints={};const layers={};
 const loader=new THREE.TextureLoader();
 for(const part of def.parts){
  const joint=new THREE.Group();joint.name=part.id;
  joint.position.set(...part.position);joints[part.id]=joint;
  (part.parent?joints[part.parent]:root).add(joint);
  const tex=await loader.loadAsync(part.image);tex.colorSpace=THREE.SRGBColorSpace;
  const mat=new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,side:THREE.DoubleSide});
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(part.size[0],part.size[1]),mat);
  mesh.position.set(...(part.offset||[0,0,0]));mesh.renderOrder=part.order||0;joint.add(mesh);layers[part.id]=mesh;
 }
 const rest=Object.fromEntries(Object.entries(joints).map(([id,j])=>[id,{p:j.position.clone(),r:j.rotation.clone()}]));
 function pose(state={}){
  for(const [id,j] of Object.entries(joints)){
   j.position.copy(rest[id].p);j.rotation.copy(rest[id].r);
   const s=state[id];if(s?.position)j.position.add(new THREE.Vector3(...s.position));
   if(s?.rotation)j.rotation.set(...s.rotation);
   layers[id].visible=s?.visible!==false;
  }
 }
 return {root,joints,layers,pose};
}
