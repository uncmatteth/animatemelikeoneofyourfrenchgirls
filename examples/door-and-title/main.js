import * as THREE from 'three';
import {runSim} from 'cutaway-kit/runtime.js';
import {between} from '../../lib/timeline.js';
import {createTitle} from '../../lib/title.js';
const DURATION=8;
await runSim({duration:DURATION,fps:24,hud:{enabled:false},director:{enabled:false},seed:13},async({canvas})=>{
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
 renderer.setPixelRatio(devicePixelRatio);renderer.setSize(innerWidth,innerHeight);
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
 const scene=new THREE.Scene();scene.background=new THREE.Color('#04131c');scene.fog=new THREE.FogExp2('#04131c',.018);
 const camera=new THREE.PerspectiveCamera(36,innerWidth/innerHeight,.1,100);camera.position.set(0,0,16);camera.lookAt(0,0,0);
 scene.add(new THREE.AmbientLight('#94b6c6',1.4));
 const key=new THREE.PointLight('#ffdc94',95);key.position.set(-4,4,6);scene.add(key);
 const fill=new THREE.PointLight('#57bbdc',65);fill.position.set(5,-1,4);scene.add(fill);
 const title=createTitle(scene,{});
 const back=new THREE.Mesh(new THREE.PlaneGeometry(80,50),new THREE.MeshBasicMaterial({color:'#04131c'}));back.position.z=-12;scene.add(back);
 return {render(t){title.render(t,DURATION);camera.position.z=16-.5*between(t,0,DURATION);renderer.render(scene,camera);},resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);}};
});
window.DURATION=DURATION;window.FPS=24;window.seek=t=>window.SIM.render(t);
