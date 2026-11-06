#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
process.env.CUTAWAY_DEPS ||= path.join(root,'node_modules');
if(!process.env.CHROMIUM){
 for(const p of ['/opt/google/chrome/chrome','/usr/bin/chromium','/usr/bin/chromium-browser']){
  if(fs.existsSync(p)){process.env.CHROMIUM=p;break;}
 }
}
// The reviewed upstream runner owns capture, frame stepping and FFmpeg.
await import(pathToFileURL(path.join(root,'vendor/cutaway/sims/capture.mjs')));
