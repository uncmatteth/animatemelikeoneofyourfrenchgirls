#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const args=process.argv.slice(2);
const outAt=args.indexOf('--out');
const out=outAt<0 ? process.env.CUTAWAY_OUT || 'output' : args.splice(outAt,2)[1];
if(args.length!==1 || !out) {console.error('Usage: node scripts/build.mjs <scene-directory> [--out output-directory]');process.exit(2);}
const run=spawnSync(process.execPath,[path.join(root,'vendor/cutaway/sims/build.mjs'),path.resolve(args[0])],{
 stdio:'inherit',env:{...process.env,CUTAWAY_DEPS:process.env.CUTAWAY_DEPS||path.join(root,'node_modules'),CUTAWAY_OUT:path.resolve(out)}
});
if(run.error)throw run.error;
process.exit(run.status ?? 1);
