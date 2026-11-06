#!/usr/bin/env node
import fs from 'node:fs';
import {validateTimeline} from '../lib/timeline.js';
if(!process.argv[2]){console.error('Usage: node scripts/check-scene.mjs timeline.json');process.exit(2);}
const d=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const errors=validateTimeline(d);
console.log(JSON.stringify({status:errors.length?'FAIL':'PASS',errors,shots:d.shots?.length||0,anchors:d.anchors?.length||0,visualReview:'not established by structural validation'},null,2));
process.exitCode=errors.length?1:0;
