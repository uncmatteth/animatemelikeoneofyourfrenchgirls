#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const args=process.argv.slice(2);
const outAt=args.indexOf('--out');
if(outAt<0||!args[outAt+1]){console.error('Pass --out with an explicit output path.');process.exit(2);}
const output=path.resolve(args[outAt+1]);
const env={...process.env,CUTAWAY_DEPS:process.env.CUTAWAY_DEPS||path.join(root,'node_modules')};
if(!env.CHROMIUM){
 for(const p of ['/opt/google/chrome/chrome','/usr/bin/chromium','/usr/bin/chromium-browser']){
  if(fs.existsSync(p)){env.CHROMIUM=p;break;}
 }
}
// Preserve the pinned upstream runner; verify its actual output in this parent.
const start=Date.now();
const capture=spawnSync(process.execPath,[path.join(root,'vendor/cutaway/sims/capture.mjs'),...args],{stdio:'inherit',env});
if(capture.error)throw capture.error;
if(capture.status!==0)process.exit(capture.status??1);
if(!fs.existsSync(output)||fs.statSync(output).size===0||fs.statSync(output).mtimeMs<start-1000){
 console.error(`Capture did not produce a fresh nonempty output: ${output}`);process.exit(1);
}
const check=spawnSync(env.FFPROBE||'ffprobe',['-v','error','-show_entries','stream=codec_type,width,height,r_frame_rate:format=duration,size','-of','json',output],{encoding:'utf8',env});
if(check.error)throw check.error;
if(check.status!==0){console.error(check.stderr);process.exit(check.status??1);}
const metadata=JSON.parse(check.stdout);
if(!metadata.streams?.some(s=>s.codec_type==='video'&&s.width>0&&s.height>0)){
 console.error('Capture output has no decodable image/video stream.');process.exit(1);
}
console.log(JSON.stringify({captureVerified:true,output,streams:metadata.streams,format:metadata.format,visualQuality:'requires inspection'}));
