#!/usr/bin/env node
import {chromium} from 'playwright';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
if(!process.argv[2]){console.error('Usage: node scripts/smoke-render.mjs scene.html');process.exit(2);}
const opts={};for(const p of [process.env.CHROMIUM,'/opt/google/chrome/chrome','/usr/bin/chromium'])if(p&&fs.existsSync(p)){opts.executablePath=p;break;}
const browser=await chromium.launch(opts);
try{
 const page=await browser.newPage({viewport:{width:960,height:540}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.__CAPTURE=true;});
 await page.goto(pathToFileURL(path.resolve(process.argv[2])).href+'?render');
 await page.waitForFunction(()=>window.SIM?.ready,{timeout:30000});
 const hashes=[];
 for(const t of [.7,3,.7]){await page.evaluate(t=>window.SIM.render(t),t);hashes.push(createHash('sha256').update(await page.screenshot()).digest('hex'));}
 if(errors.length)throw Error(errors.join('; '));
 if(hashes[0]!==hashes[2])throw Error('render(t) is not deterministic when seeking backwards');
 if(hashes[0]===hashes[1])throw Error('sample scene produced no visible change between sampled times');
 console.log(JSON.stringify({status:'PASS',backwardSeekDeterministic:true,sampledFramesDiffer:true,visualReview:'requires inspection',hashes},null,2));
}finally{await browser.close();}
